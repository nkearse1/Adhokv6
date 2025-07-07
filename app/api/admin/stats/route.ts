import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type SessionClaimsWithRole = {
  metadata?: {
    role?: string;
  };
};

export const runtime = 'nodejs'; // ⛔ Clerk not supported on Edge runtime

export async function GET(_req: NextRequest, _ctx: { params: {} }) {
  const { userId, sessionClaims } = auth();

  // ✅ Safely extract role
  const userRole = (sessionClaims as SessionClaimsWithRole)?.metadata?.role;

  if (!userId || userRole !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ✅ Placeholder response — replace with real stats
  return NextResponse.json({ stats: "This is where your admin stats would go." });
}
