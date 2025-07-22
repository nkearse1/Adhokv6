import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import type { SessionClaimsWithRole } from '@/lib/types';

export async function GET(_req: NextRequest) {
  const clerkActive = !!process.env.CLERK_SECRET_KEY;
  const { userId, sessionClaims } = clerkActive ? await auth() : { userId: undefined, sessionClaims: undefined };
  const role = (sessionClaims as SessionClaimsWithRole)?.metadata?.role;

  // Check if user is authenticated and has admin role
  if (clerkActive && (!userId || role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const data = await db.select().from(users).where(eq(users.userRole, 'client'));
    return NextResponse.json({ data });
  } catch (err) {
    console.error('Error fetching clients', err);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}
