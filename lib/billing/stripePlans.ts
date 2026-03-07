export const STRIPE_PRICE_TO_TIER: Record<string, string> = {
  [process.env.STRIPE_PRICE_ACCEPT_BID || '']: 'accept-bid',
  // Add additional price IDs to tier mappings as needed
};

export function getTierForPrice(priceId: string | null | undefined): string | undefined {
  if (!priceId) return undefined;
  return STRIPE_PRICE_TO_TIER[priceId];
}
