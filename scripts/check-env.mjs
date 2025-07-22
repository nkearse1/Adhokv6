import 'dotenv/config';

const missing = [];
if (!process.env.DATABASE_URL) missing.push('DATABASE_URL');
if (!process.env.NEXT_PUBLIC_SELECTED_USER_ID)
  missing.push('NEXT_PUBLIC_SELECTED_USER_ID');
if (!('NEXT_PUBLIC_USE_MOCK' in process.env))
  missing.push('NEXT_PUBLIC_USE_MOCK');

if (missing.length > 0) {
  console.error(
    `Error: Required env vars missing: ${missing.join(', ')}. Please check .env.local.`
  );
  process.exit(1);
}
