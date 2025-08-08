export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { loadUserSession } from '@/lib/loadUserSession';

export async function GET() {
  try {
    const user = await loadUserSession();
    return NextResponse.json({ user, isAuthenticated: !!user });
  } catch (err) {
    console.error('[api/session] failed to load session', err);
    return NextResponse.json({ user: null, isAuthenticated: false });
  }
}
