import { Response } from 'express';

import { ApiResponse, PaginatedResult, ValidationError } from '../types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
): Response => {
  const body: ApiResponse<T> = { success: true, message, data };
  return res.status(statusCode).json(body);
};

export const sendCreated = <T>(res: Response, data: T, message = 'Created'): Response => {
  return sendSuccess(res, data, message, 201);
};

export const sendPaginated = <T>(
  res: Response,
  result: PaginatedResult<T>,
  message = 'Success',
): Response => {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data: result.data as unknown as T,
    meta: result.meta,
  };
  return res.status(200).json(body);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors?: ValidationError[],
): Response => {
  const body: ApiResponse = { success: false, message, ...(errors && { errors }) };
  return res.status(statusCode).json(body);
};

export const sendUnauthorized = (res: Response, message = 'Unauthorized'): Response => {
  return sendError(res, message, 401);
};

export const sendForbidden = (res: Response, message = 'Forbidden'): Response => {
  return sendError(res, message, 403);
};

export const sendNotFound = (res: Response, message = 'Resource not found'): Response => {
  return sendError(res, message, 404);
};

export const sendBadRequest = (
  res: Response,
  message: string,
  errors?: ValidationError[],
): Response => {
  return sendError(res, message, 400, errors);
};
