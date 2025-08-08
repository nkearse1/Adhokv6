import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const qsOverride = url.searchParams.get('override');
  const cookieOverride = req.cookies.get('adhok_override')?.value ?? undefined;

  const effective = (qsOverride ?? cookieOverride)?.trim() || undefined;

  const headers = new Headers(req.headers);
  if (effective) {
    headers.set('x-override-user-id', effective);
  } else {
    headers.delete('x-override-user-id');
  }

  const res = NextResponse.next({ request: { headers } });

  // Persist override as a client-readable cookie so a full reload keeps it
  if (qsOverride !== null) {
    if (effective) {
      res.cookies.set('adhok_override', effective, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
      });
    } else {
      res.cookies.delete('adhok_override');
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next|.*\\..*|favicon.ico).*)'],
};
