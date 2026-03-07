import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { projects } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(_req: NextRequest) {
  try {
    const rows = await db
      .select({
        id: projects.id,
        title: projects.title,
        description: projects.description,
        deadline: projects.deadline,
        status: projects.status,
        minimumBadge: projects.minimumBadge,
        projectBudget: projects.projectBudget,
        metadata: projects.metadata,
      })
      .from(projects)
      .where(eq(projects.status, 'open'))
      .limit(100);

    const projectsData = rows.map((row: any) => ({
      ...row,
      metadata: { marketing: (row.metadata as any)?.marketing ?? {} },
    }));

    if (process.env.NEXT_PUBLIC_DEBUG_DB === '1') {
      console.log('[GET /api/projects] fetched', projectsData.length, 'open projects');
    }
    return NextResponse.json({ projects: projectsData });
  } catch (error) {
    if (process.env.NEXT_PUBLIC_DEBUG_DB === '1') {
      console.error('[GET /api/projects] database error', error);
    }
    return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 });
  }
}
