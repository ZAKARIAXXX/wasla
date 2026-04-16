import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import prisma from '../db';

import { enforceTenancy } from '../middleware/tenancy';

const router = express.Router();

router.use(authenticateToken);
router.use(enforceTenancy);

router.get('/', async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        let settings = await prisma.settings.findUnique({
            where: { userId },
            include: { user: { select: { name: true, email: true } } }
        });

        // Auto-initialize settings globally for the user if they've never visited before
        if (!settings) {
            settings = await prisma.settings.create({
                data: { userId },
                include: { user: { select: { name: true, email: true } } }
            });
        }
        res.json(settings);
    } catch (e) {
        console.error('Settings GET Error:', e);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

router.put('/', async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const body = req.body;
        const updated = await prisma.settings.upsert({
            where: { userId },
            update: {
                businessName: body.businessName,
                businessPhone: body.businessPhone,
                currency: body.currency,
                timezone: body.timezone,
                language: body.language,
                emailNotifications: body.emailNotifications,
                smsNotifications: body.smsNotifications,
                desktopNotifications: body.desktopNotifications,
                orderAlerts: body.orderAlerts
            },
            create: {
                userId,
                businessName: body.businessName,
                businessPhone: body.businessPhone,
                currency: body.currency,
                timezone: body.timezone,
                language: body.language,
                emailNotifications: body.emailNotifications,
                smsNotifications: body.smsNotifications,
                desktopNotifications: body.desktopNotifications,
                orderAlerts: body.orderAlerts
            }
        });

        // Mutate the core root User conditionally to keep sync
        if (body.userName) {
            await prisma.user.update({
               where: { id: userId },
               data: { name: body.userName }
            });
        }

        res.json(updated);
    } catch (e) {
        console.error('Settings PUT Error:', e);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

export default router;
