import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Only apply protection to admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Check for authentication cookie
  const authCookie = request.cookies.get('auth');

  if (!authCookie) {
    // Redirect to login for admin routes if not authenticated
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For admin routes, verify the auth token
  try {
    // The auth cookie should contain a valid Firebase token
    // In a production environment, you might want to verify the token here
    // For now, we'll trust the presence of the cookie
    return NextResponse.next();
  } catch (error) {
    // If token verification fails, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  // Only run middleware on admin routes
  matcher: ['/admin/:path*'],
};
