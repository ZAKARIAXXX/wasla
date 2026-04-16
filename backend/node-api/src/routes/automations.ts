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
        const flows = await (prisma.automationFlow as any).findMany({
            where: { teamId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(flows);
    } catch(err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, triggerType, actionType } = req.body;
        const teamId = (req as any).user?.teamId as number;
        const flow = await (prisma.automationFlow as any).create({
            data: { name, triggerType, actionType, teamId }
        });
        res.json(flow);
    } catch(err) { res.status(500).json({ error: 'Server error' }); }
});

router.put('/:id/toggle', async (req: Request, res: Response) => {
    try {
        const teamId = (req as any).user?.teamId as number;
        const { isActive } = req.body;
        const flow = await prisma.automationFlow.updateMany({
            where: { id: parseInt(req.params.id), teamId },
            data: { isActive }
        });
        if (flow.count === 0) return res.status(404).json({ error: 'Flow not found or unauthorized' });
        res.json({ success: true });
    } catch(err) { res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const teamId = (req as any).user?.teamId as number;
        const result = await prisma.automationFlow.deleteMany({
            where: { id: parseInt(req.params.id), teamId }
        });
        if (result.count === 0) return res.status(404).json({ error: 'Flow not found or unauthorized' });
        res.json({ success: true });
    } catch(err) { res.status(500).json({ error: 'Server error' }); }
});

export default router;
