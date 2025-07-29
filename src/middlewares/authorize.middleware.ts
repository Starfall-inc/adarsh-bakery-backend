import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { roles: string[] };
}

const authorize = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: 'Access denied: No roles assigned.' });
    }

    const hasPermission = allowedRoles.some((role) => req.user?.roles.includes(role));

    if (hasPermission) {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied: Insufficient permissions.' });
    }
  };
};

export default authorize;
