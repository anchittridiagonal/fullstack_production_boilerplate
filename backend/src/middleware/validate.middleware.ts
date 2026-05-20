import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ZodSchema, ZodError } from 'zod';

import { sendBadRequest } from '../utils/response';

type ValidateTarget = 'body' | 'query' | 'params';

// ─── Joi Validation ───────────────────────────────────────────────────────────
export const validateJoi = (schema: Joi.ObjectSchema, target: ValidateTarget = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message.replace(/['"]/g, ''),
      }));
      sendBadRequest(res, 'Validation failed', errors);
      return;
    }

    req[target] = value;
    next();
  };
};

// ─── Zod Validation ───────────────────────────────────────────────────────────
export const validateZod = <T>(schema: ZodSchema<T>, target: ValidateTarget = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = (result.error as ZodError).errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      sendBadRequest(res, 'Validation failed', errors);
      return;
    }

    req[target] = result.data;
    next();
  };
};
