// app/api/clients/[id]/projects/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

function inMockMode() {
  // mock when explicit, or when no Clerk publishable key
  return process.env.NEXT_PUBLIC_USE_MOCK === 'true' || !process.env.CLERK_PUBLISHABLE_KEY;
}

export async function GET(
  req: NextRequest,
  ctx: { params: { id?: string } },
) {
  try {
    const url = new URL(req.url);

    // Preferred source is the dynamic segment, but support query/override too
    const pathId = ctx?.params?.id;
    const queryId = url.searchParams.get('id') ?? undefined;
    const override =
      req.headers.get('x-override-user-id') ??
      url.searchParams.get('override') ??
      undefined;

    const clientId = pathId || queryId || override;

    // If we still don't have an id, return empty array (always JSON)
    if (!clientId) {
      return NextResponse.json({ projects: [] }, { status: 200 });
    }

    // If not mocking, touch Clerk inside handler only (don’t throw on dev)
    if (!inMockMode()) {
      try {
        const { auth } = await import('@clerk/nextjs/server');
        auth();
      } catch {
        /* ignore; keep response JSON-only */
      }
    }

    // Query Neon (Drizzle raw SQL avoids guessing schema field names)
    // Try client_id first; if empty, also try owner_id as a fallback
    let rows: any[] = [];
    const r1 = await db.execute(
      sql`select * from projects where client_id = ${clientId} order by created_at desc limit 200`
    );
    rows = (r1?.rows as any[]) ?? [];

    if (rows.length === 0) {
      const r2 = await db.execute(
        sql`select * from projects where owner_id = ${clientId} order by created_at desc limit 200`
      );
      rows = (r2?.rows as any[]) ?? [];
    }

    return NextResponse.json({ projects: rows }, { status: 200 });
  } catch (err) {
    console.error('[api/clients/[id]/projects] error', err);
    // Still JSON on error → prevents "Unexpected end of JSON input" on client
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
