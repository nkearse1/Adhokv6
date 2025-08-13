-- Create client_tiers table
CREATE TABLE IF NOT EXISTS client_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    monthly_price INTEGER NOT NULL,
    features TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Unique index on name
CREATE UNIQUE INDEX IF NOT EXISTS idx_client_tiers_name ON client_tiers (name);

-- Seed initial tiers
INSERT INTO client_tiers (name, description, monthly_price, features)
VALUES
    ('Free', 'Default free tier', 0, '{}'),
    ('Accept Bid Tier', 'Allows accepting bids', 0, ARRAY['accept_bid'])
ON CONFLICT (name) DO UPDATE
SET description = EXCLUDED.description,
    monthly_price = EXCLUDED.monthly_price,
    features = EXCLUDED.features;

-- Alter client_profiles to include tier info
ALTER TABLE client_profiles
    ADD COLUMN IF NOT EXISTS tier_id UUID REFERENCES client_tiers(id),
    ADD COLUMN IF NOT EXISTS tier_expires_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_clients_tier_id ON client_profiles (tier_id);

-- Alter projects with accept_bid_enabled flag
ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS accept_bid_enabled BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_projects_accept_bid_enabled ON projects (accept_bid_enabled);
