import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const override = new URL(req.url).searchParams.get('override');
  const res = NextResponse.next();
  if (override) {
    res.headers.set('x-override-user-id', override);
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next|.*\\..*|favicon.ico).*)'],
};
