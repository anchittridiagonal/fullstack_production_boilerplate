import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="text-center max-w-2xl animate-fade-in">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 shadow-lg">
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
          Production-Ready
          <span className="text-primary-600"> Fullstack App</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Next.js · Express · MongoDB · TypeScript · Tailwind CSS
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login"
            className="btn-primary px-6 py-3 text-base">
            Get Started
          </Link>
          <Link href="/register"
            className="btn-secondary px-6 py-3 text-base">
            Create Account
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { label: 'JWT Auth', icon: '🔐' },
            { label: 'RBAC', icon: '🛡️' },
            { label: 'Swagger', icon: '📖' },
            { label: 'Docker', icon: '🐳' },
          ].map(({ label, icon }) => (
            <div key={label}
              className="card p-4 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
