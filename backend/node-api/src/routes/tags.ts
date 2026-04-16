import { Router, Request, Response } from 'express';
import prisma from '../db';
import { authenticateToken } from '../middleware/auth';
import { enforceTenancy } from '../middleware/tenancy';

const router = Router();
router.use(authenticateToken);
router.use(enforceTenancy);

// GET all tags
router.get('/', async (_req: Request, res: Response) => {
    try {
        const teamId = (req as any).user?.teamId as number;
        const tags = await prisma.tag.findMany({ where: { teamId }, orderBy: { name: 'asc' } });
        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
});

// POST create tag
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, color } = req.body;
        const teamId = (req as any).user?.teamId as number;
        if (!name) return res.status(400).json({ error: 'Tag name is required' });
        const tag = await prisma.tag.create({ data: { name: name.trim(), color: color || '#6366f1', teamId } });
        res.json(tag);
    } catch (error: any) {
        if (error.code === 'P2002') return res.status(400).json({ error: 'Tag name already exists' });
        res.status(500).json({ error: 'Failed to create tag' });
    }
});

// DELETE tag
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        await prisma.tag.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Tag deleted' });
    } catch {
        res.status(500).json({ error: 'Failed to delete tag' });
    }
});

// POST attach tag to contact
router.post('/contact/:contactId/:tagId', async (req: Request, res: Response) => {
    try {
        const { contactId, tagId } = req.params;
        await prisma.contactTag.create({
            data: { contactId, tagId: parseInt(tagId) }
        });
        res.json({ message: 'Tag attached' });
    } catch (error: any) {
        if (error.code === 'P2002') return res.json({ message: 'Already attached' });
        res.status(500).json({ error: 'Failed to attach tag' });
    }
});

// DELETE detach tag from contact
router.delete('/contact/:contactId/:tagId', async (req: Request, res: Response) => {
    try {
        const { contactId, tagId } = req.params;
        await prisma.contactTag.delete({
            where: { contactId_tagId: { contactId, tagId: parseInt(tagId) } }
        });
        res.json({ message: 'Tag removed' });
    } catch {
        res.status(500).json({ error: 'Failed to remove tag' });
    }
});

// POST bulk tag contacts
router.post('/bulk', async (req: Request, res: Response) => {
    try {
        const { contactIds, tagId } = req.body;
        if (!Array.isArray(contactIds) || !tagId) return res.status(400).json({ error: 'Invalid payload' });
        for (const contactId of contactIds) {
            try {
                await prisma.contactTag.create({ data: { contactId, tagId: parseInt(tagId) } });
            } catch {} // skip already-tagged
        }
        res.json({ message: `Tag applied to ${contactIds.length} contacts` });
    } catch {
        res.status(500).json({ error: 'Failed to bulk tag' });
    }
});

// POST bulk delete contacts
router.post('/bulk-delete', async (req: Request, res: Response) => {
    try {
        const { contactIds } = req.body;
        if (!Array.isArray(contactIds)) return res.status(400).json({ error: 'Invalid payload' });
        await prisma.contact.deleteMany({ where: { id: { in: contactIds } } });
        res.json({ message: `Deleted ${contactIds.length} contacts` });
    } catch {
        res.status(500).json({ error: 'Failed to bulk delete' });
    }
});

export default router;
