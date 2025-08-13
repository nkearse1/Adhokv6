export interface ClientTierFeatures {
  accept_bid: boolean;
}

export interface ClientTier {
  features: ClientTierFeatures;
}

export type ClientTierFeatureName = keyof ClientTierFeatures;
