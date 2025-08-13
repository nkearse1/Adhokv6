import type { ClientTierFeatures } from '@/types/billing';

// Placeholder implementation. Replace with real billing/feature logic.
export async function clientHasFeature(
  _clientId: string,
  _feature: keyof ClientTierFeatures,
): Promise<boolean> {
  return false;
}

export async function assertFeatureForClient(
  clientId: string,
  feature: keyof ClientTierFeatures,
): Promise<void> {
  const hasFeature = await clientHasFeature(clientId, feature);
  if (!hasFeature) {
    throw new Error(`Client ${clientId} lacks feature ${feature}`);
  }
}
