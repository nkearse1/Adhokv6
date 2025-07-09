// middleware.ts
import { authMiddleware } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';
import type { SessionClaimsWithRole } from '@/lib/types';

export default authMiddleware({
  publicRoutes: ['/', '/sign-in', '/sign-up', '/waitlist'],

  afterAuth(auth, req: NextRequest) {
    if (!auth.userId) return NextResponse.next(); // allow all public pages

    const role = (auth.sessionClaims as SessionClaimsWithRole)?.metadata?.role as string | undefined;
    const pathname = req.nextUrl.pathname;

    if (!role) {
      if (pathname !== '/waitlist') {
        return NextResponse.redirect(new URL('/waitlist', req.url));
      }
      return NextResponse.next();
    }

    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (pathname.startsWith('/client') && role !== 'client') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (pathname.startsWith('/talent/dashboard') && role !== 'talent') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ['/((?!_next|.*\\..*|favicon.ico).*)', '/(api|trpc)(.*)'],
};
