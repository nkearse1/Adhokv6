import { eq } from 'drizzle-orm';
import { db } from './index';
import { clientTiers, clientProfiles, FeatureFlag } from './schema';

async function seed() {
  const tiers: { name: string; description: string; monthlyPrice: number; features: FeatureFlag[] }[] = [
    { name: 'Free', description: 'Default free tier', monthlyPrice: 0, features: [] },
    { name: 'Accept Bid Tier', description: 'Allows accepting bids', monthlyPrice: 0, features: ['accept_bid'] },
  ];

  for (const tier of tiers) {
    await db
      .insert(clientTiers)
      .values(tier)
      .onConflictDoUpdate({ target: clientTiers.name, set: tier });
  }

  // optional mock assignment: assign Accept Bid Tier to first client if exists
  const [acceptBid] = await db
    .select()
    .from(clientTiers)
    .where(eq(clientTiers.name, 'Accept Bid Tier'));

  if (acceptBid) {
    const [client] = await db.select().from(clientProfiles).limit(1);
    if (client) {
      await db
        .update(clientProfiles)
        .set({ tierId: acceptBid.id })
        .where(eq(clientProfiles.id, client.id));
    }
  }
}

seed()
  .then(() => {
    console.log('Seed complete');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
