import { Router, Request, Response } from 'express';
import prisma from '../db';
import { authenticateToken, requireRole } from '../middleware/auth';
import { enforceTenancy } from '../middleware/tenancy';

const router = Router();

router.use(authenticateToken);
router.use(enforceTenancy);

// GET all users in the same team
router.get('/', async (req: Request, res: Response) => {
    try {
        const teamId = (req as any).user?.teamId as number;
        const users = await prisma.user.findMany({
            where: { teamId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                teamId: true,
            }
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// GET workload stats for all users in the same team
router.get('/workload', async (req: Request, res: Response) => {
    try {
        const teamId = (req as any).user?.teamId as number;
        const users = await prisma.user.findMany({
            where: { teamId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                _count: {
                    select: {
                        contacts: {
                            where: { status: { notIn: ['delivered', 'paid'] } }
                        }
                    }
                }
            }
        });
        
        const workload = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            activeContacts: user._count.contacts,
            status: user._count.contacts === 0 ? 'free' : 
                    user._count.contacts < 5 ? 'active' : 'busy'
        }));
        
        res.json(workload);
    } catch (error) {
        console.error('Error fetching workload:', error);
        res.status(500).json({ error: 'Failed to fetch workload' });
    }
});

// POST invite new team member — auto-assigns to requester's team
router.post('/invite', requireRole('Admin'), async (req: Request, res: Response) => {
    try {
        const { email, name } = req.body;
        const teamId = (req as any).user?.teamId as number | undefined;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        
        const bcrypt = await import('bcryptjs');
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        
        const newUser = await prisma.user.create({
            data: {
                email,
                name: name || email.split('@')[0],
                password: hashedPassword,
                role: req.body.role || 'Agent',
                teamId: teamId ?? null
            },
            select: { id: true, name: true, email: true, role: true, teamId: true }
        });
        
        res.json({ 
            user: newUser, 
            message: 'Team member invited successfully.',
            tempPassword 
        });
    } catch (error) {
        console.error('Error inviting user:', error);
        res.status(500).json({ error: 'Failed to invite user' });
    }
});

// DELETE remove team member
router.delete('/:id', requireRole('Admin'), async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        const currentUserId = (req as any).user?.id;
        
        if (userId === currentUserId) {
            return res.status(400).json({ error: 'Cannot remove yourself' });
        }
        
        await prisma.user.delete({
            where: { id: userId }
        });
        
        res.json({ message: 'Team member removed successfully' });
    } catch (error) {
        console.error('Error removing user:', error);
        res.status(500).json({ error: 'Failed to remove user' });
    }
});

export default router;
