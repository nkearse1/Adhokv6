import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { headers as nextHeaders } from 'next/headers';

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
  } else {
    try {
      const headerList = await nextHeaders();
      override = headerList.get('adhok_active_user') || undefined;
      if (!override && process.env.NODE_ENV === 'development') {
        console.warn('[resolveUserId] headers missing adhok_active_user');
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[resolveUserId] unable to read headers()', err);
      }
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[resolveUserId] override', override);
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
  if (process.env.NODE_ENV === 'development') {
    console.log('[loadUserSession] resolved id', id);
  }
  if (!id) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[loadUserSession] Unable to resolve user ID');
    }
    return null;
  }

  try {
    const { db } = await import('@/lib/db');
    const { users, clientProfiles } = await import('@/lib/schema');
    const result = await db
      .select({
        id: users.id,
        username: users.username,
        full_name: users.full_name,
        email: users.email,
        user_role: users.user_role,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    const user = result[0];
    if (!user) return null;
    const hasProfile = await db
      .select({ id: clientProfiles.id })
      .from(clientProfiles)
      .where(eq(clientProfiles.id, id))
      .limit(1);
    const session = { ...user, isClient: hasProfile.length > 0 };
    if (process.env.NODE_ENV === 'development') {
      console.log('[loadUserSession] session', session);
    }
    return session;
  } catch (err) {
    console.error('loadUserSession db error', err);
    return null;
  }
}
