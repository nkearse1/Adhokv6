import { eq } from 'drizzle-orm/pg-core';
import { db } from '../db';
import { talentProfiles } from '../schema';
export type TalentProfile = typeof talentProfiles.$inferSelect;

export async function getTalentProfileById(id: string): Promise<TalentProfile | null> {
  const result = await db
    .select()
    .from(talentProfiles)
    .where(eq(talentProfiles.id, id))
    .limit(1);
  return result[0] || null;
}

export async function updateTalentProfile(
  id: string,
  data: Partial<TalentProfile>,
): Promise<TalentProfile | null> {
  const result = await db
    .update(talentProfiles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(talentProfiles.id, id))
    .returning();
  return result[0] || null;
}
