import { db } from '@/lib/db';
import { notifications } from '@/lib/schema';

interface BidAcceptedArgs {
  projectId: string;
  bidId: string;
  talentId: string;
  clientId: string;
}

export async function notifyBidAccepted(
  { projectId, bidId, talentId, clientId }: BidAcceptedArgs,
  dbOrTx: typeof db = db,
): Promise<void> {
  await dbOrTx.insert(notifications).values([
    {
      userId: clientId,
      title: 'Bid accepted',
      message: `You accepted a bid for project ${projectId}`,
      type: 'bid.accepted',
      metadata: { projectId, bidId },
    },
    {
      userId: talentId,
      title: 'Bid accepted',
      message: `Your bid for project ${projectId} was accepted`,
      type: 'bid.accepted',
      metadata: { projectId, bidId },
    },
  ]);
}

