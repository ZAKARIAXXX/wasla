import { Router, Response } from 'express';
import prisma from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { enforceTenancy } from '../middleware/tenancy';

const router = Router();
router.use(authenticateToken);
router.use(enforceTenancy);

router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const teamId = req.user!.teamId;
        const campaigns = await prisma.campaign.findMany({
            where: { teamId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(campaigns);
    } catch(err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/', async (req: AuthRequest, res: Response) => {
    try {
        const { name, segment, message, reach, scheduledAt } = req.body;
        const teamId = req.user!.teamId;
        
        let status = 'Completed';
        let parsedScheduledAt = null;

        if (scheduledAt) {
            parsedScheduledAt = new Date(scheduledAt);
            if (parsedScheduledAt > new Date()) {
                status = 'Scheduled';
            }
        }

        const campaign = await prisma.campaign.create({
            data: { 
                name, 
                segment, 
                message, 
                reach: reach || 0, 
                status,
                scheduledAt: parsedScheduledAt,
                teamId
            }
        });
        res.json(campaign);
    } catch(err) { res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const teamId = req.user!.teamId;
        const result = await prisma.campaign.deleteMany({ 
            where: { id: parseInt(req.params.id), teamId }
        });
        if (result.count === 0) return res.status(404).json({ error: 'Not found or unauthorized' });
        res.json({ message: 'Deleted' });
    } catch {
        res.status(500).json({ error: 'Failed to delete' });
    }
});

export default router;
