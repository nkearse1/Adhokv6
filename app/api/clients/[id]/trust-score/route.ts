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
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
  const { userId, sessionClaims } = isMock
    ? {
        userId: process.env.NEXT_PUBLIC_SELECTED_USER_ID,
        sessionClaims: { metadata: { role: 'admin' } },
      }
    : await auth();
  const role = (sessionClaims as SessionClaimsWithRole)?.metadata?.role;
  
  // Check if user is authenticated and has admin role
  if (!isMock && (!userId || role !== 'admin')) {
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
