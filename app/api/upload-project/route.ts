import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users, clientProfiles, projects } from '@/lib/schema';

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { title, description, clientName, company, email, deadline } = body || {};
  if (!title || !description || !email || !deadline) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const [user] = await db
      .insert(users)
      .values({
        fullName: clientName || '',
        email,
        username: email,
        userRole: 'client',
      })
      .returning({ id: users.id });

    await db.insert(clientProfiles).values({
      id: user.id,
      email,
      companyName: company || null,
    });

    const [project] = await db
      .insert(projects)
      .values({
        title,
        description,
        deadline: new Date(deadline),
        clientId: user.id,
        createdBy: user.id,
      })
      .returning();

    return NextResponse.json({ userId: user.id, project });
  } catch (err) {
    console.error('upload-project error', err);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
