import { db } from './neonDb.js';

async function run() {
  try {
    await db.query('select backfill_missing_project_ids()');
    console.log('Cleanup complete!');
  } catch (err) {
    console.error('Failed to run cleanup:', err.message);
    process.exit(1);
  } finally {
    await db.end();
  }
}

run();
