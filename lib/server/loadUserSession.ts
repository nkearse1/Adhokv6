import { eq } from 'drizzle-orm';

/**
 * Resolve the current user ID. In the browser we honour the
 * `adhok_active_user` value from localStorage so developers can easily
 * switch between seeded users. On the server we fall back to Clerk when
 * available. No environment variable based fallback is used so behaviour
 * matches production as closely as possible.
 */
export async function resolveUserId(): Promise<string | undefined> {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adhok_active_user') || undefined;
  }

  if (process.env.CLERK_SECRET_KEY) {
    try {
      const { auth } = await import('@clerk/nextjs/server');
      const { userId } = await auth();
      return userId || undefined;
    } catch {
      return undefined;
    }
  }

  return undefined;
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
