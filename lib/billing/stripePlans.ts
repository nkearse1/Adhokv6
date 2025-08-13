import { db } from '@/lib/db';
import { clientTiers, type ClientTier } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import env from '@/env.mjs';

// Map Stripe price IDs to client_tiers IDs
const PRICE_TO_TIER: Record<string, number> = {
  [env.STRIPE_PRICE_ACCEPT_BID]: 1,
};

export async function getTierByStripePriceId(
  priceId: string,
): Promise<ClientTier> {
  const tierId = PRICE_TO_TIER[priceId];
  if (!tierId) {
    throw new Error(`Unknown Stripe price ID: ${priceId}`);
  }

  const [tier] = await db
    .select()
    .from(clientTiers)
    .where(eq(clientTiers.id, tierId));

  if (!tier) {
    throw new Error(`Tier not found for ID: ${tierId}`);
  }

  return tier;
}
