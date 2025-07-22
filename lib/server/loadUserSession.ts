import { eq } from 'drizzle-orm';

export function resolveUserId(): string | undefined {
  if (typeof window !== 'undefined') {
    return (
      localStorage.getItem('adhok_active_user') ||
      process.env.NEXT_PUBLIC_SELECTED_USER_ID
    );
  }
  return process.env.NEXT_PUBLIC_SELECTED_USER_ID;
}

export async function loadUserSession() {
  if (typeof window !== 'undefined') {
    throw new Error('loadUserSession must run on the server');
  }

  const { db } = await import('@/db');
  const { users } = await import('@/db/schema');
  const id = resolveUserId();
  if (!id) throw new Error('No user ID available to load session');

  const result = await db.select().from(users).where(eq(users.id, id));
  const user = result?.[0];

  if (!user) throw new Error(`User ${id} not found in Neon`);
  return user;
}
