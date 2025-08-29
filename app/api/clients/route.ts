// app/api/clients/[id]/projects/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

function inMockMode() {
  // mock when explicit, or when no public Clerk key is configured
  return (
    process.env.NEXT_PUBLIC_USE_MOCK === 'true' ||
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  );
}

export async function GET(
  req: NextRequest,
  ctx: { params: { id?: string } }
) {
  try {
    const url = req.nextUrl;

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

    // If not mocking, touch Clerk inside handler only (avoid build/runtime issues)
    if (!inMockMode()) {
      try {
        const { auth } = await import('@clerk/nextjs/server');
        auth(); // ensure a valid request context if Clerk is enabled
      } catch {
        // ignore; keep response JSON-only
      }
    }

    // Query Neon (raw SQL so we don't depend on schema field casing)
    let rows: any[] = [];
    const r1 = await db.execute(
      sql`select * from projects where client_id = ${clientId} order by created_at desc limit 200`
    );
    rows = (r1?.rows as any[]) ?? [];

    // Fallback: some historical data may use owner_id instead of client_id
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
