import { Router, Request, Response } from 'express';
import prisma from '../db';
import { authenticateToken } from '../middleware/auth';
import { enforceTenancy } from '../middleware/tenancy';
import { messageSchema } from '../utils/validation';
import { whatsappService } from '../services/whatsapp';
import axios from 'axios';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

// ==========================================
// UNAUTHENTICATED ROUTES (Called by n8n)
// ==========================================

// POST /api/messages/webhook/:teamId
router.post('/webhook/:teamId', async (req: Request, res: Response) => {
    try {
        const teamId = parseInt(req.params.teamId);
        if (isNaN(teamId)) {
            return res.status(400).json({ error: 'Valid teamId parameter is required' });
        }

        const { customer_phone, message_body, sender } = req.body;
        if (!customer_phone || !message_body) {
            return res.status(400).json({ error: 'customer_phone and message_body are required' });
        }

        const phone = customer_phone.replace('+', '');

        let contact = await prisma.contact.findFirst({
            where: { phone: { contains: phone }, teamId }
        });

        if (!contact) {
            contact = await prisma.contact.create({
                data: {
                    name: phone,
                    phone: phone,
                    status: 'new-order',
                    lastMessage: message_body,
                    isAiActive: true,
                    teamId
                }
            });
        } else {
            contact = await prisma.contact.update({
                where: { id: contact.id },
                data: {
                    lastMessage: message_body,
                    unread: { increment: 1 },
                    timestamp: new Date()
                }
            });
        }

        const message = await prisma.message.create({
            data: {
                text: message_body,
                sent: false,
                contactId: contact.id,
                teamId
            }
        });

        const io = req.app.get('io');
        if (io) {
            io.to(`team:${teamId}`).emit('newMessage', message);
            io.to(`team:${teamId}`).emit('contactUpdated', contact);
        }

        return res.json({ success: true, message });
    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// ==========================================
// AUTHENTICATED ROUTES
// ==========================================
router.use(authenticateToken);
router.use(enforceTenancy);

// GET messages for a specific phone (n8n API requirement)
router.get('/phone/:phone', async (req: Request, res: Response) => {
    try {
        const phone = req.params.phone.replace('+', '');
        const contact = await prisma.contact.findFirst({
            where: { phone: { contains: phone } }
        });
        
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        const messages = await prisma.message.findMany({
            where: { contactId: contact.id },
            orderBy: { timestamp: 'asc' }
        });
        
        res.json(messages);
    } catch (error) {
        console.error('Error fetching by phone:', error);
        res.status(500).json({ error: 'Failed to fetch messages by phone' });
    }
});

// GET messages for a specific contact (Dashboard uses this)
router.get('/:contactId', async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const teamId = user?.teamId;
        const messages = await prisma.message.findMany({
            where: {
                contactId: req.params.contactId,
                teamId
            },
            orderBy: {
                timestamp: 'asc'
            }
        });
        // Validate ownership based on team
        const contact = await prisma.contact.findUnique({ where: { id: req.params.contactId } });
        if (!contact || (contact as any).teamId !== teamId) {
            return res.status(404).json({ error: 'Messages not found' });
        }
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// POST new message (Dashboard to n8n outbound)
router.post('/send', async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const { text, contactId } = req.body;
        if (!text || !contactId) return res.status(400).json({ error: 'text and contactId required' });
        
        const contact = await prisma.contact.findUnique({ where: { id: contactId } });
        if (!contact || (contact as any).teamId !== user?.teamId) {
            return res.status(403).json({ error: 'Forbidden: contact not in your team' });
        }
        if (!contact) return res.status(404).json({ error: 'contact not found' });

        // Database updates
        const message = await prisma.message.create({
            data: { text, sent: true, contactId }
        });

        const updatedContact = await prisma.contact.update({
            where: { id: contactId },
            data: { 
                lastMessage: text, 
                timestamp: new Date(),
                isAiActive: false // Auto disable AI on manual intervene
            }
        });

        // First, trigger sending out via Native WhatsApp Graph API
        try {
            if (contact.phone) {
                // Ensure phone has no tricky prefix spaces/plus if WhatsApp requires clean integer strings
                const cleanPhone = contact.phone.replace(/[^0-9]/g, '');
                const result = await whatsappService.sendWhatsAppMessage(cleanPhone, text);
                
                // Fallback to N8N if direct WhatsApp is not configured
                if (result?.simulated && process.env.N8N_OUTBOUND_WEBHOOK_URL) {
                    console.log('[Messages Route] Direct WhatsApp not configured. Falling back to N8N Webhook...');
                    await axios.post(process.env.N8N_OUTBOUND_WEBHOOK_URL, {
                        to: cleanPhone,
                        message: text,
                        contactId: contact.id,
                        contactName: contact.name
                    }).catch(err => console.error('[Messages Route] N8N Fallback failed:', err.message));
                }
            }
        } catch (whatsappError) {
             console.error("WhatsApp Integration Error (Bypassed so message saves locally):", whatsappError instanceof Error ? whatsappError.message : String(whatsappError));
             
             // Even on error, try N8N fallback as last resort
             if (process.env.N8N_OUTBOUND_WEBHOOK_URL && contact.phone) {
                const cleanPhone = contact.phone.replace(/[^0-9]/g, '');
                axios.post(process.env.N8N_OUTBOUND_WEBHOOK_URL, {
                    to: cleanPhone,
                    message: text,
                    contactId: contact.id
                }).catch(() => {});
             }
        }

        const io = req.app.get('io');
        const teamIdForEmit = (contact as any)?.teamId ?? (req as any).user?.teamId;
        if (io) {
            if (teamIdForEmit) io.to(`team:${teamIdForEmit}`).emit('newMessage', message);
            io.to(`team:${teamIdForEmit}`).emit('contactUpdated', updatedContact);
        }

        return res.json(message);
    } catch (error) {
        console.error('Send error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// POST upload attachment
router.post('/:contactId/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
        const { contactId } = req.params;
        if (!req.file) return res.status(400).json({ error: 'No file provided' });

        const contact = await prisma.contact.findUnique({ where: { id: contactId } });
        if (!contact) return res.status(404).json({ error: 'Contact not found' });

        const attachmentUrl = `/uploads/${req.file.filename}`;
        const attachmentType = req.file.mimetype;
        const attachmentName = req.file.originalname;

        const message = await prisma.message.create({
            data: { 
                text: `[Attachment: ${attachmentName}]`, 
                sent: true, 
                contactId,
                attachmentUrl,
                attachmentType,
                attachmentName
            }
        });

        const updatedContact = await prisma.contact.update({
            where: { id: contactId },
            data: { 
                lastMessage: `[File Attachment]`, 
                timestamp: new Date(),
                isAiActive: false // Auto disable AI on manual intervene
            }
        });

        const io = req.app.get('io');
        const teamIdForEmit2 = (contact as any)?.teamId ?? (req as any).user?.teamId;
        if (io) {
            if (teamIdForEmit2) io.to(`team:${teamIdForEmit2}`).emit('newMessage', message);
            io.to(`team:${teamIdForEmit2}`).emit('contactUpdated', updatedContact);
        }

        return res.json(message);
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: 'Failed to upload' });
    }
});

// Legacy POST for validation backwards compatibility (optional)
router.post('/', async (req: Request, res: Response) => {
    try {
        const validation = messageSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validation.error.errors
            });
        }

        const { text, sent, contactId } = validation.data;
        const contact = await prisma.contact.findUnique({ where: { id: contactId } });

        if (!contact) return res.status(404).json({ error: 'Contact not found' });

        if (sent && contact.phone) {
            try {
                const phone = contact.phone.replace(/[^0-9]/g, '');
                const result = await whatsappService.sendWhatsAppMessage(phone, text);
                
                if (result?.simulated && process.env.N8N_OUTBOUND_WEBHOOK_URL) {
                    axios.post(process.env.N8N_OUTBOUND_WEBHOOK_URL, {
                        to: phone,
                        message: text,
                        contactId: contact.id
                    }).catch(() => {});
                }
            } catch (whatsappError) {
                console.error("WhatsApp Integration Error (Bypassed so message saves):", whatsappError instanceof Error ? whatsappError.message : String(whatsappError));
                
                if (process.env.N8N_OUTBOUND_WEBHOOK_URL) {
                    const phone = contact.phone.replace(/[^0-9]/g, '');
                    axios.post(process.env.N8N_OUTBOUND_WEBHOOK_URL, {
                        to: phone,
                        message: text,
                        contactId: contact.id
                    }).catch(() => {});
                }
            }
        }

        const message = await prisma.message.create({
            data: { text, sent: !!sent, contactId }
        });

        const updatedContact = await prisma.contact.update({
            where: { id: contactId },
            data: { lastMessage: text, timestamp: new Date() }
        });

        const io = req.app.get('io');
        const teamIdForEmit3 = (contact as any)?.teamId ?? (req as any).user?.teamId;
        if (io) {
            if (teamIdForEmit3) io.to(`team:${teamIdForEmit3}`).emit('newMessage', message);
            io.to(`team:${teamIdForEmit3}`).emit('contactUpdated', updatedContact);
        }

        res.json(message);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Failed to create message' });
    }
});

export default router;
