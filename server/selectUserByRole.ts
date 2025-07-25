import { db } from '../lib/db';
import { users } from '../lib/schema';
import { eq } from 'drizzle-orm';

export type TestRole = 'admin' | 'client' | 'talent';

export async function selectUserByRole(role: TestRole) {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.user_role, role))
      .limit(1);
    return result[0] || null;
  } catch (err) {
    console.error('selectUserByRole error', err);
    return null;
  }
}
