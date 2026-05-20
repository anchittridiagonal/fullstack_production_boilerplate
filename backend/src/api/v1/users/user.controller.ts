import { Response } from 'express';

import * as userService from './user.service';
import { AuthRequest } from '../../../types';
import {
  sendSuccess,
  sendPaginated,
  sendNotFound,
} from '../../../utils/response';
import { parsePaginationOptions } from '../../../utils/pagination';

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (Admin only)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [admin, user] }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *       - in: query
 *         name: sort
 *         schema: { type: string, default: createdAt }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *     responses:
 *       200:
 *         description: Paginated list of users
 */
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  const options = parsePaginationOptions(req);
  const role = req.query.role as string | undefined;
  const isActive =
    req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;

  const result = await userService.getUsers({ ...options, role, isActive });
  sendPaginated(res, result, 'Users retrieved');
};

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await userService.getUserById(req.params.id);
  if (!user) { sendNotFound(res); return; }
  sendSuccess(res, user, 'User retrieved');
};

/**
 * @swagger
 * /users/profile:
 *   put:
 *     tags: [Users]
 *     summary: Update own profile
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               avatar: { type: string }
 *     responses:
 *       200:
 *         description: Profile updated
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await userService.updateProfile(
    req.user!._id.toString(),
    req.body as { name?: string; avatar?: string },
    req.user!._id.toString(),
  );
  sendSuccess(res, user, 'Profile updated');
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body as {
    currentPassword: string;
    newPassword: string;
  };
  await userService.changePassword(req.user!._id.toString(), currentPassword, newPassword);
  sendSuccess(res, null, 'Password changed successfully');
};

export const adminUpdateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await userService.adminUpdateUser(
    req.params.id,
    req.body as { name?: string; role?: string; isActive?: boolean },
    req.user!._id.toString(),
  );
  sendSuccess(res, user, 'User updated');
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  await userService.softDeleteUser(req.params.id, req.user!._id.toString());
  sendSuccess(res, null, 'User deleted');
};

export const getDashboardStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  const stats = await userService.getDashboardStats();
  sendSuccess(res, stats, 'Dashboard stats retrieved');
};
