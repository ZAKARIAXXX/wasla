import { Router, Response } from 'express';
import prisma from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { enforceTenancy } from '../middleware/tenancy';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
router.use(authenticateToken);
router.use(enforceTenancy);

const uploadDir = path.join(__dirname, '../../uploads/knowledge');
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

router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const teamId = req.user!.teamId;
        const docs = await prisma.knowledgeDoc.findMany({ where: { teamId }, orderBy: { createdAt: 'desc' } });
        res.json(docs);
    } catch(err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/upload', upload.single('file'), async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file provided' });
        const { title, type } = req.body;
        const fileUrl = `/uploads/knowledge/${req.file.filename}`;
        const teamId = req.user!.teamId;
        
        const doc = await prisma.knowledgeDoc.create({
            data: { title: title || req.file.originalname, type: type || 'file', fileUrl, teamId }
        });
        res.json(doc);
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload doc' });
    }
});

router.post('/text', async (req: AuthRequest, res: Response) => {
    try {
        const { title, content } = req.body;
        const teamId = req.user!.teamId;
        const doc = await prisma.knowledgeDoc.create({
            data: { title, content, type: 'text', teamId }
        });
        res.json(doc);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save doc' });
    }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const teamId = req.user!.teamId;
        await prisma.knowledgeDoc.deleteMany({ 
            where: { id: parseInt(req.params.id), teamId } 
        });
        res.json({ success: true });
    } catch(err) { res.status(500).json({ error: 'Server error' }); }
});

export default router;
