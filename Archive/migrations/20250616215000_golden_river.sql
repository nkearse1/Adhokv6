/*
  # Update admin policies

  1. Function Changes
    - Redefine is_admin() with SECURITY DEFINER so RLS on users table is bypassed
    - Grant execute permission to authenticated

  2. Policy Changes
    - Drop existing admin policies
    - Recreate them using is_admin()
*/

-- Redefine is_admin with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND user_role = 'admin'
  );
$$;

-- Ensure authenticated can call the function
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Drop old policies
DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update user roles" ON public.users;

-- Recreate policies that rely on is_admin()
CREATE POLICY "Admins can read all users"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update user roles"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());