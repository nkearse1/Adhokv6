import { NextRequest, NextResponse } from 'next/server';
import { flagTalent } from '@/lib/apiHandlers/talent';
import { auth } from '@clerk/nextjs';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId, sessionClaims } = auth();
  
  // Check if user is authenticated and has admin role
  if (!userId || sessionClaims?.metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { reason } = await req.json();
    const data = await flagTalent(params.id, reason);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error flagging talent:', error);
    return NextResponse.json({ error: 'Failed to flag talent' }, { status: 500 });
  }
}
