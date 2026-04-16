import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import contactsRouter from './routes/contacts';
import messagesRouter from './routes/messages';
import webhooksRouter from './routes/webhooks';
import metricsRouter from './routes/metrics';
import settingsRouter from './routes/settings';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import teamsRouter from './routes/teams';
import campaignsRouter from './routes/campaigns';
import followupsRouter from './routes/followups';
import knowledgeRouter from './routes/knowledge';
import automationsRouter from './routes/automations';
import tagsRouter from './routes/tags';
import templatesRouter from './routes/templates';
import logsRouter from './routes/logs';
import callsRouter from './routes/calls';
import { startFollowupScheduler } from './jobs/followupScheduler';
import { authenticateToken, generateToken, AuthRequest } from './middleware/auth';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const httpServer = createServer(app);
// Build a robust list of allowed origins for Socket.IO
const rawOrigins = (process.env.ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const allowedOrigins = rawOrigins.length > 0 ? rawOrigins : ["http://localhost:5173", "http://localhost:8080"];

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
});

// Simple JWT-based Socket.IO authentication and tenant (team) isolation
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production';
io.use((socket, next) => {
  const token = (socket as any).handshake?.auth?.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    (socket as any).user = {
      id: payload.id,
      email: payload.email,
      teamId: payload.teamId
    };
    return next();
  } catch {
    return next(new Error('Authentication error'));
  }
});

app.set('io', io);

const PORT = 3000;

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 1000, 
    message: { error: "Too many requests" },
    standardHeaders: true, 
    legacyHeaders: false, 
});
app.use(limiter);

app.use(cors());

// Webhooks require raw body for signature verification
app.use('/api/webhooks', webhooksRouter);
app.use('/webhook', webhooksRouter); // Alias for n8n-style webhooks like /webhook/wasla-secure-webhook

app.use(express.json({ limit: '10kb' }));
import path from 'path';
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/contacts', contactsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/campaigns', campaignsRouter);
app.use('/api/followups', followupsRouter);
app.use('/api/knowledge', knowledgeRouter);
app.use('/api/automations', automationsRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/logs', logsRouter);
app.use('/api/calls', callsRouter);

// Start background jobs
startFollowupScheduler();

import prisma from './db';

// Mock Login Endpoint
app.post('/api/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken({ id: user.id, email: user.email, role: user.role, teamId: user.teamId! });
        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


// Basic health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'node-api' });
});

io.on('connection', (socket) => {
    const user = (socket as any).user;
    if (user?.teamId) {
        socket.join(`team:${user.teamId}`);
    }
    console.log('User connected:', socket.id, 'teamId:', user?.teamId);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log('Backend now listening on PORT 3000');
});
