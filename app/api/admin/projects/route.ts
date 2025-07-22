import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { projects } from '@/lib/schema';
import { auth } from '@clerk/nextjs/server';

type SessionClaimsWithRole = {
  metadata?: {
    role?: string;
  };
};

export async function GET(_req: NextRequest) {
  const clerkActive = !!process.env.CLERK_SECRET_KEY;
  const { userId, sessionClaims } = clerkActive ? await auth() : { userId: undefined, sessionClaims: undefined };
  const role = (sessionClaims as SessionClaimsWithRole)?.metadata?.role;

  // Check if user is authenticated and has admin role
  if (clerkActive && (!userId || role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const data = await db.select().from(projects).limit(100);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching admin projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
