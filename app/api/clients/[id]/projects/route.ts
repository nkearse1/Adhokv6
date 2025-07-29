import { getClientProjects } from '@/lib/apiHandlers/clients';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { loadUserSession } from '@/lib/server/loadUserSession';
import { db } from '@/lib/db';
import { projects } from '@/lib/schema';
import type { SessionClaimsWithRole } from '@/lib/types';

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
    const projects = await getClientProjects(id);
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching client projects:', error);
    return NextResponse.json({ error: 'Failed to fetch client projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, ctx: RouteContext) {
  const sessionUser = await loadUserSession(req);
  if (!sessionUser || sessionUser.user_role !== 'client') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;
  if (sessionUser.id !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let data: { title: string; description: string };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  try {
    const [project] = await db
      .insert(projects)
      .values({
        title: data.title,
        description: data.description,
        clientId: sessionUser.id,
        createdBy: sessionUser.id,
      })
      .returning();
    return NextResponse.json({ project });
  } catch (err) {
    console.error('Error creating project:', err);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
