-- Ensure client_tiers has indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_client_tiers_name ON client_tiers (name);

-- Extend clients table with tier information
ALTER TABLE clients
    ADD COLUMN IF NOT EXISTS tier_id UUID REFERENCES client_tiers(id),
    ADD COLUMN IF NOT EXISTS tier_expires_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_clients_tier_id ON clients (tier_id);

-- Extend projects table with accept_bid_enabled
ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS accept_bid_enabled BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_projects_accept_bid_enabled ON projects (accept_bid_enabled);
