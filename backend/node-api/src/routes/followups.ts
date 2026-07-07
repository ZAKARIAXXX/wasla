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
        const rules = await prisma.followUpRule.findMany({ where: { teamId }, orderBy: { createdAt: 'desc' } });
        res.json(rules);
    } catch(err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/', async (req: AuthRequest, res: Response) => {
    try {
        const { name, triggerType, delayHours, actionText } = req.body;
        const teamId = req.user!.teamId;
        const rule = await prisma.followUpRule.create({
            data: { name, triggerType, delayHours: Number(delayHours), actionText, teamId }
        });
        res.json(rule);
    } catch(err) { res.status(500).json({ error: 'Server error' }); }
});

router.put('/:id/toggle', async (req: AuthRequest, res: Response) => {
    try {
        const { isActive } = req.body;
        const teamId = req.user!.teamId;
        
        await prisma.followUpRule.updateMany({
            where: { id: parseInt(req.params.id), teamId },
            data: { isActive }
        });
        
        const rule = await prisma.followUpRule.findFirst({
            where: { id: parseInt(req.params.id), teamId }
        });
        
        res.json(rule);
    } catch(err) { res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const teamId = req.user!.teamId;
        await prisma.followUpRule.deleteMany({ 
            where: { id: parseInt(req.params.id), teamId } 
        });
        res.json({ success: true });
    } catch(err) { res.status(500).json({ error: 'Server error' }); }
});

export default router;
