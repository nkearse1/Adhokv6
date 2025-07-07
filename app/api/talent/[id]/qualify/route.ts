import { NextRequest, NextResponse } from 'next/server';
import { qualifyTalent } from '@/lib/apiHandlers/talent';
import { auth } from '@clerk/nextjs';
import type { SessionClaimsWithRole } from '@/lib/types';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims as SessionClaimsWithRole)?.metadata?.role;
  
  // Check if user is authenticated and has admin role
  if (!userId || role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { qualified } = await request.json();
    const data = await qualifyTalent(params.id, qualified);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error updating talent qualification:', error);
    return NextResponse.json({ error: 'Failed to update talent qualification' }, { status: 500 });
  }
}
