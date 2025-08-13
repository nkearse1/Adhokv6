import { db } from '@/lib/db';
import { projectBids, projects, notifications } from '@/lib/schema';
import { eq, and, ne } from 'drizzle-orm';

export async function hasAcceptBidForProject(
  { bidId, clientId }: { bidId: string; clientId: string },
): Promise<boolean> {
  const bidRows = await db
    .select({ projectId: projectBids.projectId })
    .from(projectBids)
    .where(eq(projectBids.id, bidId))
    .limit(1);
  if (bidRows.length === 0) return false;

  const projectRows = await db
    .select({ clientId: projects.clientId, status: projects.status })
    .from(projects)
    .where(eq(projects.id, bidRows[0].projectId))
    .limit(1);
  if (projectRows.length === 0) return false;

  return projectRows[0].clientId === clientId && projectRows[0].status !== 'awarded';
}

export async function hasFeatureForClient(
  clientId: string,
  _feature = 'accept-bid',
): Promise<boolean> {
  // Placeholder for feature flag check
  return !!clientId;
}

export async function acceptBid(
  { bidId, clientId }: { bidId: string; clientId: string },
): Promise<void> {
  await db.transaction(async (tx: typeof db) => {
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
        metadata: { ...(project.metadata as any || {}), bidId },
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

    await tx.insert(notifications).values([
      {
        userId: project.clientId!,
        title: 'Bid accepted',
        message: `You accepted a bid for project ${project.title ?? ''}`,
        type: 'bid.accepted',
        metadata: { projectId: project.id, bidId },
      },
      {
        userId: bid.professionalId,
        title: 'Bid accepted',
        message: `Your bid for project ${project.title ?? ''} was accepted`,
        type: 'bid.accepted',
        metadata: { projectId: project.id, bidId },
      },
    ]);
  });
}
