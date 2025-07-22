// DO NOT import this in client components – will break on process.env access
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

if (typeof window !== 'undefined') {
  throw new Error('db should only be used server-side');
}

if (typeof process.env.DATABASE_URL !== 'string') {
  throw new Error('DATABASE_URL is not defined in server environment');
}

const connectionString = process.env.DATABASE_URL;

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });

