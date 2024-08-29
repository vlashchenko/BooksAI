// middleware.js

import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = req.cookies.get('next-auth.session-token') || req.cookies.get('__Secure-next-auth.session-token');

  // Redirect to sign-in page if token is not present
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // Continue with the request if the token exists
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};