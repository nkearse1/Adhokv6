import { NextResponse, type NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { resolveUserId } from '@/lib/server/loadUserSession';

function safeRedirect(path: string, req: NextRequest) {
  const url = new URL(path, req.url);
  if (req.nextUrl.pathname === url.pathname) {
    return NextResponse.next();
  }
  return NextResponse.redirect(url);
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const userId = await resolveUserId();

  let role: string | undefined;
  if (userId) {
    try {
      const { db } = await import('@/db');
      const { users } = await import('@/db/schema');
      const result = await db
        .select({ user_role: users.user_role })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      role = result[0]?.user_role;
    } catch (err) {
      console.error('[middleware] role lookup failed', err);
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[middleware]', { userId, role, pathname });
    return NextResponse.next();
  }

  if (!userId || !role) return NextResponse.next();

  const validRoles = ['admin', 'client', 'talent'];
  if (!validRoles.includes(role)) return NextResponse.next();

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return safeRedirect('/', req);
  }

  if (pathname.startsWith('/client') && role !== 'client') {
    return safeRedirect('/', req);
  }

  if (pathname.startsWith('/talent/dashboard') && role !== 'talent') {
    return safeRedirect('/', req);
  }

  return NextResponse.next();
}

export default middleware;

export const config = {
  matcher: ['/((?!_next|.*\\..*|favicon.ico).*)', '/(api|trpc)(.*)'],
};
