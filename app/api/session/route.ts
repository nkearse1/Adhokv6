export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';
import { loadUserSession } from '@/lib/server/loadUserSession';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const queryId = searchParams.get('userId');
  const override = req.headers.get('x-adhok-user-id') || queryId || undefined;
  const user = await loadUserSession(override);
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user });
}
