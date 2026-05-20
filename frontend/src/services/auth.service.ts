import api from '@/lib/axios';
import {
  ApiResponse,
  AuthTokens,
  LoginFormData,
  RegisterFormData,
  User,
} from '@/types';

export const authService = {
  register: (data: RegisterFormData) =>
    api.post<ApiResponse<{ user: User } & AuthTokens>>('/auth/register', data),

  login: (data: LoginFormData) =>
    api.post<ApiResponse<{ user: User } & AuthTokens>>('/auth/login', data),

  logout: (refreshToken: string) =>
    api.post<ApiResponse>('/auth/logout', { refreshToken }),

  refreshToken: (refreshToken: string) =>
    api.post<ApiResponse<AuthTokens>>('/auth/refresh-token', { refreshToken }),

  forgotPassword: (email: string) =>
    api.post<ApiResponse>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string, confirmPassword: string) =>
    api.post<ApiResponse>('/auth/reset-password', { token, password, confirmPassword }),

  getMe: () => api.get<ApiResponse<User>>('/auth/me'),
};
