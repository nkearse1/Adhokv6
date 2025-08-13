import { db } from '@/lib/db';
import { projectBids, projects } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { notifyBidAccepted } from './notifications';

interface AcceptBidParams {
  projectId: string;
  bidId: string;
  talentId: string;
  clientId: string;
}

/**
 * Accept a bid for a project and notify the winning talent.
 */
export async function acceptBid({
  projectId,
  bidId,
  talentId,
  clientId,
}: AcceptBidParams) {
  return db.transaction(async tx => {
    await tx
      .update(projectBids)
      .set({ status: 'accepted', updatedAt: new Date() })
      .where(eq(projectBids.id, bidId));

    await tx
      .update(projects)
      .set({ status: 'in_progress', talentId, updatedAt: new Date() })
      .where(eq(projects.id, projectId));

    await notifyBidAccepted({ projectId, bidId, talentId, clientId });
  });
}

export type { AcceptBidParams };
