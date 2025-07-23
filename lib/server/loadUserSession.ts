import { eq } from 'drizzle-orm';

/**
 * Resolve the current user ID. In the browser we honour the
 * `adhok_active_user` value from localStorage so developers can easily
 * switch between seeded users. On the server we fall back to Clerk when
 * available. If no Clerk session is present we use the
 * `NEXT_PUBLIC_SELECTED_USER_ID` environment variable so local development
 * works without authentication.
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

  return process.env.NEXT_PUBLIC_SELECTED_USER_ID;
}

export async function loadUserSession() {
  if (typeof window !== 'undefined') {
    throw new Error('loadUserSession must run on the server');
  }

  const { db } = await import('@/db');
  const { users } = await import('@/db/schema');
  const id = await resolveUserId();
  if (!id) throw new Error('No user ID available to load session');

  const result = await db.select().from(users).where(eq(users.id, id));
  const user = result?.[0];

  if (!user) throw new Error(`User ${id} not found in Neon`);
  return user;
}
