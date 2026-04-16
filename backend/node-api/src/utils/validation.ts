import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const contactSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    phone: z.string().min(1, 'Phone is required').max(20, 'Phone too long'),
    status: z.string().optional(),
    totalSpent: z.number().optional(),
    reliability: z.number().min(0).max(10).optional(),
});

export const contactUpdateSchema = z.object({
    orderStatus: z.string().optional(),
    notes: z.string().optional(),
    totalSpent: z.number().optional(),
    status: z.string().optional(),
    name: z.string().min(1).max(100).optional(),
    phone: z.string().min(1).max(20).optional(),
    reliability: z.number().min(0).max(10).optional(),
    isAiActive: z.boolean().optional(),
    unread: z.number().optional(),
    assignedToId: z.number().nullable().optional(),
});

export const messageSchema = z.object({
    text: z.string().min(1, 'Message text is required'),
    sent: z.boolean().optional(),
    contactId: z.string().uuid('Invalid contact ID'),
});
