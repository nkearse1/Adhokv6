import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type SessionClaimsWithRole = {
  metadata?: {
    role?: string;
  };
};

export const runtime = 'nodejs'; // ⛔ Clerk not supported on Edge runtime

export async function GET(_req: NextRequest) {
  const clerkActive = !!process.env.CLERK_SECRET_KEY;
  const { userId, sessionClaims } = clerkActive
    ? await auth()
    : { userId: undefined, sessionClaims: undefined };

  // ✅ Safely extract role
  const userRole = (sessionClaims as SessionClaimsWithRole)?.metadata?.role;

  if (clerkActive && (!userId || userRole !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ✅ Placeholder response — replace with real stats
  return NextResponse.json({ stats: "This is where your admin stats would go." });
}
