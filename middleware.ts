// middleware.ts
import { authMiddleware } from '@clerk/nextjs';
import { NextResponse, type NextRequest } from "next/server";
import type { SessionClaimsWithRole } from '@/lib/types';

export default authMiddleware({
  beforeAuth(req) {
    // Fix undefined "x-forwarded-for" in preview/local environments
    if (!req.headers.get("x-forwarded-for")) {
      req.headers.set("x-forwarded-for", "127.0.0.1");
    }
  },
  afterAuth(auth, req: NextRequest) {
    if (!auth.userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    const role = (auth.sessionClaims as SessionClaimsWithRole)?.metadata?.role as string | undefined;
    const pathname = req.nextUrl.pathname;

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
  },
});

export const config = {
  matcher: [
    // Match everything except public files and Next internals
    "/((?!_next|.*\\..*|favicon.ico).*)",
    "/(api|trpc)(.*)",
  ],
};
