import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs';
import type { SessionClaimsWithRole } from '@/lib/types';

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims as SessionClaimsWithRole)?.metadata?.role;
  
  // Check if user is authenticated and has admin role
  if (!userId || role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const score = Math.floor(Math.random() * 61) + 40; // dummy score 40-100
    await db
      .update(users)
      .set({ trustScore: score, updatedAt: new Date() })
      .where(eq(users.id, params.id));
    return NextResponse.json({ success: true, score });
  } catch (err) {
    console.error('Update trust score error', err);
    return NextResponse.json({ error: 'Failed to update trust score' }, { status: 500 });
  }
}
