import { z } from 'zod';

const envSchema = z.object({
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  STRIPE_PRICE_ACCEPT_BID: z.string(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
export default env;
