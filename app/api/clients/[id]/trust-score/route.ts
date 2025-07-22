import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import type { SessionClaimsWithRole } from '@/lib/types';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(
  request: NextRequest,
  ctx: RouteContext
) {
  const { id } = await ctx.params;
  const clerkActive = !!process.env.CLERK_SECRET_KEY;
  const { userId, sessionClaims } = clerkActive
    ? await auth()
    : { userId: undefined, sessionClaims: undefined };
  const role = (sessionClaims as SessionClaimsWithRole)?.metadata?.role;
  
  // Check if user is authenticated and has admin role
  if (clerkActive && (!userId || role !== 'admin')) {
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
