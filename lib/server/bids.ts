'use server';

import { db } from '@/lib/db';
import { projectBids, projects } from '@/lib/schema';
import { eq, and, ne } from 'drizzle-orm';
import { notifyBidAccepted } from '@/lib/server/notifications';

// Re-export feature gates from the single source of truth
export { hasAcceptBidForProject, hasFeatureForClient } from '@/lib/featureFlags';

export async function acceptBid(
  { bidId, clientId }: { bidId: string; clientId: string },
): Promise<void> {
  await db.transaction(async (tx) => {
    const bidRes = await tx
      .select()
      .from(projectBids)
      .where(eq(projectBids.id, bidId))
      .limit(1);

    if (bidRes.length === 0) {
      throw new Error('Bid not found');
    }
    const bid = bidRes[0];

    const projectRes = await tx
      .select()
      .from(projects)
      .where(eq(projects.id, bid.projectId))
      .limit(1);

    if (projectRes.length === 0) {
      throw new Error('Project not found');
    }
    const project = projectRes[0];

    if (project.clientId !== clientId) {
      throw new Error('Forbidden');
    }

    await tx
      .update(projects)
      .set({
        status: 'awarded',
        talentId: bid.professionalId,
        metadata: { ...((project as any).metadata ?? {}), bidId },
      })
      .where(eq(projects.id, project.id));

    await tx
      .update(projectBids)
      .set({ status: 'accepted' })
      .where(eq(projectBids.id, bidId));

    await tx
      .update(projectBids)
      .set({ status: 'outbid' })
      .where(and(eq(projectBids.projectId, project.id), ne(projectBids.id, bidId)));

    await notifyBidAccepted(
      {
        projectId: project.id,
        bidId,
        talentId: bid.professionalId,
        clientId: project.clientId!,
      },
      tx,
    );
  });
}
