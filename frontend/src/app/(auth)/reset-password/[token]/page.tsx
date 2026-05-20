import type { Metadata } from 'next';
import Link from 'next/link';

import { ResetPasswordForm } from '@/components/forms/ResetPasswordForm';

export const metadata: Metadata = { title: 'Reset Password' };

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  return (
    <div className="card p-8 shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset password</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Create a new strong password
        </p>
      </div>

      <ResetPasswordForm token={params.token} />

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
          Back to login
        </Link>
      </p>
    </div>
  );
}
