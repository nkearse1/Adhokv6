import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function getClientWithTier(clientId: string) {
  const res = await db.execute(
    sql`
      select c.*, to_jsonb(ct) as tier
      from clients c
      left join client_tiers ct on c.tier_id = ct.id
      where c.id = ${clientId}
      limit 1
    `,
  );
  return (res as any)?.rows?.[0] ?? null;
}
