// Server-only utility to fetch test users from the database
import { db } from '../lib/db';
import { users } from '../lib/schema';
import { eq } from 'drizzle-orm/pg-core';

// Login is mocked, but these users are real records from the Neon database
// so downstream hooks should treat them as authenticated users

export type TestRole = 'admin' | 'client' | 'talent';

export async function getTestUser(role: TestRole) {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.userRole, role))
      .limit(1);
    return result[0] || null;
  } catch (err) {
    console.error('getTestUser error', err);
    return null;
  }
}
