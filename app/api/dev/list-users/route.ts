export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';

export async function GET(_req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    const data = await db
      .select({ id: users.id, full_name: users.fullName, username: users.username })
      .from(users)
      .limit(100);

    if (process.env.NEXT_PUBLIC_DEBUG_DB === '1') {
      console.log('[list-users] preview', data.slice(0, 5));
    }

    return NextResponse.json({ users: data });
  } catch (err) {
    console.error('list-users error', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
