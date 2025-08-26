'use server';

import { db } from '@/lib/db';
import { projectBids, projects } from '@/lib/schema';
import { eq, and, ne } from 'drizzle-orm';
import { notifyBidAccepted } from '@/lib/server/notifications';
import { hasFeatureForClient } from '@/lib/featureFlags';
import type * as schema from '@/lib/schema';
import type { NeonTransaction } from 'drizzle-orm/neon-http/session';
export { hasFeatureForClient };

export type AcceptBidInput = { bidId: string; clientId: string };
export type Tx = NeonTransaction<typeof schema, typeof schema>;

export async function hasAcceptBidForProject(
  input: AcceptBidInput,
): Promise<boolean> {
  const bidRows = await db
    .select({ projectId: projectBids.projectId })
    .from(projectBids)
    .where(eq(projectBids.id, input.bidId))
    .limit(1);
  const bid = bidRows[0];
  if (!bid) return false;

  const projectRows = await db
    .select({ clientId: projects.clientId, metadata: projects.metadata })
    .from(projects)
    .where(eq(projects.id, bid.projectId))
    .limit(1);
  const project = projectRows[0] as any;
  if (!project || project.clientId !== input.clientId) return false;
  if (project.metadata?.acceptBidEnabled) return true;
  return hasFeatureForClient(input.clientId, 'accept-bid');
}

export async function acceptBid(tx: Tx, { bidId, clientId }: AcceptBidInput): Promise<void> {
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
}
