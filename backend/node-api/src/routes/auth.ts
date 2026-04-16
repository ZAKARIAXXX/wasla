import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db';
import { generateToken } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const signupSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(1, 'Name is required')
});

router.post('/signup', async (req: Request, res: Response) => {
    try {
        const validation = signupSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validation.error.errors
            });
        }

        const { email, password, name } = validation.data;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Create a default Team for the new signup
        const team = await prisma.team.create({
            data: {
                name: `${name}'s Team`
            }
        });

        // 2. Create the user and associate them with the new team
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                teamId: team.id
            }
        });

        await prisma.settings.create({
            data: {
                userId: user.id
            }
        });

        const token = generateToken({ id: user.id, email: user.email, role: user.role, teamId: user.teamId ?? undefined });

        res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                teamId: user.teamId
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/forgot-password', async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Return success even if user not found to prevent email enumeration
            return res.json({ message: 'If an account exists, a reset link has been sent' });
        }

        // Generate a random token
        const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExpiry }
        });

        // In a real application, you'd send an email here. Wait, we can mock it by logging.
        console.log(`[Mock Email] Password reset link for ${email}: http://localhost:5173/reset-password?token=${resetToken}`);

        res.json({ message: 'If an account exists, a reset link has been sent', mockToken: resetToken });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/reset-password', async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password required' });

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() } // Token must not be expired
            }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;