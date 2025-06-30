import { Pool } from '@neondatabase/serverless';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const db = new Pool({ connectionString });
