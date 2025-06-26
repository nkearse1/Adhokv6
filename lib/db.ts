import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Get the database connection string from environment variables
const connectionString = process.env.DATABASE_URL;

// Check if the connection string is defined
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

// Create a Neon SQL client
const sql = neon(connectionString);

// Create a Drizzle ORM instance with the Neon client and schema
export const db = drizzle(sql, { schema });

// Export a function to get a new database connection
// This is useful for serverless functions where you might need a fresh connection
export function getDb() {
  return drizzle(neon(connectionString), { schema });
}