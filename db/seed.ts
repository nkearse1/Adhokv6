import { db } from '../lib/db';
import { clientTiers, clients, users } from '../lib/schema';
import { eq } from 'drizzle-orm';

const tiers = [
  {
    name: 'Free',
    description: 'Default tier with limited features',
    monthlyPrice: 0,
    features: { accept_bid: false },
  },
  {
    name: 'Accept Bid Tier',
    description: 'Allows clients to accept bids on projects',
    monthlyPrice: 0,
    features: { accept_bid: true },
  },
];

async function seed() {
  for (const tier of tiers) {
    await db
      .insert(clientTiers)
      .values(tier)
      .onConflictDoUpdate({
        target: clientTiers.name,
        set: {
          description: tier.description,
          monthlyPrice: tier.monthlyPrice,
          features: tier.features,
        },
      });
  }

  const premium = await db
    .select({ id: clientTiers.id })
    .from(clientTiers)
    .where(eq(clientTiers.name, 'Accept Bid Tier'))
    .limit(1);

  if (premium.length) {
    const demoEmails = ['client1@example.com', 'client2@example.com'];
    for (const email of demoEmails) {
      const user = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      if (user.length) {
        await db
          .insert(clients)
          .values({ id: user[0].id, tierId: premium[0].id })
          .onConflictDoUpdate({
            target: clients.id,
            set: { tierId: premium[0].id },
          });
      }
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
