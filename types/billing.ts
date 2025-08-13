export interface ClientTierFeatures {
  accept_bid: boolean;
}

export interface ClientTier {
  id: string;
  name: string;
  features: ClientTierFeatures;
}
