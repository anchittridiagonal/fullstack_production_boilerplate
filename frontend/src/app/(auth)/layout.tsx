import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Auth', template: '%s | Auth' },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <header className="py-4 px-6">
        <Link href="/"
          className="inline-flex items-center gap-2 text-primary-600 font-semibold text-lg">
          <div className="h-7 w-7 rounded-lg bg-primary-600 flex items-center justify-center">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          Fullstack App
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
