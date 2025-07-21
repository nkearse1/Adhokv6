export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    const data = await db
      .select({ id: users.id, full_name: users.fullName, username: users.username })
      .from(users)
      .limit(100);
    return NextResponse.json({ users: data });
  } catch (err) {
    console.error('list-users error', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
