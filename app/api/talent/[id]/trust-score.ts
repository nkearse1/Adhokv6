import { NextResponse } from 'next/server';
import { updateTalentTrustScore } from '@/lib/apiHandlers/talent';
import { auth } from '@clerk/nextjs';
import type { SessionClaimsWithRole } from '@/lib/types';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims as SessionClaimsWithRole)?.metadata?.role;
  
  // Check if user is authenticated and has admin role
  if (!userId || role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const data = await updateTalentTrustScore(params.id);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error updating trust score:', error);
    return NextResponse.json({ error: 'Failed to update trust score' }, { status: 500 });
  }
}
