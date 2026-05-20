import type { Metadata } from 'next';
import Link from 'next/link';

import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm';

export const metadata: Metadata = { title: 'Forgot Password' };

export default function ForgotPasswordPage() {
  return (
    <div className="card p-8 shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot password?</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter your email to receive a reset link
        </p>
      </div>

      <ForgotPasswordForm />

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Remember your password?{' '}
        <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
          Back to login
        </Link>
      </p>
    </div>
  );
}
