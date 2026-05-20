import { Response, NextFunction } from 'express';

import { User } from '../models/user.model';
import { AuthRequest } from '../types';
import { verifyAccessToken } from '../utils/jwt';
import { sendUnauthorized } from '../utils/response';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      sendUnauthorized(res, 'Authorization token required');
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      sendUnauthorized(res, 'Authorization token required');
      return;
    }

    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.sub).select('+role');
    if (!user || !user.isActive || user.deletedAt) {
      sendUnauthorized(res, 'User not found or inactive');
      return;
    }

    req.user = user;
    next();
  } catch {
    sendUnauthorized(res, 'Invalid or expired token');
  }
};
