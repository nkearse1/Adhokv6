import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { headers } from 'next/headers';

/**
 * Resolve the current user ID. The optional override always wins.
 * When running in the browser we read `adhok_active_user` from localStorage
 * so developers can easily switch between seeded users. On the server we
 * rely solely on runtime overrides or the production auth provider.
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
      const hdrs = await headers();
      override = hdrs.get('adhok_active_user') || undefined;
      if (!override && process.env.NODE_ENV === 'development') {
        console.warn('[resolveUserId] no override header in dev');
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[resolveUserId] cannot read headers()', err);
      }
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[resolveUserId] override:', override);
  }
  if (override) return override;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adhok_active_user') || undefined;
  }
  if (process.env.NODE_ENV === 'production' && process.env.CLERK_SECRET_KEY) {
    try {
      const { auth } = await import('@clerk/nextjs/server');
      const { userId } = await auth();
      if (userId) return userId;
    } catch {
      // ignore
    }
  }
  if (process.env.NODE_ENV === 'development') {
    console.warn('[resolveUserId] no user ID resolved');
  }
  return undefined;
}

export async function loadUserSession(
  overrideOrReq?: string | Request | NextRequest
) {
  // Debug marker to confirm this version is running
  console.warn('🎉 patched loadUserSession loaded');

  const fallback = () => {
    console.warn('🔄 loadUserSession fallback');
    return { userId: null, user_role: null } as const;
  };

  // Never run server logic on the client
  if (typeof window !== 'undefined') {
    console.warn('[loadUserSession] called on client');
    return null;
  }

  const override = await resolveUserId(overrideOrReq);
  console.log('[loadUserSession] override ID:', override);
  if (!override) {
    console.warn('[loadUserSession] no override — using fallback');
    return fallback();
  }

  try {
    const { db } = await import('@/lib/db');
    const { users, clientProfiles } = await import('@/lib/schema');

    // Drizzle returns an array; get first row explicitly
    const rows = await db
      .select({
        id: users.id,
        username: users.username,
        full_name: users.full_name,
        email: users.email,
        user_role: users.user_role,
      })
      .from(users)
      .where(eq(users.id, override))
      .limit(1);

    console.log('[loadUserSession] DB rows:', rows);
    const [rawUser] = rows;
    if (!rawUser) {
      console.warn(`[loadUserSession] no user found for ID ${override}`);
      return fallback();
    }

    // Safely build user object and guard against missing metadata
    const user = { ...(rawUser as any), metadata: (rawUser as any).metadata ?? {} };
    console.log('[loadUserSession] user record:', user);

    // Check client profile existence
    const profileRows = await db
      .select({ id: clientProfiles.id })
      .from(clientProfiles)
      .where(eq(clientProfiles.id, override))
      .limit(1);

    const isClient = profileRows.length > 0;
    const session = { ...user, isClient };
    console.log('[loadUserSession] session:', session);
    return session;
  } catch (err) {
    console.error('[loadUserSession] db error:', err);
    return fallback();
  }
}
