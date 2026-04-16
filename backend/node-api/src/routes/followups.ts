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
        const rules = await prisma.followUpRule.findMany({ where: { teamId }, orderBy: { createdAt: 'desc' } });
        res.json(rules);
    } catch(err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, triggerType, delayHours, actionText } = req.body;
        const teamId = (req as any).user?.teamId as number;
        const rule = await prisma.followUpRule.create({
            data: { name, triggerType, delayHours: Number(delayHours), actionText, teamId }
        });
        res.json(rule);
    } catch(err) { res.status(500).json({ error: 'Server error' }); }
});

router.put('/:id/toggle', async (req: Request, res: Response) => {
    try {
        const { isActive } = req.body;
        const rule = await prisma.followUpRule.update({
            where: { id: parseInt(req.params.id) },
            data: { isActive }
        });
        res.json(rule);
    } catch(err) { res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        await prisma.followUpRule.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch(err) { res.status(500).json({ error: 'Server error' }); }
});

export default router;
