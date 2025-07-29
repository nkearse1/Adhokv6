import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';

/**
 * Resolve the current user ID. The optional override always wins.
 * When running in the browser we read `adhok_active_user` from localStorage
 * so developers can easily switch between seeded users. On the server we
 * rely solely on runtime overrides or the production auth provider (Clerk
 * when configured).
 */

 
export async function resolveUserId(
  overrideOrReq?: string | Request | NextRequest
): Promise<string | undefined> {
  let override: string | undefined;
  if (typeof overrideOrReq === 'string') {
    override = overrideOrReq;
  } else if (overrideOrReq && 'headers' in overrideOrReq) {
    const headerVal = overrideOrReq.headers.get('adhok_active_user');
    const queryVal = new URL(overrideOrReq.url).searchParams.get('adhok_active_user');
    override = headerVal || queryVal || undefined;
  }

  if (override) return override;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adhok_active_user') || undefined;
  }

  if (
    process.env.NODE_ENV === 'production' &&
    process.env.CLERK_SECRET_KEY
  ) {
    try {
      const { auth } = await import('@clerk/nextjs/server');
      const { userId } = await auth();
      if (userId) return userId;
    } catch {
      // ignore and fall through
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn('[resolveUserId] No user ID could be resolved');
  }
  return undefined;
}

export async function loadUserSession(
  overrideOrReq?: string | Request | NextRequest
) {
  if (typeof window !== 'undefined') {
    console.warn('[loadUserSession] Called on the client - returning null');
    return null;
  }

  const id = await resolveUserId(overrideOrReq);
  if (!id) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[loadUserSession] Unable to resolve user ID');
    }
    return null;
  }

  try {
    const { db } = await import('@/db');
    const { users } = await import('@/db/schema');
    const result = await db
      .select({
        id: users.id,
        username: users.username,
        full_name: users.full_name,
        user_role: users.user_role,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    const user = result[0];
    return user || null;
  } catch (err) {
    console.error('loadUserSession db error', err);
    return null;
  }
}
