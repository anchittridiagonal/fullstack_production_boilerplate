import { Response, NextFunction } from 'express';

import { AuthRequest, UserRole } from '../types';
import { sendForbidden, sendUnauthorized } from '../utils/response';

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendUnauthorized(res);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendForbidden(res, `Role '${req.user.role}' is not permitted to access this resource`);
      return;
    }

    next();
  };
};

export const isAdmin = authorize('admin');
export const isUser = authorize('user', 'admin');
export const isSelfOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    sendUnauthorized(res);
    return;
  }

  const targetId = req.params.id;
  const isOwner = req.user._id.toString() === targetId;
  const isAdminRole = req.user.role === 'admin';

  if (!isOwner && !isAdminRole) {
    sendForbidden(res, 'You can only access your own resources');
    return;
  }

  next();
};
