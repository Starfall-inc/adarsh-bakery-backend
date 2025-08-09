import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack); // Log the error stack for debugging

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // In production, avoid sending detailed error messages to the client
  if (process.env.NODE_ENV === 'production') {
    return res.status(statusCode).json({ message: 'An unexpected error occurred.' });
  } else {
    return res.status(statusCode).json({ message, stack: err.stack });
  }
};

export default errorHandler;
