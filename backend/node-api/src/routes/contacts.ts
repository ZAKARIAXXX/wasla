import { Router, Request, Response } from 'express';
import prisma from '../db';
import { authenticateToken } from '../middleware/auth';
import { enforceTenancy } from '../middleware/tenancy';
import { contactSchema, contactUpdateSchema } from '../utils/validation';

const router = Router();

router.use(authenticateToken);
router.use(enforceTenancy);

// GET all contacts
router.get('/', async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const teamId = user?.teamId as number;

        const assignedToFilter = req.query.assignedTo ? parseInt(req.query.assignedTo as string) : undefined;
        const contacts = await (prisma.contact as any).findMany({
            where: {
                teamId,
                ...(assignedToFilter ? { assignedToId: assignedToFilter } : {})
            },
            orderBy: { timestamp: 'desc' },
            include: {
                assignedTo: { select: { id: true, name: true, email: true } },
                tags: { include: { tag: true } }
            }
        });
        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

// GET /api/contacts/export
router.get('/export', async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const teamId = user?.teamId;
        const contacts = await prisma.contact.findMany({ where: { teamId } });
        const csvRows = ['id,name,phone,email,status,totalSpent,createdAt'];
        contacts.forEach(c => {
            csvRows.push(`${c.id},"${c.name.replace(/"/g, '""')}","${c.phone}","${c.email || ''}","${c.status}",${c.totalSpent},"${c.createdAt.toISOString()}"`);
        });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
        res.send(csvRows.join('\n'));
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Failed to export' });
    }
});

// POST /api/contacts/import
router.post('/import', async (req: Request, res: Response) => {
    try {
        const { contacts } = req.body;
        if (!Array.isArray(contacts)) return res.status(400).json({ error: 'Invalid data format' });

        const teamId = (req as any).user?.teamId as number;
        let count = 0;
        for (const c of contacts) {
            try {
                await prisma.contact.create({
                    data: {
                        name: c.name || 'Unknown',
                        phone: String(c.phone || ''),
                        email: c.email || null,
                        status: c.status || 'new-order',
                        totalSpent: Number(c.totalSpent) || 0,
                        teamId
                    }
                });
                count++;
            } catch {} // skip duplicates
        }

        const io = req.app.get('io');
        const teamIdForEmit = (req as any).user?.teamId;
        if (io) io.to(`team:${teamIdForEmit}`).emit('contactsImported');

        res.json({ count });
    } catch (error) {
        console.error('Import error:', error);
        res.status(500).json({ error: 'Failed to import contacts' });
    }
});

// POST new contact
router.post('/', async (req: Request, res: Response) => {
    try {
        const validation = contactSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: validation.error.errors 
            });
        }

        const { name, phone, status, totalSpent, reliability } = validation.data;
        const teamId = (req as any).user?.teamId as number;

        const contact = await (prisma.contact as any).create({
            data: {
                name,
                phone,
                status: status || 'new-order',
                totalSpent: totalSpent || 0,
                reliability: reliability || 10,
                teamId
            }
        });

        res.json(contact);
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ error: 'Failed to create contact' });
    }
});

// POST /assign-next (Auto round-robin)
router.post('/assign-next', async (req: Request, res: Response) => {
    try {
        const teamId = (req as any).user?.teamId as number;
        // Find one unassigned contact for THIS team
        const unassigned = await prisma.contact.findFirst({
            where: { teamId, assignedToId: null, status: { notIn: ['delivered', 'paid'] } },
            orderBy: { timestamp: 'asc' }
        });

        if (!unassigned) {
            return res.status(404).json({ message: 'No unassigned contacts' });
        }

        // Find users IN THIS TEAM with least active assignments
        const users = await prisma.user.findMany({
            where: { teamId },
            include: {
                _count: {
                    select: { contacts: { where: { status: { notIn: ['delivered', 'paid'] } } } }
                }
            }
        });

        if (users.length === 0) {
            return res.status(400).json({ error: 'No team members available' });
        }

        // Sort users by assignment count ascending
        users.sort((a, b) => a._count.contacts - b._count.contacts);
        const assignedUser = users[0];

        const updatedContact = await prisma.contact.update({
            where: { id: unassigned.id },
            data: { assignedToId: assignedUser.id },
            include: { assignedTo: { select: { id: true, name: true, email: true } } }
        });

        const io = req.app.get('io');
        const teamIdForEmit2 = (req as any).user?.teamId;
        if (io) io.to(`team:${teamIdForEmit2}`).emit('contactUpdated', updatedContact);

        res.json(updatedContact);
    } catch (error) {
        console.error('Error auto-assigning:', error);
        res.status(500).json({ error: 'Failed to auto-assign contact' });
    }
});

