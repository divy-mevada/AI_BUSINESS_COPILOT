import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Try to get token from cookies. 
  // Note: if you are using localStorage exclusively, middleware won't be able to access tokens.
  // For standard JWT + Next.js App Router, it's recommended to set an auth cookie alongside localStorage
  // or use client-side protection for these routes.
  const hasToken = request.cookies.has('access_token') || request.cookies.has('refresh_token');

  const protectedRoutes = ['/dashboard', '/upload', '/reports'];
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !hasToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/upload/:path*', '/reports/:path*'],
};
