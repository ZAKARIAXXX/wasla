import { Router, Request, Response } from 'express';
import prisma from '../db';
import { authenticateToken } from '../middleware/auth';
import { enforceTenancy } from '../middleware/tenancy';

const router = Router();
router.use(authenticateToken);
router.use(enforceTenancy);

// GET the current user's team
router.get('/', async (req: Request, res: Response) => {
    try {
        const teamId = (req as any).user?.teamId as number;
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: {
                members: {
                    select: { id: true, name: true, email: true, role: true }
                }
            }
        });
        res.json(team ? [team] : []);
    } catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).json({ error: 'Failed to fetch team' });
    }
});

// POST create team
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Team name is required' });
        
        const team = await prisma.team.create({
            data: { name }
        });
        res.json(team);
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ error: 'Failed to create team' });
    }
});

export default router;
