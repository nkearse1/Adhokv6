import { getClientById } from '@/lib/apiHandlers/clients';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';

type SessionClaimsWithRole = {
  metadata?: {
    role?: string;
  };
};

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
  const { userId, sessionClaims } = isMock
    ? { userId: 'mock', sessionClaims: { metadata: { role: 'admin' } } }
    : await auth();
  const role = (sessionClaims as SessionClaimsWithRole)?.metadata?.role;
  
  // Check if user is authenticated
  if (!isMock && !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check if user is admin or the client themselves
  const isAdmin = role === 'admin';
  const isOwnProfile = userId === id;
  
  if (!isMock && !isAdmin && !isOwnProfile) {
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
