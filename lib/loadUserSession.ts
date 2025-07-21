import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const SELECTED_USER_ID = process.env.NEXT_PUBLIC_SELECTED_USER_ID;

export async function loadUserSession() {
  if (!SELECTED_USER_ID) throw new Error('NEXT_PUBLIC_SELECTED_USER_ID is not defined');

  const result = await db.select().from(users).where(eq(users.id, SELECTED_USER_ID));
  const user = result?.[0];

  if (!user) throw new Error(`User ${SELECTED_USER_ID} not found in Neon`);
  return user;
}
