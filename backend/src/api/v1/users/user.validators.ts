import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim(),
  avatar: Joi.string().uri().allow(null, ''),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/)
    .message(
      'Password must contain uppercase, lowercase, number, and special character',
    )
    .required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords do not match',
  }),
});

export const adminUpdateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim(),
  role: Joi.string().valid('admin', 'user'),
  isActive: Joi.boolean(),
});

export const listUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().default('createdAt'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
  search: Joi.string().allow('', null),
  role: Joi.string().valid('admin', 'user'),
  isActive: Joi.boolean(),
});
