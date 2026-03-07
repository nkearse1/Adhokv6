import { recalculateAllTrustScores } from '@/lib/apiHandlers/admin';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type SessionClaimsWithRole = {
  metadata?: {
    user_role?: string;
  };
};

export async function POST(_req: NextRequest) {
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
    const result = await recalculateAllTrustScores();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error recalculating trust scores:', error);
    return NextResponse.json({ error: 'Failed to recalculate trust scores' }, { status: 500 });
  }
}
