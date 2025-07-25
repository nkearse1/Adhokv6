import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { qualifyTalent } from '@/lib/apiHandlers/talent';
import type { SessionClaimsWithRole } from '@/lib/types';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
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
    const { qualified } = await request.json();
    const data = await qualifyTalent(id, qualified);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error updating talent qualification:', error);
    return NextResponse.json({ error: 'Failed to update talent qualification' }, { status: 500 });
  }
}
