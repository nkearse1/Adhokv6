export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { loadUserSession } from '@/lib/server/loadUserSession';

export async function GET(req: NextRequest) {
  const hdrs = await headers();
  const headerId = hdrs.get('adhok_active_user');
  const queryId = new URL(req.url).searchParams.get('adhok_active_user');
  const override = headerId || queryId || undefined;
  if (process.env.NODE_ENV === 'development' && !headerId) {
    console.warn('[api/session] adhok_active_user header missing');
  }
  console.log('[api/session] incoming', { headerId, queryId, override });
  try {
    const user = await loadUserSession(override);

    if (
      !user ||
      Object.keys(user).length === 0 ||
      ('userId' in user && (user.userId === null || user.userId === undefined))
    ) {
      if (override) {
        console.warn('[api/session] no user found for override', override);
      } else {
        console.warn('[api/session] no user resolved - returning guest session');
      }

      return NextResponse.json({ user: null, isAuthenticated: false });
    }

    return NextResponse.json({ user, isAuthenticated: true });
  } catch (err) {
    console.error('[api/session] failed to load session', err);
    return NextResponse.json({ user: null, isAuthenticated: false });
  }
}
