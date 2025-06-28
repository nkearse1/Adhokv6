import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
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