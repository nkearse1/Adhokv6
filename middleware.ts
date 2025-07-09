// middleware.ts
import { authMiddleware } from '@clerk/nextjs/server';
import {
  NextResponse,
  type NextRequest,
  type NextFetchEvent,
} from 'next/server';
import type { AuthObject } from '@clerk/backend';
import type { SessionClaimsWithRole } from '@/lib/types';

function safeRedirect(path: string, req: NextRequest) {
  const url = new URL(path, req.url);
  if (req.nextUrl.pathname === url.pathname) {
    return NextResponse.next();
  }
  return NextResponse.redirect(url);
}

export default authMiddleware({
  publicRoutes: ['/', '/sign-in', '/sign-up', '/waitlist'],

  afterAuth(auth: AuthObject, req: NextRequest, _evt: NextFetchEvent) {
    const pathname = req.nextUrl.pathname;
    const role = (auth.sessionClaims as SessionClaimsWithRole)?.metadata?.role as
      string | undefined;

    if (process.env.NODE_ENV === 'development') {
      console.log('auth middleware', {
        userId: auth.userId,
        role,
        pathname,
      });
    }

    if (!auth.userId) return NextResponse.next(); // allow public pages

    if (!role) {
      if (pathname !== '/waitlist') {
        return safeRedirect('/waitlist', req);
      }
      return NextResponse.next();
    }

    const validRoles = ['admin', 'client', 'talent'];
    if (!validRoles.includes(role)) {
      return NextResponse.next();
    }

    if (pathname.startsWith('/admin') && role !== 'admin') {
      return safeRedirect('/', req);
    }

    if (pathname.startsWith('/client') && role !== 'client') {
      return safeRedirect('/', req);
    }

    if (pathname.startsWith('/talent/dashboard') && role !== 'talent') {
      return safeRedirect('/', req);
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ['/((?!_next|.*\\..*|favicon.ico).*)', '/(api|trpc)(.*)'],
};
