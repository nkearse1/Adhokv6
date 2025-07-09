import { authMiddleware } from '@clerk/nextjs';
import { NextResponse, type NextRequest } from 'next/server';
import type { SessionClaimsWithRole } from '@/lib/types';

export default authMiddleware({
  beforeAuth(req) {
    if (!req.headers.get("x-forwarded-for")) {
      req.headers.set("x-forwarded-for", "127.0.0.1");
    }
  },
  publicRoutes: ['/', '/sign-in', '/waitlist', '/about', '/terms', '/privacy'],
  afterAuth(auth, req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // Allow unauthenticated users on public pages
    if (!auth.userId) {
      return NextResponse.next();
    }

    const role = (auth.sessionClaims as SessionClaimsWithRole)?.metadata?.role as string | undefined;

    // Protect role-specific routes
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/client") && role !== "client") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/talent/dashboard") && role !== "talent") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*|favicon.ico).*)",
    "/(api|trpc)(.*)",
  ],
};
