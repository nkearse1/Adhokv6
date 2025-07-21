// DO NOT import this in client components – will break on process.env access
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });

