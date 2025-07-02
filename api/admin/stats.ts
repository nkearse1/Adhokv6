import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const runtime = 'nodejs'; // ⛔ Clerk not supported on Edge runtime

export async function GET() {
  const { userId, sessionClaims } = auth();

  // ✅ Safely extract role
  const userRole = (sessionClaims?.metadata as { role?: string })?.role;

  if (!userId || userRole !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ✅ Placeholder response — replace with real stats
  return NextResponse.json({ stats: "This is where your admin stats would go." });
}
