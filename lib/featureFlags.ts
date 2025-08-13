import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

interface TierRow {
  features: any;
  tier_expires_at: string | null;
}

interface ProjectRow {
  accept_bid_enabled: boolean | null;
  client_id: string | null;
}

export async function hasFeatureForClient(
  clientId: string,
  featureKey: string
): Promise<boolean> {
  const res = await db.execute(
    sql`select ct.features, ct.tier_expires_at
        from client_profiles cp
        join client_tiers ct on cp.id = ct.client_id
        where cp.id = ${clientId}
        limit 1`
  );
  const row = (res.rows as TierRow[])[0];
  if (!row) return false;
  if (
    row.tier_expires_at &&
    new Date(row.tier_expires_at).getTime() < Date.now()
  ) {
    return false;
  }
  const features = row.features ?? {};
  if (Array.isArray(features)) {
    return features.includes(featureKey);
  }
  return Boolean(features[featureKey]);
}

export async function hasAcceptBidForProject(
  projectId: string
): Promise<boolean> {
  const res = await db.execute(
    sql`select accept_bid_enabled, client_id from projects where id = ${projectId} limit 1`
  );
  const row = (res.rows as ProjectRow[])[0];
  if (!row) return false;
  if (row.accept_bid_enabled) return true;
  if (!row.client_id) return false;
  return hasFeatureForClient(row.client_id, 'accept_bid');
}

