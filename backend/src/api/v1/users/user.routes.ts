import { Router } from 'express';

import * as userController from './user.controller';
import {
  updateProfileSchema,
  changePasswordSchema,
  adminUpdateUserSchema,
  listUsersQuerySchema,
} from './user.validators';
import { authenticate } from '../../../middleware/auth.middleware';
import { isAdmin, isSelfOrAdmin } from '../../../middleware/rbac.middleware';
import { validateJoi } from '../../../middleware/validate.middleware';
import { uploadAvatar } from '../../../middleware/upload.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// ─── User Routes ─────────────────────────────────────────────────────────────
router.get('/profile', userController.updateProfile);
router.put('/profile', validateJoi(updateProfileSchema), userController.updateProfile);
router.put('/change-password', validateJoi(changePasswordSchema), userController.changePassword);
router.post('/avatar', uploadAvatar, userController.updateProfile);

// ─── Admin Routes ─────────────────────────────────────────────────────────────
router.get('/', isAdmin, validateJoi(listUsersQuerySchema, 'query'), userController.getUsers);
router.get('/dashboard/stats', isAdmin, userController.getDashboardStats);
router.get('/:id', isSelfOrAdmin, userController.getUserById);
router.put('/:id', isAdmin, validateJoi(adminUpdateUserSchema), userController.adminUpdateUser);
router.delete('/:id', isAdmin, userController.deleteUser);

export { router as usersRouter };
