import { getClientProjects } from '@/lib/apiHandlers/clients';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { loadUserSession } from '@/lib/loadUserSession';
import { db } from '@/lib/db';
import { projects, clientProfiles } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import type { SessionClaimsWithRole } from '@/lib/types';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  const clerkActive = !!process.env.CLERK_SECRET_KEY;
  let userId: string | undefined;
  let sessionClaims: SessionClaimsWithRole | undefined;
  if (clerkActive) {
    const result = getAuth(req);
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
  const sessionUser = await loadUserSession();
  if (
    !sessionUser ||
    (sessionUser.userRole !== 'client' && sessionUser.userRole !== 'talent')
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;
  if (sessionUser.userId !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let data: { title: string; description: string; deadline: string };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  if (!data.title || !data.description || !data.deadline) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (sessionUser.userRole === 'talent') {
    const existing = await db
      .select()
      .from(clientProfiles)
      .where(eq(clientProfiles.id, sessionUser.userId))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(clientProfiles).values({
        id: sessionUser.userId,
        email: null,
        companyName: '',
      });
    }
  }

  try {
    const [project] = await db
      .insert(projects)
      .values({
        title: data.title,
        description: data.description,
        deadline: new Date(data.deadline),
        clientId: sessionUser.userId,
        createdBy: sessionUser.userId,
      })
      .returning();
    return NextResponse.json({ project });
  } catch (err) {
    console.error('Error creating project:', err);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
