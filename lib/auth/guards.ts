import { db } from '@/lib/db';
import { projects } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { hasFeatureForClient } from '@/lib/server/bids';
import type { ClientTierFeatures } from '@/types/billing';

export async function assertClientProjectOwner(
  userId: string,
  projectId: string,
): Promise<void> {
  const rows = await db
    .select({ clientId: projects.clientId })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (rows.length === 0 || rows[0].clientId !== userId) {
    throw new Error('Forbidden');
  }
}

export async function assertFeatureForClient(
  clientId: string,
  feature: keyof ClientTierFeatures,
): Promise<void> {
  const hasFeature = await hasFeatureForClient(clientId, feature);
  if (!hasFeature) {
    throw new Error('Forbidden');
  }
}
