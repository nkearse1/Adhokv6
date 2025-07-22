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
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
  const { userId, sessionClaims } = isMock
    ? { userId: 'mock', sessionClaims: { metadata: { role: 'admin' } } }
    : await auth();
  const role = (sessionClaims as SessionClaimsWithRole)?.metadata?.role;

  // Check if user is authenticated and has admin role
  if (!isMock && (!userId || role !== 'admin')) {
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
