import api from '@/lib/axios';
import {
  ApiResponse,
  ChangePasswordFormData,
  DashboardStats,
  QueryParams,
  UpdateProfileFormData,
  User,
} from '@/types';

export const userService = {
  getUsers: (params?: QueryParams) =>
    api.get<ApiResponse<User[]>>('/users', { params }),

  getUserById: (id: string) =>
    api.get<ApiResponse<User>>(`/users/${id}`),

  updateProfile: (data: UpdateProfileFormData) =>
    api.put<ApiResponse<User>>('/users/profile', data),

  changePassword: (data: ChangePasswordFormData) =>
    api.put<ApiResponse>('/users/change-password', data),

  adminUpdateUser: (id: string, data: Partial<Pick<User, 'name' | 'role' | 'isActive'>>) =>
    api.put<ApiResponse<User>>(`/users/${id}`, data),

  deleteUser: (id: string) =>
    api.delete<ApiResponse>(`/users/${id}`),

  getDashboardStats: () =>
    api.get<ApiResponse<DashboardStats>>('/users/dashboard/stats'),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post<ApiResponse<User>>('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
