-- Ensure client_tiers has indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_client_tiers_name ON client_tiers (name);

-- Extend clients table with tier information
ALTER TABLE clients
    ADD COLUMN IF NOT EXISTS tier_id UUID REFERENCES client_tiers(id),
    ADD COLUMN IF NOT EXISTS tier_expires_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_clients_tier_id ON clients (tier_id);

