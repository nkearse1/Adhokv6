export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { loadUserSession } from '@/lib/server/loadUserSession';

export async function GET() {
  try {
    const user = await loadUserSession();
    return NextResponse.json({ user });
  } catch (err) {
    console.error('session error', err);
    return NextResponse.json({ error: 'No session' }, { status: 404 });
  }
}
