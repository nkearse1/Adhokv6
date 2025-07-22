import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { flagTalent } from '@/lib/apiHandlers/talent';
import { auth } from '@clerk/nextjs/server';
import type { SessionClaimsWithRole } from '@/lib/types';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
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
    const { reason } = await request.json();
    const data = await flagTalent(id, reason);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error flagging talent:', error);
    return NextResponse.json({ error: 'Failed to flag talent' }, { status: 500 });
  }
}
