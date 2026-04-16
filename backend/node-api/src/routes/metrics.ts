import { Router, Request, Response } from 'express';
import prisma from '../db';
import { authenticateToken } from '../middleware/auth';
import { enforceTenancy } from '../middleware/tenancy';

const router = Router();

// Dashboard aggregation with optional date range — tenant-scoped
router.get('/dashboard', authenticateToken, enforceTenancy, async (req: Request, res: Response) => {
    try {
        const teamId = (req as any).user?.teamId as number;

        // Parse date range (defaults to last 7 days)
        const to = req.query.to ? new Date(req.query.to as string) : new Date();
        const defaultFrom = new Date(to);
        defaultFrom.setDate(defaultFrom.getDate() - 7);
        const from = req.query.from ? new Date(req.query.from as string) : defaultFrom;

        // Clamp end of day
        to.setHours(23, 59, 59, 999);
        from.setHours(0, 0, 0, 0);

        const dateFilter = { gte: from, lte: to };
        const teamFilter = { teamId };

        // 1. Total Conversations in range
        const totalConversations = await (prisma.contact as any).count({
            where: { ...teamFilter, timestamp: dateFilter }
        });

        // 2. Avg Response Time — real calculation based on message timestamps
        const contacts = await (prisma.contact as any).findMany({
            where: { ...teamFilter, timestamp: dateFilter },
            include: { messages: { orderBy: { timestamp: 'asc' }, take: 2 } }
        });

        let totalResponseMs = 0;
        let responseSamples = 0;
        for (const c of contacts) {
            const msgs = c.messages;
            if (msgs.length >= 2) {
                const inbound = msgs.find((m: any) => !m.sent);
                const outbound = msgs.find((m: any) => m.sent);
                if (inbound && outbound) {
                    const diff = new Date(outbound.timestamp).getTime() - new Date(inbound.timestamp).getTime();
                    if (diff > 0 && diff < 24 * 60 * 60 * 1000) {
                        totalResponseMs += diff;
                        responseSamples++;
                    }
                }
            }
        }

        let avgResponseTime = '—';
        if (responseSamples > 0) {
            const avgMs = totalResponseMs / responseSamples;
            const mins = Math.floor(avgMs / 60000);
            const secs = Math.floor((avgMs % 60000) / 1000);
            avgResponseTime = `${mins}m ${secs}s`;
        }

        // 3. Revenue = sum of totalSpent for converted contacts in range
        const conversionsResult = await (prisma.contact as any).aggregate({
            _sum: { totalSpent: true },
            where: {
                ...teamFilter,
                timestamp: dateFilter,
                OR: [{ status: 'paid' }, { orderStatus: 'Delivered' }]
            }
        });
        const estConversions = Math.round(conversionsResult._sum.totalSpent || 0);

        // 4. Missed Opportunities (pending > 48h, within range)
        const missedOpportunities = await (prisma.contact as any).count({
            where: {
                ...teamFilter,
                timestamp: { gte: from, lte: new Date(to.getTime() - 2 * 24 * 60 * 60 * 1000) },
                OR: [{ status: 'pending' }, { status: 'new-order' }]
            }
        });

        // 5. Revenue Trend — one entry per day in the selected range
        const dayCount = Math.min(Math.ceil((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000)), 90);
        const revenueTrend = [];

        for (let i = dayCount - 1; i >= 0; i--) {
            const day = new Date(to);
            day.setDate(day.getDate() - i);
            const startOfDay = new Date(day); startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(day); endOfDay.setHours(23, 59, 59, 999);

            const daySum = await (prisma.contact as any).aggregate({
                _sum: { totalSpent: true },
                where: { ...teamFilter, timestamp: { gte: startOfDay, lte: endOfDay } }
            });

            const label = dayCount <= 7
                ? day.toLocaleDateString('en-US', { weekday: 'short' })
                : day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            revenueTrend.push({ name: label, total: daySum._sum.totalSpent || 0 });
        }

        res.json({ totalConversations, avgResponseTime, estConversions, missedOpportunities, revenueTrend, from: from.toISOString(), to: to.toISOString() });
    } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
    }
});

// Savings calculation (team-scoped)
router.get('/savings', authenticateToken, enforceTenancy, async (req: Request, res: Response) => {
    try {
        const teamId = (req as any).user?.teamId as number;
        const totalOrders = await (prisma.contact as any).count({ where: { teamId } });
        const SAVINGS_PER_ORDER = 2.00;
        res.json({ totalSaved: totalOrders * SAVINGS_PER_ORDER, savedPerOrder: SAVINGS_PER_ORDER, totalOrders });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch savings metrics' });
    }
});

export default router;
