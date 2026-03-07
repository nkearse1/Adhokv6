import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type SessionClaimsWithRole = {
  metadata?: {
    user_role?: string;
  };
};

export const runtime = 'nodejs'; // ⛔ Clerk not supported on Edge runtime

export async function GET(_req: NextRequest) {
  const clerkActive = !!process.env.CLERK_SECRET_KEY;
  let userId: string | undefined;
  let sessionClaims: SessionClaimsWithRole | undefined;
  if (clerkActive) {
    const { auth } = await import("@clerk/nextjs/server");
    const result = await auth();
    userId = result.userId;
    sessionClaims = result.sessionClaims as SessionClaimsWithRole;
  }

  // ✅ Safely extract role
  const userRole = sessionClaims?.metadata?.user_role;

  if (clerkActive && (!userId || userRole !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ✅ Placeholder response — replace with real stats
  return NextResponse.json({ stats: "This is where your admin stats would go." });
}
