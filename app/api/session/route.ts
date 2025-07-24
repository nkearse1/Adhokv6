export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';
import { loadUserSession } from '@/lib/server/loadUserSession';

export async function GET(req: NextRequest) {
  const searchParams = new URL(req.url).searchParams;
  const id = searchParams.get('id') || req.headers.get('x-user-id') || undefined;
  const user = await loadUserSession(id || undefined);
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user });
}
