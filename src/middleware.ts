import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const path = request.nextUrl.pathname;

  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/api/auth/login', '/api/auth/register', '/api/auth/forgot-password', '/api/auth/reset-password', '/api/setup-admin'];
  
  // Decrypt session if it exists
  let user = null;
  if (session) {
      try {
          user = await decrypt(session);
      } catch (e) {
          // Invalid session
      }
  }

  // 1. If trying to access protected route without session
  const isPublic = publicRoutes.some(route => path.startsWith(route));
  if (!isPublic && !user) {
      return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. If trying to access public auth pages while logged in
  if (path === '/login' || path === '/register') {
      if (user) {
          return NextResponse.redirect(new URL('/', request.url));
      }
  }

  // 3. Admin routes protection
  if (path.startsWith('/admin')) {
      if (!user || user.role !== 'ADMIN') {
          return NextResponse.redirect(new URL('/', request.url));
      }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
