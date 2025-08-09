import { Response, NextFunction } from 'express';
import { AuthRequest } from './user/auth.middleware';
import { UserRole } from '../models/user.model';

const authorize = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Access denied: No roles assigned.' });
    }

    const hasPermission = allowedRoles.some((role) => req.user?.role.includes(role));

    if (hasPermission || req.user.role === UserRole.Admin) {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied: Insufficient permissions.' });
    }
  };
};

export default authorize;
