import { db } from './neonDb.js';

async function run() {
  try {
    await db.query('select recalculate_all_trust_scores()');
    console.log('Trust scores recalculated');
  } catch (err) {
    console.error('Failed to recalculate trust scores:', err.message);
    process.exit(1);
  } finally {
    await db.end();
  }
}

run();