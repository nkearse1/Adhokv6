import { getClientProjects } from '@/lib/apiHandlers/clients';
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs';
import type { SessionClaimsWithRole } from '@/lib/types';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims as SessionClaimsWithRole)?.metadata?.role;
  
  // Check if user is authenticated
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check if user is admin or the client themselves
  const isAdmin = role === 'admin';
  const isOwnProfile = userId === id;
  
  if (!isAdmin && !isOwnProfile) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  try {
    const projects = await getClientProjects(id);
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching client projects:', error);
    return NextResponse.json({ error: 'Failed to fetch client projects' }, { status: 500 });
  }
}
