import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { projects } from '@/lib/schema';

type SessionClaimsWithRole = {
  metadata?: {
    user_role?: string;
  };
};

export async function GET(_req: NextRequest) {
  const clerkActive = !!process.env.CLERK_SECRET_KEY;
  let userId: string | undefined;
  let sessionClaims: SessionClaimsWithRole | undefined;
  if (clerkActive) {
    const { auth } = await import('@clerk/nextjs/server');
    const result = await auth();
    userId = result.userId;
    sessionClaims = result.sessionClaims as SessionClaimsWithRole;
  }
  const user_role = sessionClaims?.metadata?.user_role;

  // Check if user is authenticated and has admin role
  if (clerkActive && (!userId || user_role !== 'admin')) {
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
