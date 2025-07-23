import { eq } from 'drizzle-orm';

/**
 * Resolve the current user ID. In the browser we honour the
 * `adhok_active_user` value from localStorage so developers can easily
 * switch between seeded users. On the server we fall back to Clerk when
 * available. If no Clerk session is present we use the
 * `NEXT_PUBLIC_SELECTED_USER_ID` environment variable in development so
 * local development works without authentication.
 */
export async function resolveUserId(): Promise<string | undefined> {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adhok_active_user') || undefined;
  }

  if (process.env.CLERK_SECRET_KEY) {
    try {
      const { auth } = await import('@clerk/nextjs/server');
      const { userId } = await auth();
      if (userId) return userId;
    } catch {
      // ignore and fall back to env based mock id
    }
  }

  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_SELECTED_USER_ID;
  }

  console.warn('[resolveUserId] No user ID could be resolved');
  return undefined;
}

export async function loadUserSession() {
  if (typeof window !== 'undefined') {
    throw new Error('loadUserSession must run on the server');
  }

  const id = await resolveUserId();
  if (!id) {
    console.warn('[loadUserSession] Unable to resolve user ID');
    return null;
  }

  const { db } = await import('@/db');
  const { users } = await import('@/db/schema');
  const result = await db.select().from(users).where(eq(users.id, id));
  const user = result?.[0];

  return user || null;
}
