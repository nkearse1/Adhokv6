import { db } from './db';
import { users } from './schema';
import { eq } from 'drizzle-orm/pg-core';

export type MockRole = 'admin' | 'client' | 'talent';

export async function getMockUser(role: MockRole) {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.userRole, role))
      .limit(1);
    return result[0] || null;
  } catch (err) {
    console.error('getMockUser error', err);
    return null;
  }
}
