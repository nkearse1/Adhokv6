import { db } from '../db';
import { users } from '../schema';
import { eq } from 'drizzle-orm';

export type User = typeof users.$inferSelect;

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  const result = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return result[0] || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] || null;
}
