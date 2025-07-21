import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function selectUserByRole(role: string) {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.user_role, role));
    return result?.[0] ?? null;
  } catch (error) {
    console.error('Error selecting user by role:', error);
    return null;
  }
}

export async function getTalentById(id: string) {
  return db.query.users.findFirst({
    where: eq(users.id, id)
  });
}

export async function updateTalentProfile(id: string, data: Partial<typeof users.$inferSelect>) {
  return db.update(users)
    .set(data)
    .where(eq(users.id, id));
}
