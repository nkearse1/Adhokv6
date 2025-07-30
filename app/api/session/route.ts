export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';
import { loadUserSession } from '@/lib/server/loadUserSession';

export async function GET(req: NextRequest) {
  const headerId = req.headers.get('adhok_active_user');
  const queryId = new URL(req.url).searchParams.get('adhok_active_user');
  const override = headerId || queryId || undefined;
  const user = await loadUserSession(override);
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user });
}
