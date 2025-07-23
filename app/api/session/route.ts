export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { loadUserSession } from '@/lib/server/loadUserSession';

export async function GET() {
  const user = await loadUserSession();
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user });
}
