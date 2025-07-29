export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';
import { loadUserSession } from '@/lib/server/loadUserSession';

export async function GET(req: NextRequest) {
  const user = await loadUserSession(req);
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user });
}
