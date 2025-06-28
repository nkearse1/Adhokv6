import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(users).where(eq(users.userRole, 'client'));
    return NextResponse.json({ data });
  } catch (err) {
    console.error('Error fetching clients', err);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}