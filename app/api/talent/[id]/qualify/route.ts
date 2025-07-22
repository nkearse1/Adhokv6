import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { qualifyTalent } from '@/lib/apiHandlers/talent';
import { auth } from '@clerk/nextjs/server';
import type { SessionClaimsWithRole } from '@/lib/types';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
  const { userId, sessionClaims } = isMock
    ? {
        userId: process.env.NEXT_PUBLIC_SELECTED_USER_ID,
        sessionClaims: { metadata: { role: 'admin' } },
      }
    : await auth();
  const role = (sessionClaims as SessionClaimsWithRole)?.metadata?.role;
  
  // Check if user is authenticated and has admin role
  if (!isMock && (!userId || role !== 'admin')) {
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
