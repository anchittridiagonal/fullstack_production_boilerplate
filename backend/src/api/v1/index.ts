import { Router } from 'express';

import { authRouter } from './auth/auth.routes';
import { usersRouter } from './users/user.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);

export { router as apiV1Router };
