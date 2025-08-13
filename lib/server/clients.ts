import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

interface ClientWithTierRow {
  client: any;
  tier: any;
}

export async function getClientWithTier(clientId: string) {
  const res = await db.execute(
    sql`select row_to_json(cp.*) as client, row_to_json(ct.*) as tier
        from client_profiles cp
        left join client_tiers ct on cp.id = ct.client_id
        where cp.id = ${clientId}
        limit 1`
  );
  return (res.rows as ClientWithTierRow[])[0] ?? null;
}

export async function enableProjectAcceptBid(projectId: string) {
  await db.execute(
    sql`update projects set accept_bid_enabled = true where id = ${projectId}`
  );
}

