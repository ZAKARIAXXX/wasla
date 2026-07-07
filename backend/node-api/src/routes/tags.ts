import { Router, Response } from 'express';
import prisma from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { enforceTenancy } from '../middleware/tenancy';

const router = Router();
router.use(authenticateToken);
router.use(enforceTenancy);

// GET all tags
router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const teamId = req.user!.teamId;
        const tags = await prisma.tag.findMany({ where: { teamId }, orderBy: { name: 'asc' } });
        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
});

// POST create tag
router.post('/', async (req: AuthRequest, res: Response) => {
    try {
        const { name, color } = req.body;
        const teamId = req.user!.teamId;
        if (!name) return res.status(400).json({ error: 'Tag name is required' });
        const tag = await prisma.tag.create({ data: { name: name.trim(), color: color || '#6366f1', teamId } });
        res.json(tag);
    } catch (error: any) {
        if (error.code === 'P2002') return res.status(400).json({ error: 'Tag name already exists' });
        res.status(500).json({ error: 'Failed to create tag' });
    }
});

// DELETE tag (scoped to team)
router.delete('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const teamId = req.user!.teamId;
        await prisma.tag.deleteMany({ where: { id: parseInt(req.params.id), teamId } });
        res.json({ message: 'Tag deleted' });
    } catch {
        res.status(500).json({ error: 'Failed to delete tag' });
    }
});

// POST attach tag to contact
router.post('/contact/:contactId/:tagId', async (req: AuthRequest, res: Response) => {
    try {
        const { contactId, tagId } = req.params;
        const teamId = req.user!.teamId;

        // Verify both belong to the team
        const [contact, tag] = await Promise.all([
            prisma.contact.findFirst({ where: { id: contactId, teamId } }),
            prisma.tag.findFirst({ where: { id: parseInt(tagId), teamId } })
        ]);

        if (!contact || !tag) {
            return res.status(404).json({ error: 'Contact or Tag not found' });
        }

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
router.delete('/contact/:contactId/:tagId', async (req: AuthRequest, res: Response) => {
    try {
        const { contactId, tagId } = req.params;
        const teamId = req.user!.teamId;

        // Verify both belong to the team
        const [contact, tag] = await Promise.all([
            prisma.contact.findFirst({ where: { id: contactId, teamId } }),
            prisma.tag.findFirst({ where: { id: parseInt(tagId), teamId } })
        ]);

        if (!contact || !tag) {
            return res.status(404).json({ error: 'Contact or Tag not found' });
        }

        await prisma.contactTag.delete({
            where: { contactId_tagId: { contactId, tagId: parseInt(tagId) } }
        });
        res.json({ message: 'Tag removed' });
    } catch {
        res.status(500).json({ error: 'Failed to remove tag' });
    }
});

// POST bulk tag contacts
router.post('/bulk', async (req: AuthRequest, res: Response) => {
    try {
        const { contactIds, tagId } = req.body;
        const teamId = req.user!.teamId;

        if (!Array.isArray(contactIds) || !tagId) return res.status(400).json({ error: 'Invalid payload' });
        
        // Verify tag belongs to team
        const tag = await prisma.tag.findFirst({ where: { id: parseInt(tagId), teamId } });
        if (!tag) return res.status(404).json({ error: 'Tag not found' });

        for (const contactId of contactIds) {
            try {
                // Verify contact ownership (slightly inefficient but safe for small batches)
                const contact = await prisma.contact.findFirst({ where: { id: contactId, teamId } });
                if (contact) {
                    await prisma.contactTag.create({ data: { contactId, tagId: parseInt(tagId) } });
                }
            } catch {} // skip already-tagged or invalid contacts
        }
        res.json({ message: `Tag applied to existing contacts in your team` });
    } catch {
        res.status(500).json({ error: 'Failed to bulk tag' });
    }
});

// POST bulk delete contacts (scoped to team)
router.post('/bulk-delete', async (req: AuthRequest, res: Response) => {
    try {
        const { contactIds } = req.body;
        const teamId = req.user!.teamId;
        if (!Array.isArray(contactIds)) return res.status(400).json({ error: 'Invalid payload' });
        await prisma.contact.deleteMany({ where: { id: { in: contactIds }, teamId } });
        res.json({ message: `Deleted ${contactIds.length} contacts` });
    } catch {
        res.status(500).json({ error: 'Failed to bulk delete' });
    }
});

export default router;
