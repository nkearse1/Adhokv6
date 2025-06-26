ALTER TABLE public.users ADD COLUMN IF NOT EXISTS company_id uuid;

-- Add requesting_user, requesting_business and matched_talent to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS requesting_user uuid;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS requesting_business uuid;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS matched_talent text;

-- Backfill requesting_user with created_by if present
UPDATE projects SET requesting_user = created_by
  WHERE requesting_user IS NULL AND created_by IS NOT NULL;

-- Backfill requesting_business using users.company_id
UPDATE projects p
SET requesting_business = u.company_id
FROM users u
WHERE p.requesting_user = u.id
  AND p.requesting_business IS NULL;

-- Trigger to auto populate requesting fields on insert
CREATE OR REPLACE FUNCTION set_requesting_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.requesting_user IS NULL THEN
    NEW.requesting_user := auth.uid();
  END IF;
  IF NEW.requesting_business IS NULL THEN
    SELECT company_id INTO NEW.requesting_business FROM users WHERE id = NEW.requesting_user;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_set_requesting_fields ON projects;
CREATE TRIGGER trg_set_requesting_fields
BEFORE INSERT ON projects
FOR EACH ROW EXECUTE FUNCTION set_requesting_fields();

-- Trigger to fill matched_talent when talent_id is set
CREATE OR REPLACE FUNCTION set_matched_talent()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.talent_id IS NOT NULL AND (OLD.talent_id IS DISTINCT FROM NEW.talent_id OR TG_OP = 'INSERT') THEN
    SELECT username INTO NEW.matched_talent FROM users WHERE id = NEW.talent_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_set_matched_talent ON projects;
CREATE TRIGGER trg_set_matched_talent
BEFORE INSERT OR UPDATE OF talent_id ON projects
FOR EACH ROW EXECUTE FUNCTION set_matched_talent();