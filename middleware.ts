// middleware.ts
import { withClerkMiddleware, getAuth } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from "next/server";
import type { SessionClaimsWithRole } from '@/lib/types';

const handleClerkAuth = (req: NextRequest): NextResponse => {
  const { userId, sessionClaims } = getAuth(req);

  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
  const role = (sessionClaims as SessionClaimsWithRole)?.metadata?.role as
    string | undefined;

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
};

export default withClerkMiddleware(handleClerkAuth);

export const config = {
  matcher: [
    // Match everything except public files and Next internals
    "/((?!_next|.*\\..*|favicon.ico).*)",
    "/(api|trpc)(.*)",
  ],
};
