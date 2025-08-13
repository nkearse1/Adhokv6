import { db } from '@/lib/db';
import { notifications } from '@/lib/schema';

interface BidAcceptedParams {
  projectId: string;
  bidId: string;
  talentId: string;
  clientId: string;
}

/**
 * Persist a notification when a bid is accepted.
 * This writes directly to the notifications table so it can be surfaced to
 * the notified user or picked up by a mock queue in tests.
 */
export async function notifyBidAccepted({
  projectId,
  bidId,
  talentId,
  clientId,
}: BidAcceptedParams) {
  await db.insert(notifications).values({
    userId: talentId,
    title: 'Bid accepted',
    message: `Your bid on project ${projectId} was accepted`,
    type: 'bid_accepted',
    metadata: { projectId, bidId, talentId, clientId },
  });
}

export type { BidAcceptedParams };
