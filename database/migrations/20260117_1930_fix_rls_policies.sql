-- FIX RLS POLICIES FOR ONBOARDING
-- Users need permission to INSERT their own profile row during registration

-- 1. Fix for Consumers
DROP POLICY IF EXISTS "Consumers can update own profile" ON public.consumers;
-- Allow INSERT (creation)
CREATE POLICY "Consumers can insert own profile" 
ON public.consumers FOR INSERT 
WITH CHECK ( auth.uid() = id );
-- Restore UPDATE (modification)
CREATE POLICY "Consumers can update own profile" 
ON public.consumers FOR UPDATE 
USING ( auth.uid() = id );

-- 2. Fix for Merchants
DROP POLICY IF EXISTS "Merchants can update own profile" ON public.merchants;
-- Allow INSERT (creation)
CREATE POLICY "Merchants can insert own profile" 
ON public.merchants FOR INSERT 
WITH CHECK ( auth.uid() = id );
-- Restore UPDATE (modification)
CREATE POLICY "Merchants can update own profile" 
ON public.merchants FOR UPDATE 
USING ( auth.uid() = id );
