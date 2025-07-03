import { db } from '@/lib/db';
import { talentProfiles, projects } from '@/lib/schema';

export async function getAdminStats() {
  const [talents, projectsData] = await Promise.all([
    db.select().from(talentProfiles),
    db.select().from(projects)
  ]);
  return {
    talentCount: talents.length,
    projectCount: projectsData.length,
    qualifiedTalent: talents.filter(t => t.is_qualified).length
  };
}

export async function recalculateAllTrustScores() {
  // Placeholder logic
  return { updated: 10 };
}
