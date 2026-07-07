import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
export type JwtPayload = { id: number; email: string; name?: string; role: string; teamId: number };

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    name?: string;
    role: string;
    teamId: number;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
          return res.status(403).json({ message: 'Invalid or expired token' });
      }
      req.user = user as JwtPayload;
      next();
    });
};

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const generateServiceToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET); // No expiration
};

export const requireRole = (role: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};
