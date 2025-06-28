import { db } from '../lib/db';

async function seed() {
  // Example seed: ensure migrations ran and insert default values
  console.log('Seeding database...');
  // Add your seed data here
}

seed().then(() => {
  console.log('Seed complete');
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});