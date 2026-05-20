import { Request, Response } from 'express';

import * as authService from './auth.service';
import { sendSuccess, sendCreated, sendError } from '../../../utils/response';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, confirmPassword]
 *             properties:
 *               name: { type: string, example: John Doe }
 *               email: { type: string, format: email, example: john@example.com }
 *               password: { type: string, format: password, example: "Secret@123" }
 *               confirmPassword: { type: string, format: password, example: "Secret@123" }
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already registered
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };
  const { user, tokens } = await authService.registerUser({ name, email, password });
  sendCreated(res, { user, ...tokens }, 'Registration successful');
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       200:
 *         description: Login successful, returns access and refresh tokens
 *       401:
 *         description: Invalid credentials
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  const { user, tokens } = await authService.loginUser(email, password);
  sendSuccess(res, { user, ...tokens }, 'Login successful');
};

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token using refresh token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: New token pair issued
 *       401:
 *         description: Invalid or expired refresh token
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken: token } = req.body as { refreshToken: string };
  const tokens = await authService.refreshTokens(token);
  sendSuccess(res, tokens, 'Tokens refreshed');
};

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout and invalidate refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken: token } = req.body as { refreshToken: string };
  await authService.logoutUser(token);
  sendSuccess(res, null, 'Logged out successfully');
};

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Send password reset email
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200:
 *         description: Reset email sent if address exists
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body as { email: string };
  await authService.forgotPassword(email);
  sendSuccess(res, null, 'If that email exists, a reset link has been sent');
};

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password using token from email
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password, confirmPassword]
 *             properties:
 *               token: { type: string }
 *               password: { type: string, format: password }
 *               confirmPassword: { type: string, format: password }
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body as { token: string; password: string };
  await authService.resetPassword(token, password);
  sendSuccess(res, null, 'Password reset successful. Please login.');
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const authReq = req as import('../../../types').AuthRequest;
  if (!authReq.user) {
    sendError(res, 'Not authenticated', 401);
    return;
  }
  sendSuccess(res, authReq.user, 'Current user retrieved');
};
