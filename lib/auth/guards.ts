import { db } from '@/db';
import { projects } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { assertFeatureForClient as billingAssertFeatureForClient } from '@/lib/billing/features';

export async function assertClientProjectOwner(
  userId: string,
  projectId: string,
): Promise<void> {
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    columns: { clientId: true },
  });

  if (!project || project.clientId !== userId) {
    throw new Error('Unauthorized');
  }
}

export function assertFeatureForClient(
  clientId: string,
  feature: 'accept_bid',
): Promise<void> {
  return billingAssertFeatureForClient(clientId, feature);
}