// GET single contact by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const teamId = (req as any).user?.teamId as number;
        const contact = await prisma.contact.findUnique({
            where: { id: req.params.id }
        });
        if (!contact || contact.teamId !== teamId) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json(contact);
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ error: 'Failed to fetch contact' });
    }
});

// DELETE contact
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const teamId = (req as any).user?.teamId as number;
        const contact = await prisma.contact.findUnique({ where: { id: req.params.id } });
        if (!contact || contact.teamId !== teamId) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        await prisma.contact.delete({ where: { id: req.params.id } });
        res.json({ message: 'Contact deleted' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: "Failed to delete contact" });
    }
});

// PUT update contact
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const validation = contactUpdateSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: validation.error.errors 
            });
        }

        const { orderStatus, notes, totalSpent, status, name, phone, reliability, isAiActive, unread, assignedToId } = validation.data;

        const updateData: Record<string, unknown> = {};
        if (orderStatus !== undefined) updateData.orderStatus = orderStatus;
        if (notes !== undefined) updateData.notes = notes;
        if (totalSpent !== undefined) updateData.totalSpent = totalSpent;
        if (status !== undefined) updateData.status = status;
        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (reliability !== undefined) updateData.reliability = reliability;
        if (isAiActive !== undefined) updateData.isAiActive = isAiActive;
        if (unread !== undefined) updateData.unread = unread;
        if (assignedToId !== undefined) updateData.assignedToId = assignedToId;

        const contact = await prisma.contact.update({
            where: { id: req.params.id },
            data: updateData
        });

        const io = req.app.get('io');
        const teamIdForEmit3 = (req as any).user?.teamId;
        if (io) io.to(`team:${teamIdForEmit3}`).emit('contactUpdated', contact);

        res.json(contact);
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ error: "Failed to update contact" });
    }
});

// POST manually assign
router.post('/:id/assign', async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId || (req as any).user?.id;
        
        if (!userId) {
            return res.status(401).json({ error: 'User ID required' });
        }

        const updatedContact = await prisma.contact.update({
            where: { id: req.params.id },
            data: { assignedToId: userId },
            include: { assignedTo: { select: { id: true, name: true, email: true } } }
        });

        const io = req.app.get('io');
        const teamIdForEmit4 = (req as any).user?.teamId;
        if (io) io.to(`team:${teamIdForEmit4}`).emit('contactUpdated', updatedContact);

        res.json(updatedContact);
    } catch (error) {
        console.error('Error assigning contact:', error);
        res.status(500).json({ error: 'Failed to assign contact' });
    }
});

// POST unclaim contact
router.post('/:id/unclaim', async (req: Request, res: Response) => {
    try {
        const updatedContact = await prisma.contact.update({
            where: { id: req.params.id },
            data: { assignedToId: null },
            include: { assignedTo: { select: { id: true, name: true, email: true } } }
        });

        const io = req.app.get('io');
        const teamIdForEmit5 = (req as any).user?.teamId;
        if (io) io.to(`team:${teamIdForEmit5}`).emit('contactUpdated', updatedContact);

        res.json(updatedContact);
    } catch (error) {
        console.error('Error unclaiming contact:', error);
        res.status(500).json({ error: 'Failed to unclaim contact' });
    }
});

export default router;

