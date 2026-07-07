import { Router, Response } from 'express';
import prisma from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { enforceTenancy } from '../middleware/tenancy';

const router = Router();
router.use(authenticateToken);
router.use(enforceTenancy);

// GET all templates
router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const teamId = req.user!.teamId;
        const templates = await prisma.messageTemplate.findMany({ where: { teamId }, orderBy: { createdAt: 'desc' } });
        res.json(templates);
    } catch {
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
});

// POST create template
router.post('/', async (req: AuthRequest, res: Response) => {
    try {
        const { title, body } = req.body;
        const teamId = req.user!.teamId;
        if (!title || !body) return res.status(400).json({ error: 'Title and body are required' });
        const template = await prisma.messageTemplate.create({ data: { title: title.trim(), body: body.trim(), teamId } });
        res.json(template);
    } catch {
        res.status(500).json({ error: 'Failed to create template' });
    }
});

// DELETE template (scoped to team)
router.delete('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const teamId = req.user!.teamId;
        await prisma.messageTemplate.deleteMany({ where: { id: parseInt(req.params.id), teamId } });
        res.json({ message: 'Template deleted' });
    } catch {
        res.status(500).json({ error: 'Failed to delete template' });
    }
});

export default router;
