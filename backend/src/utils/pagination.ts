import { Request } from 'express';
import { FilterQuery, Model, Document } from 'mongoose';

import { PaginatedResult, PaginationOptions } from '../types';

export const parsePaginationOptions = (req: Request): PaginationOptions => {
  const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10));
  const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit ?? '10'), 10)));
  const sort = String(req.query.sort ?? 'createdAt');
  const order = req.query.order === 'asc' ? 'asc' : 'desc';
  const search = req.query.search ? String(req.query.search) : undefined;

  return { page, limit, sort, order, search };
};

export const paginate = async <T extends Document>(
  model: Model<T>,
  filter: FilterQuery<T>,
  options: PaginationOptions,
  projection?: Record<string, unknown>,
): Promise<PaginatedResult<T>> => {
  const { page, limit, sort = 'createdAt', order = 'desc' } = options;
  const skip = (page - 1) * limit;
  const sortObj = { [sort]: order === 'asc' ? 1 : -1 } as Record<string, 1 | -1>;

  const [data, total] = await Promise.all([
    model
      .find(filter, projection)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean<T[]>(),
    model.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

export const buildSearchFilter = (
  search: string | undefined,
  fields: string[],
): Record<string, unknown> => {
  if (!search) return {};
  const regex = { $regex: search, $options: 'i' };
  return { $or: fields.map((f) => ({ [f]: regex })) };
};
