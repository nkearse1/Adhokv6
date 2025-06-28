import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    '/',
    '/sign-in',
    '/sign-up',
    '/waitlist',
    '/api/clerk/webhook',
    '/api/public', 
    '/_next/static', 
    '/favicon.ico'
  ],
  
  afterAuth(auth, req) {
    // If user is not authenticated and trying to access protected route
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // If user is authenticated and accessing a protected route, check their role
    if (auth.userId && !auth.isPublicRoute) {
      const { sessionClaims } = auth;
      const userRole = sessionClaims?.metadata?.role as string || 'talent';
      
      // Admin routes protection
      if (req.nextUrl.pathname.startsWith('/admin') && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url));
      }
      
      // Client routes protection
      if (req.nextUrl.pathname.startsWith('/client') && userRole !== 'client') {
        return NextResponse.redirect(new URL('/', req.url));
      }
      
      // Talent routes protection
      if (req.nextUrl.pathname.startsWith('/talent/dashboard') && userRole !== 'talent') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)',
  ],
};