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
  User,
} from '@/types';

// Middleware reads this cookie to check auth server-side.
// Must stay in sync with Zustand localStorage state.
const setAuthCookie = (user: User) => {
  const value = encodeURIComponent(
    JSON.stringify({ state: { isAuthenticated: true, user: { role: user.role } } }),
  );
  document.cookie = `auth-storage=${value}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
};

const clearAuthCookie = () => {
  document.cookie = 'auth-storage=; path=/; max-age=0';
};

export const useAuth = () => {
  const router = useRouter();
  const { setAuth, logout: storeLogout, refreshToken, isAuthenticated, user } = useAuthStore();

  const login = async (data: LoginFormData): Promise<void> => {
    const res = await authService.login(data);
    const { user: userData, accessToken, refreshToken: rt } = res.data.data!;
    setAuth(userData, accessToken, rt);
    setAuthCookie(userData);
    toast.success(`Welcome back, ${userData.name}!`);
    router.push(userData.role === 'admin' ? '/admin' : '/dashboard');
  };

  const register = async (data: RegisterFormData): Promise<void> => {
    const res = await authService.register(data);
    const { user: userData, accessToken, refreshToken: rt } = res.data.data!;
    setAuth(userData, accessToken, rt);
    setAuthCookie(userData);
    toast.success('Account created! Welcome!');
    router.push('/dashboard');
  };

  const logout = async (): Promise<void> => {
    if (refreshToken) {
      await authService.logout(refreshToken).catch(() => undefined);
    }
    storeLogout();
    clearAuthCookie();
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
