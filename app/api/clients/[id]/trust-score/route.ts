import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import type { SessionClaimsWithRole } from '@/lib/types';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(
  request: NextRequest,
  ctx: RouteContext
) {
  const { id } = await ctx.params;
  const clerkActive = !!process.env.CLERK_SECRET_KEY;
  let userId: string | undefined;
  let sessionClaims: SessionClaimsWithRole | undefined;
  if (clerkActive) {
    const { auth } = await import('@clerk/nextjs/server');
    const result = await auth();
    userId = result.userId;
    sessionClaims = result.sessionClaims as SessionClaimsWithRole;
  }
  const user_role = sessionClaims?.metadata?.user_role;
  
  // Check if user is authenticated and has admin role
  if (clerkActive && (!userId || user_role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const score = Math.floor(Math.random() * 61) + 40; // dummy score 40-100
    await db
      .update(users)
      .set({ trustScore: score, updatedAt: new Date() })
      .where(eq(users.id, id));
    return NextResponse.json({ success: true, score });
  } catch (err) {
    console.error('Update trust score error', err);
    return NextResponse.json({ error: 'Failed to update trust score' }, { status: 500 });
  }
}
