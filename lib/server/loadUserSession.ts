import { eq } from 'drizzle-orm';

/**
 * Resolve the current user ID. In the browser we honour the
 * `adhok_active_user` value from localStorage so developers can easily
 * switch between seeded users. On the server we fall back to Clerk only in
 * production. If no Clerk session is present we use the
 * `NEXT_PUBLIC_SELECTED_USER_ID` environment variable as a fallback.
 */

 
export async function resolveUserId(override?: string): Promise<string | undefined> {
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
      // ignore and fall back to env based mock id
    }
  }

  if (process.env.NEXT_PUBLIC_SELECTED_USER_ID) {
    return process.env.NEXT_PUBLIC_SELECTED_USER_ID;
  }

  console.warn('[resolveUserId] No user ID could be resolved');
  return undefined;
}

export async function loadUserSession(overrideId?: string) {
  if (typeof window !== 'undefined') {
    console.warn('[loadUserSession] Called on the client - returning null');
    return null;
  }

  const id = await resolveUserId(overrideId);
  if (!id) {
    console.warn('[loadUserSession] Unable to resolve user ID');
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
