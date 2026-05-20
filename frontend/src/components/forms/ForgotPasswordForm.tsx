'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

export const ForgotPasswordForm = () => {
  const { forgotPassword } = useAuth();
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await forgotPassword(data);
      setSent(true);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (sent) {
    return (
      <div className="text-center py-4">
        <div className="mx-auto h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-gray-700 dark:text-gray-300">
          If that email address is registered, you&apos;ll receive a reset link shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        {...register('email')}
        error={errors.email?.message}
      />

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Send Reset Link
      </Button>
    </form>
  );
};
