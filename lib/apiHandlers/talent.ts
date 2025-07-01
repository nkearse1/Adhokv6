import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { talent_profiles } from '@/lib/schema';

export async function getTalentById(id: string) {
  const result = await db.select().from(talent_profiles).where(eq(talent_profiles.id, id)).limit(1);
  return result[0] || null;
}

export async function updateTalentTrustScore(id: string) {
  // Example logic: increment trust score
  const result = await db
    .update(talent_profiles)
    .set({ trust_score: Math.floor(Math.random() * 100), trust_score_updated_at: new Date().toISOString() })
    .where(eq(talent_profiles.id, id))
    .returning();
  return result[0];
}

export async function flagTalent(id: string, reason: string) {
  // Log or flag logic placeholder
  return { flagged: true, reason };
}

export async function qualifyTalent(id: string, qualified: boolean) {
  const result = await db
    .update(talent_profiles)
    .set({
      is_qualified: qualified,
      qualification_reason: 'manual',
      qualification_history: JSON.stringify([{ reason: 'manual', timestamp: new Date().toISOString() }])
    })
    .where(eq(talent_profiles.id, id))
    .returning();
  return result[0];
}
