import { Router, Request, Response } from 'express';
import prisma from '../db';
import { authenticateToken } from '../middleware/auth';
import { enforceTenancy } from '../middleware/tenancy';

const router = Router();

// GET all call logs
router.get('/', authenticateToken, enforceTenancy, async (req: Request, res: Response) => {
    try {
        const teamId = (req as any).user?.teamId as number;
        const calls = await (prisma.callLog as any).findMany({ 
            where: { teamId },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
        
        // Also compute basic stats for the frontend
        const totalCalls = await (prisma.callLog as any).count({ where: { teamId } });
        const completedCalls = await (prisma.callLog as any).count({ where: { teamId, status: 'completed' }});
        const confirmationRate = totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0;
        
        const durationResult = await (prisma.callLog as any).aggregate({
            _avg: { duration: true },
            where: { teamId, status: 'completed', duration: { not: null } }
        });
        const avgDurationSecs = durationResult._avg.duration || 0;
        const mins = Math.floor(avgDurationSecs / 60);
        const secs = Math.floor(avgDurationSecs % 60);
        const avgDuration = `${mins}m ${secs}s`;

        res.json({
            calls,
            stats: {
                totalCalls,
                confirmationRate: `${confirmationRate}%`,
                avgDuration
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST schedule/initiate a call
router.post('/schedule', authenticateToken, enforceTenancy, async (req: Request, res: Response) => {
    try {
        const { contactId, phoneNumber, direction } = req.body;
        const teamId = (req as any).user?.teamId as number;
        // In a real system, you would call Twilio/Vonage API here.
        // For now, just create a "scheduled" or "completed" stub log depending on mock.
        
        const callLog = await prisma.callLog.create({
            data: {
                contactId,
                phoneNumber: phoneNumber || 'Unknown',
                direction: direction || 'outbound',
                status: 'completed', // Or 'scheduled' if deferred
                duration: Math.floor(Math.random() * 120) + 15, // Mock duration
                teamId
            }
        });
        res.json(callLog);
    } catch(err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST webhook from Twilio to update call status
router.post('/webhook', async (req: Request, res: Response) => {
    // Usually expects CallSid, CallStatus, RecordingDuration
    // To implement securely, verify Twilio signature.
    res.json({ status: 'received' });
});

export default router;
