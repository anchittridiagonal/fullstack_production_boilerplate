'use client';

import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from '@/types';

export const useAuth = () => {
  const router = useRouter();
  const { setAuth, logout: storeLogout, refreshToken, isAuthenticated, user } = useAuthStore();

  const login = async (data: LoginFormData): Promise<void> => {
    const res = await authService.login(data);
    const { user: userData, accessToken, refreshToken: rt } = res.data.data!;
    setAuth(userData, accessToken, rt);
    toast.success(`Welcome back, ${userData.name}!`);
    router.push(userData.role === 'admin' ? '/admin' : '/dashboard');
  };

  const register = async (data: RegisterFormData): Promise<void> => {
    const res = await authService.register(data);
    const { user: userData, accessToken, refreshToken: rt } = res.data.data!;
    setAuth(userData, accessToken, rt);
    toast.success('Account created! Welcome!');
    router.push('/dashboard');
  };

  const logout = async (): Promise<void> => {
    if (refreshToken) {
      await authService.logout(refreshToken).catch(() => undefined);
    }
    storeLogout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const forgotPassword = async (data: ForgotPasswordFormData): Promise<void> => {
    await authService.forgotPassword(data.email);
    toast.success('If that email exists, a reset link has been sent');
  };

  const resetPassword = async (
    token: string,
    data: ResetPasswordFormData,
  ): Promise<void> => {
    await authService.resetPassword(token, data.password, data.confirmPassword);
    toast.success('Password reset! Please log in.');
    router.push('/login');
  };

  return { login, register, logout, forgotPassword, resetPassword, isAuthenticated, user };
};
