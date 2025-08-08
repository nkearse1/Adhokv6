export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { sql } from 'drizzle-orm';

export async function GET(_req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    const data = await db
      .select({ id: users.id, full_name: users.fullName, username: users.username })
      .from(users)
      .limit(100);

    // Raw SQL sanity check for development
    try {
      const sample = await db.execute(sql`SELECT * FROM users LIMIT 5`);
      console.log('[list-users] sample rows:', sample);
    } catch (err) {
      console.warn('[list-users] raw query failed', err);
    }

    return NextResponse.json({ users: data });
  } catch (err) {
    console.error('list-users error', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
