import { recalculateAllTrustScores } from '@/lib/apiHandlers/admin';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export async function POST() {
  const { userId, sessionClaims } = auth();
  
  // Check if user is authenticated and has admin role
  if (!userId || sessionClaims?.metadata?.role !== 'admin') {
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
