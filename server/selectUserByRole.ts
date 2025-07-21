import { db } from '../lib/db';
import { users } from '../lib/schema';
import { eq } from 'drizzle-orm/pg-core';

export type UserRole = 'admin' | 'client' | 'talent';

export async function selectUserByRole(role: UserRole) {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.userRole, role))
      .limit(1);
    return result[0] || null;
  } catch (err) {
    console.error('selectUserByRole error', err);
    return null;
  }
}
