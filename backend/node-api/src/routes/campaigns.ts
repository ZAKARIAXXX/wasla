import { Router, Request, Response } from 'express';
import prisma from '../db';
import { authenticateToken } from '../middleware/auth';
import { enforceTenancy } from '../middleware/tenancy';

const router = Router();
router.use(authenticateToken);
router.use(enforceTenancy);

router.get('/', async (req: Request, res: Response) => {
    try {
        const teamId = (req as any).user?.teamId as number;
        const campaigns = await (prisma.campaign as any).findMany({
            where: { teamId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(campaigns);
    } catch(err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, segment, message, reach, scheduledAt } = req.body;
        const teamId = (req as any).user?.teamId as number;
        
        let status = 'Completed';
        let parsedScheduledAt = null;

        if (scheduledAt) {
            parsedScheduledAt = new Date(scheduledAt);
            if (parsedScheduledAt > new Date()) {
                status = 'Scheduled';
            }
        }

        const campaign = await (prisma.campaign as any).create({
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

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        await prisma.campaign.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Deleted' });
    } catch {
        res.status(500).json({ error: 'Failed to delete' });
    }
});

export default router;
