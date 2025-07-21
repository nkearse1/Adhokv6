import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

let cachedUserId: string | undefined;

function resolveUserId(): string | undefined {
  if (typeof window !== 'undefined') {
    const fromLocalStorage = localStorage.getItem('adhok_active_user');
    if (fromLocalStorage) {
      cachedUserId = fromLocalStorage;
      return fromLocalStorage;
    }
  }
  return cachedUserId ?? process.env.NEXT_PUBLIC_SELECTED_USER_ID;
}

export async function loadUserSession() {
  const id = resolveUserId();
  if (!id) throw new Error('No user ID available to load session');

  const result = await db.select().from(users).where(eq(users.id, id));
  const user = result?.[0];

  if (!user) throw new Error(`User ${id} not found in Neon`);
  return user;
}
