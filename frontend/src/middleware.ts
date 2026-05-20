import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];
const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authStorage = request.cookies.get('auth-storage')?.value;
  let isAuthenticated = false;
  let role: string | null = null;

  if (authStorage) {
    try {
      const parsed = JSON.parse(decodeURIComponent(authStorage)) as {
        state: { isAuthenticated: boolean; user: { role: string } | null };
      };
      isAuthenticated = parsed.state?.isAuthenticated ?? false;
      role = parsed.state?.user?.role ?? null;
    } catch {
      isAuthenticated = false;
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(
      new URL(role === 'admin' ? '/admin' : '/dashboard', request.url),
    );
  }

  // Protect dashboard and admin routes
  if (!isAuthenticated && !PUBLIC_ROUTES.some((r) => pathname.startsWith(r)) && pathname !== '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Admin-only protection
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
