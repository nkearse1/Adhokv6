import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { talentProfiles } from '@/lib/schema';

export async function getTalentById(id: string) {
  const result = await db.select().from(talentProfiles).where(eq(talentProfiles.id, id)).limit(1);
  return result[0] || null;
}

export async function updateTalentTrustScore(id: string) {
  // Example logic: increment trust score
  const result = await db
    .update(talentProfiles)
    .set({ trustScore: Math.floor(Math.random() * 100), trustScoreUpdatedAt: new Date() })
    .where(eq(talentProfiles.id, id))
    .returning();
  return result[0];
}

export async function flagTalent(id: string, reason: string) {
  // Log or flag logic placeholder
  return { flagged: true, reason };
}

export async function qualifyTalent(id: string, qualified: boolean) {
  const result = await db
    .update(talentProfiles)
    .set({
      isQualified: qualified,
      qualificationReason: 'manual',
      qualificationHistory: [{ reason: 'manual', timestamp: new Date().toISOString() }]
    })
    .where(eq(talentProfiles.id, id))
    .returning();
  return result[0];
}
