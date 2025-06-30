// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

export default clerkMiddleware((auth, req) => {
  const { userId, sessionClaims } = auth();
  const role = sessionClaims?.metadata?.role as string | undefined;

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
});

export const config = {
  matcher: [
    // Match everything except public files and Next internals
    "/((?!_next|.*\\..*|favicon.ico).*)",
    "/(api|trpc)(.*)",
  ],
};
