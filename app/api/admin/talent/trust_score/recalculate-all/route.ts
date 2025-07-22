import { recalculateAllTrustScores } from '@/lib/apiHandlers/admin';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';

type SessionClaimsWithRole = {
  metadata?: {
    role?: string;
  };
};

export async function POST(_req: NextRequest) {
  const clerkActive = !!process.env.CLERK_SECRET_KEY;
  const { userId, sessionClaims } = clerkActive
    ? await auth()
    : { userId: undefined, sessionClaims: undefined };
  const role = (sessionClaims as SessionClaimsWithRole)?.metadata?.role;

  // Check if user is authenticated and has admin role
  if (clerkActive && (!userId || role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const result = await recalculateAllTrustScores();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error recalculating trust scores:', error);
    return NextResponse.json({ error: 'Failed to recalculate trust scores' }, { status: 500 });
  }
}
