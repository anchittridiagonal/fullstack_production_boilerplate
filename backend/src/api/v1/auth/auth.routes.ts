import { Router } from 'express';

import * as authController from './auth.controller';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from './auth.validators';
import { authenticate } from '../../../middleware/auth.middleware';
import { validateJoi } from '../../../middleware/validate.middleware';

const router = Router();

router.post('/register', validateJoi(registerSchema), authController.register);
router.post('/login', validateJoi(loginSchema), authController.login);
router.post('/refresh-token', validateJoi(refreshTokenSchema), authController.refreshToken);
router.post('/logout', validateJoi(refreshTokenSchema), authController.logout);
router.post('/forgot-password', validateJoi(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validateJoi(resetPasswordSchema), authController.resetPassword);
router.get('/me', authenticate, authController.getMe);

export { router as authRouter };
