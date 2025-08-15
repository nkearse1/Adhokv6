export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const hdrs = await headers();
  const overrideId = hdrs.get('x-override-user-id')?.trim();
  if (!overrideId) {
    return NextResponse.json({ session: null });
  }
  try {
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.id, overrideId))
      .limit(1);
    const row = rows[0] as any;
    if (!row) {
      return NextResponse.json({ session: null });
    }
    const metadata = typeof row.metadata === 'object' && row.metadata !== null ? row.metadata : {};
    return NextResponse.json({
      session: {
        userId: row.id,
        userRole: row.userRole,
        username: row.username,
        fullName: row.fullName,
        email: row.email,
        metadata,
      },
    });
  } catch (err) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === '1') {
      console.error('[api/session] failed to load session', err);
    }
    return NextResponse.json({ session: null });
  }
}
