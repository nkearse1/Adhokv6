import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { projects } from '@/lib/schema';

export async function GET(_req: NextRequest) {
  try {
    const rows = await db.select().from(projects).limit(100);
    console.log('[GET /api/projects] fetched', rows.length, 'projects from Neon');
    if (rows.length === 0) {
      console.warn('[GET /api/projects] no projects found');
    }
    return NextResponse.json({ projects: rows });
  } catch (error) {
    console.error('[GET /api/projects] database error', error);
    return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 });
  }
}
