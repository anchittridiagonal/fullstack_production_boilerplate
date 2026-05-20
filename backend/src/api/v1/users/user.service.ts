import { FilterQuery } from 'mongoose';

import { AppError } from '../../../middleware/error.middleware';
import { User } from '../../../models/user.model';
import { IUser, PaginatedResult, PaginationOptions } from '../../../types';
import { paginate, buildSearchFilter } from '../../../utils/pagination';

export const getUsers = async (
  options: PaginationOptions & { role?: string; isActive?: boolean },
): Promise<PaginatedResult<IUser>> => {
  const filter: FilterQuery<IUser> = { deletedAt: null };

  if (options.role) filter.role = options.role;
  if (options.isActive !== undefined) filter.isActive = options.isActive;
  if (options.search) {
    Object.assign(filter, buildSearchFilter(options.search, ['name', 'email']));
  }

  return paginate<IUser>(User, filter, options);
};

export const getUserById = async (id: string): Promise<IUser> => {
  const user = await User.findById(id);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

export const updateProfile = async (
  userId: string,
  data: { name?: string; avatar?: string },
  updatedBy: string,
): Promise<IUser> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { ...data, updatedBy },
    { new: true, runValidators: true },
  );
  if (!user) throw new AppError('User not found', 404);
  return user;
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new AppError('User not found', 404);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new AppError('Current password is incorrect', 400);

  user.password = newPassword;
  await user.save();
};

export const adminUpdateUser = async (
  userId: string,
  data: { name?: string; role?: string; isActive?: boolean },
  updatedBy: string,
): Promise<IUser> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { ...data, updatedBy },
    { new: true, runValidators: true },
  );
  if (!user) throw new AppError('User not found', 404);
  return user;
};

export const softDeleteUser = async (userId: string, deletedBy: string): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  await User.findByIdAndUpdate(userId, {
    deletedAt: new Date(),
    updatedBy: deletedBy,
    isActive: false,
  });
};

export const getDashboardStats = async () => {
  const [totalUsers, adminCount, activeUsers, newThisMonth] = await Promise.all([
    User.countDocuments({ deletedAt: null }),
    User.countDocuments({ role: 'admin', deletedAt: null }),
    User.countDocuments({ isActive: true, deletedAt: null }),
    User.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      deletedAt: null,
    }),
  ]);

  return { totalUsers, adminCount, activeUsers, newThisMonth };
};
