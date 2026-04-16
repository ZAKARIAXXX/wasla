import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const enforceTenancy = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (!req.user.teamId) {
        return res.status(403).json({ message: 'Forbidden: User does not belong to a team context' });
    }

    next();
};
