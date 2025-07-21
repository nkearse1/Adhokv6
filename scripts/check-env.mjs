import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL is not set in environment variables.');
  process.exit(1);
}
