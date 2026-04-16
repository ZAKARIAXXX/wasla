import { Router, Request, Response } from 'express';
import prisma from '../db';
import { authenticateToken } from '../middleware/auth';
import { enforceTenancy } from '../middleware/tenancy';

const router = Router();
router.use(authenticateToken);
router.use(enforceTenancy);

// GET paginated automation logs
router.get('/', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const ruleType = req.query.ruleType as string | undefined;
        const skip = (page - 1) * limit;

        const teamId = (req as any).user?.teamId as number;
        const where = ruleType ? { ruleType, teamId } : { teamId };

        const [logs, total] = await Promise.all([
            (prisma.automationLog as any).findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            (prisma.automationLog as any).count({ where })
        ]);

        res.json({ logs, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

// DELETE clear all logs for team
router.delete('/', async (req: Request, res: Response) => {
    try {
        const teamId = (req as any).user?.teamId as number;
        await (prisma.automationLog as any).deleteMany({ where: { teamId } });
        res.json({ message: 'Logs cleared' });
    } catch {
        res.status(500).json({ error: 'Failed to clear logs' });
    }
});

export default router;
