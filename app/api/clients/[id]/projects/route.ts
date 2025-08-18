import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { projects, clientProfiles } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { loadUserSession } from '@/lib/loadUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const url = new URL(req.url);
  const clientId = url.searchParams.get('override') ?? params.id;

  try {
    const data = await db.select().from(projects).where(eq(projects.clientId, clientId));
    return NextResponse.json({ projects: data });
  } catch (error) {
    console.error('Error fetching client projects:', error);
    return NextResponse.json({ error: 'Failed to fetch client projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const sessionUser = await loadUserSession();
  if (
    !sessionUser ||
    (sessionUser.userRole !== 'client' && sessionUser.userRole !== 'talent')
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (sessionUser.userId !== params.id) {
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
