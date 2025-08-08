// DO NOT import this in client components – will break on process.env access
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

if (typeof window !== 'undefined') {
  throw new Error('db should only be used server-side');
}

// Support both DATABASE_URL and NEON_DATABASE_URL to make local and
// serverless environments interchangeable. Prefer DATABASE_URL when it is
// set so developers can override locally.
const connectionString =
  process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (typeof connectionString !== 'string') {
  throw new Error(
    'DATABASE_URL or NEON_DATABASE_URL must be defined in server environment',
  );
}

// Log which connection string is active so developers can verify the
// configuration during startup. The full string can contain credentials, so
// only print the first part for safety.
const activeKey = process.env.DATABASE_URL ? 'DATABASE_URL' : 'NEON_DATABASE_URL';
const redacted = connectionString.replace(/:\S+@/, ':***@');
console.log(`[db] using ${activeKey}: ${redacted}`);

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });

