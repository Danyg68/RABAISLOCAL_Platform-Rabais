-- RESET TOTAL DES RÈGLES DE SÉCURITÉ (RLS CLEANUP)
-- Ce script nettoie toutes les anciennes règles et installe les permissions d'inscription.

-- 1. TABLE PROFILES
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Rétablissement Propre PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- IMPORTANT : On autorise l'utilisateur à créer sa PROPRE ligne
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- 2. TABLE CONSUMERS
ALTER TABLE public.consumers DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Consumers can insert own profile" ON public.consumers;
DROP POLICY IF EXISTS "Consumers can update own profile" ON public.consumers;
DROP POLICY IF EXISTS "Consumers can view own profile" ON public.consumers;

-- Rétablissement Propre CONSUMERS
ALTER TABLE public.consumers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Consumers can insert own profile" ON public.consumers FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Consumers can view own profile" ON public.consumers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Consumers can update own profile" ON public.consumers FOR UPDATE USING (auth.uid() = id);


-- 3. TABLE MERCHANTS
ALTER TABLE public.merchants DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Merchants can insert own profile" ON public.merchants;
DROP POLICY IF EXISTS "Merchants can update own profile" ON public.merchants;
DROP POLICY IF EXISTS "Merchants can view own profile" ON public.merchants;

-- Rétablissement Propre MERCHANTS
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Merchants can insert own profile" ON public.merchants FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Merchants can view own profile" ON public.merchants FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Merchants can update own profile" ON public.merchants FOR UPDATE USING (auth.uid() = id);


-- 4. PERMISSIONS GÉNÉRALES
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.consumers TO authenticated;
GRANT ALL ON TABLE public.merchants TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT ALL ON TABLE public.consumers TO service_role;
GRANT ALL ON TABLE public.merchants TO service_role;
