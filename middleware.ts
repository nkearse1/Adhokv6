import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/client(.*)',
  '/talent/dashboard(.*)',
]);

export default clerkMiddleware((auth, req) => {
  // If the route is protected and user is not authenticated, redirect to sign-in
  if (isProtectedRoute(req) && !auth().userId) {
    const signInUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // If user is authenticated and accessing a protected route, check their role
  if (isProtectedRoute(req) && auth().userId) {
    const { sessionClaims } = auth();
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
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)',
  ],
};