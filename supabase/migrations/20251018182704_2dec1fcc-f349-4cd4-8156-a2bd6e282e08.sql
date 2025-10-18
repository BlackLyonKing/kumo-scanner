-- Add wallet_address support to user_roles table
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS wallet_address TEXT;

DO $$ 
BEGIN
  ALTER TABLE public.user_roles ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Create unique constraint for wallet roles
CREATE UNIQUE INDEX IF NOT EXISTS user_roles_wallet_role_idx 
ON public.user_roles(wallet_address, role) 
WHERE wallet_address IS NOT NULL;

-- Insert admin role (ignore if already exists)
DO $$
BEGIN
  INSERT INTO public.user_roles (wallet_address, role)
  VALUES ('9nt3BzBV3qu2w94ytpsARgQAuTJQRyNpYsCz58mmzH1E', 'admin');
EXCEPTION WHEN unique_violation THEN
  -- Do nothing, admin already exists
END $$;

-- Update has_role function to support wallet addresses
CREATE OR REPLACE FUNCTION public.has_role(_wallet_address TEXT, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE wallet_address = _wallet_address
      AND role = _role
  )
$$;

-- Create table for permanent access grants
CREATE TABLE IF NOT EXISTS public.permanent_access_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL UNIQUE,
  granted_by_wallet TEXT NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Enable RLS on permanent_access_grants
ALTER TABLE public.permanent_access_grants ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on permanent_access_grants
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Anyone can view permanent access grants" ON public.permanent_access_grants;
  DROP POLICY IF EXISTS "Admins can insert permanent access grants" ON public.permanent_access_grants;
  DROP POLICY IF EXISTS "Admins can delete permanent access grants" ON public.permanent_access_grants;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Policy: Anyone can view permanent access grants
CREATE POLICY "Anyone can view permanent access grants"
ON public.permanent_access_grants
FOR SELECT
USING (true);

-- Policy: Admins can insert permanent access grants  
CREATE POLICY "Admins can insert permanent access grants"
ON public.permanent_access_grants
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE wallet_address = granted_by_wallet
    AND role = 'admin'
  )
);

-- Policy: Admins can delete permanent access grants
CREATE POLICY "Admins can delete permanent access grants"
ON public.permanent_access_grants
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.role = 'admin'
  )
);

-- Drop ALL existing policies on user_roles
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
  DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
  DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
  DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
  DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
  DROP POLICY IF EXISTS "Anyone can view roles for wallets" ON public.user_roles;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Create new policies for user_roles
CREATE POLICY "Anyone can view roles for wallets"
ON public.user_roles
FOR SELECT
USING (wallet_address IS NOT NULL OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.wallet_address IS NOT NULL
    AND ur.role = 'admin'
  )
);

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.wallet_address IS NOT NULL
    AND ur.role = 'admin'
  )
);

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.wallet_address IS NOT NULL
    AND ur.role = 'admin'
  )
);