import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { logger } from '../utils/logger';
import { sendError } from '../utils/response';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
  logger.error('Error caught by handler', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Operational errors
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Mongoose validation error
  if (err instanceof MongooseError.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    sendError(res, 'Validation failed', 400, errors);
    return;
  }

  // Mongoose duplicate key error
  if ('code' in err && (err as NodeJS.ErrnoException).code === '11000') {
    const keyValue = (err as Record<string, Record<string, string>>).keyValue;
    const field = Object.keys(keyValue ?? {})[0] ?? 'field';
    sendError(res, `${field} already exists`, 409, [
      { field, message: `${field} is already taken` },
    ]);
    return;
  }

  // Mongoose cast error
  if (err instanceof MongooseError.CastError) {
    sendError(res, `Invalid ${err.path}: ${String(err.value)}`, 400);
    return;
  }

  // JWT errors
  if (err instanceof TokenExpiredError) {
    sendError(res, 'Token has expired', 401);
    return;
  }
  if (err instanceof JsonWebTokenError) {
    sendError(res, 'Invalid token', 401);
    return;
  }

  // Unknown errors — don't leak details in production
  const message =
    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  sendError(res, message, 500);
};
