import { authMiddleware } from '@clerk/nextjs/server';
import {
  NextResponse,
  type NextRequest,
  type NextFetchEvent,
} from 'next/server';
import type { AuthObject } from '@clerk/backend';
import type { SessionClaimsWithRole } from '@/lib/types';

const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

function safeRedirect(path: string, req: NextRequest) {
  const url = new URL(path, req.url);
  if (req.nextUrl.pathname === url.pathname) {
    return NextResponse.next();
  }
  return NextResponse.redirect(url);
}

function mockMiddleware(req: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[middleware] MOCK MODE ACTIVE — skipping Clerk auth enforcement');
  }
  return NextResponse.next();
}

const clerkMiddleware = authMiddleware({
  publicRoutes: ['/', '/sign-in', '/sign-up', '/waitlist', '/sign-in-callback'],

  afterAuth(auth: AuthObject, req: NextRequest, _evt: NextFetchEvent) {
    const pathname = req.nextUrl.pathname;

    const role = (auth.sessionClaims as SessionClaimsWithRole)?.metadata?.role as
      string | undefined;

    if (process.env.NODE_ENV === 'development') {
      console.log('[middleware]', {
        userId: auth.userId,
        role,
        pathname,
      });
    }

    if (!auth.userId) return NextResponse.next();

    if (auth.userId && !role && pathname !== '/') {
      return safeRedirect('/', req);
    }

    const validRoles = ['admin', 'client', 'talent'];
    if (!role || !validRoles.includes(role)) return NextResponse.next();

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

const middleware = isMock ? mockMiddleware : clerkMiddleware;

export default middleware;

export const config = {
  matcher: ['/((?!_next|.*\\..*|favicon.ico).*)', '/(api|trpc)(.*)'],
};
