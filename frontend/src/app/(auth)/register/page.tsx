import type { Metadata } from 'next';
import Link from 'next/link';

import { RegisterForm } from '@/components/forms/RegisterForm';

export const metadata: Metadata = { title: 'Register' };

export default function RegisterPage() {
  return (
    <div className="card p-8 shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create account</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Get started for free
        </p>
      </div>

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
          Sign in
        </Link>
      </p>
    </div>
  );
}
