import { getClientById } from '@/lib/apiHandlers/clients';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
type SessionClaimsWithRole = {
  metadata?: {
    user_role?: string;
  };
};

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: RouteContext) {
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
  
  // Check if user is authenticated
  if (clerkActive && !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check if user is admin or the client themselves
  const isAdmin = user_role === 'admin';
  const isOwnProfile = userId === id;
  
  if (clerkActive && !isAdmin && !isOwnProfile) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  try {
    const client = await getClientById(id);
    return client
      ? NextResponse.json({ client })
      : NextResponse.json({ error: 'Client not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 });
  }
}
