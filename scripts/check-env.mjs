import 'dotenv/config';

const missing = [];
if (!process.env.DATABASE_URL) missing.push('DATABASE_URL');

if (missing.length > 0) {
  console.error(
    `Error: Required env vars missing: ${missing.join(', ')}. Please check .env.local.`
  );
  process.exit(1);
}
