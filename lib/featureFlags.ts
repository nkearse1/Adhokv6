import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function hasFeatureForClient(
  clientId: string,
  featureKey: string,
): Promise<boolean> {
  const res = await db.execute(
    sql`select ct.features from clients c join client_tiers ct on c.tier_id = ct.id where c.id = ${clientId} limit 1`,
  );
  const row = (res as any)?.rows?.[0];
  if (!row || !row.features) return false;
  const features = row.features as Record<string, any>;
  const value = features[featureKey];
  if (!value) return false;

  let enabled = false;
  let expires: string | undefined;
  if (typeof value === 'boolean') {
    enabled = value;
  } else if (typeof value === 'object') {
    enabled = value.enabled ?? true;
    expires = value.expiresAt ?? value.expiry ?? value.expires_at;
  } else {
    // Treat any other truthy value as an expiry string
    enabled = true;
    if (typeof value === 'string') {
      expires = value;
    }
  }

  if (!enabled) return false;
  if (expires && new Date(expires) < new Date()) return false;
  return true;
}

export async function hasAcceptBidForProject(projectId: string): Promise<boolean> {
  const res = await db.execute(
    sql`select accept_bid_enabled, client_id from projects where id = ${projectId} limit 1`,
  );
  const row = (res as any)?.rows?.[0];
  if (!row) return false;
  if (row.accept_bid_enabled) return true;
  if (!row.client_id) return false;
  return hasFeatureForClient(row.client_id as string, 'accept-bid');
}

