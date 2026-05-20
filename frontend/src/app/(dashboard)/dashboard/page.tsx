'use client';

import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/helpers';

export default function UserDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Here&apos;s what&apos;s happening with your account.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Profile Status</h3>
            <Badge variant={user?.isActive ? 'success' : 'danger'}>
              {user?.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p><span className="font-medium">Name:</span> {user?.name}</p>
            <p><span className="font-medium">Email:</span> {user?.email}</p>
            <p><span className="font-medium">Role:</span> {user?.role}</p>
            <p><span className="font-medium">Member since:</span>{' '}
              {user?.createdAt ? formatDate(user.createdAt) : '—'}
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Email Verification</h3>
          <div className="flex items-center gap-3">
            {user?.isEmailVerified ? (
              <>
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Verified</p>
                  <p className="text-sm text-gray-500">Email is verified</p>
                </div>
              </>
            ) : (
              <>
                <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                  <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Not Verified</p>
                  <p className="text-sm text-gray-500">Please verify your email</p>
                </div>
              </>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
          <nav className="space-y-2">
            {[
              { href: '/profile', label: 'Edit Profile' },
              { href: '/profile', label: 'Change Password' },
            ].map(({ href, label }) => (
              <a key={label} href={href}
                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5l7 7-7 7" />
                </svg>
                {label}
              </a>
            ))}
          </nav>
        </Card>
      </div>
    </div>
  );
}
