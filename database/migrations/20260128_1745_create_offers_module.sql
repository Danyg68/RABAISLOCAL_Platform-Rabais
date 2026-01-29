-- MODULE 3: GESTION DES OFFRES

-- 1. Table Categories
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  name text not null,
  description text,
  icon_name text, -- Pour afficher une icône (lucide-react par exemple)
  display_order integer default 0,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Categories
alter table public.categories enable row level security;

-- Tout le monde peut voir les catégories
create policy "Public can view categories" 
on public.categories for select 
to authenticated, anon
using ( true );

-- Seul un admin pourrait modifier (on laisse fermé pour l'instant ou via dashboard admin futur)


-- 2. Table Offers
create table public.offers (
  id uuid default gen_random_uuid() primary key,
  merchant_id uuid not null references public.merchants(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  
  title text not null,
  description text,
  conditions text, -- Termes et conditions spécifiques
  
  -- Type de rabais
  discount_type text check (discount_type in ('PERCENTAGE', 'FIXED_AMOUNT', 'BOGO', 'SPECIAL')),
  discount_value numeric, -- Ex: 15 pour 15%, 10 pour 10$
  
  -- Validité
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  
  -- Visuel principal (optimisation perf)
  image_url text, 
  
  is_active boolean default true,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Offers
alter table public.offers enable row level security;

-- Le public peut voir les offres actives
create policy "Public can view active offers" 
on public.offers for select 
to authenticated, anon
using ( is_active = true );

-- Les commerçants voient TOUTES leurs offres (actives ou non)
create policy "Merchants can view own offers" 
on public.offers for select 
to authenticated
using ( merchant_id = auth.uid() );

-- Les commerçants peuvent créer des offres pour eux-mêmes
create policy "Merchants can insert own offers" 
on public.offers for insert 
to authenticated
with check ( merchant_id = auth.uid() );

-- Les commerçants peuvent modifier leurs offres
create policy "Merchants can update own offers" 
on public.offers for update 
to authenticated
using ( merchant_id = auth.uid() );

-- Les commerçants peuvent supprimer leurs offres
create policy "Merchants can delete own offers" 
on public.offers for delete 
to authenticated
using ( merchant_id = auth.uid() );


-- 3. Table Offer Images (Gallerie additionnelle)
create table public.offer_images (
  id uuid default gen_random_uuid() primary key,
  offer_id uuid not null references public.offers(id) on delete cascade,
  image_url text not null,
  is_main boolean default false,
  display_order integer default 0,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Offer Images
alter table public.offer_images enable row level security;

-- Public view
create policy "Public can view offer images" 
on public.offer_images for select 
to authenticated, anon
using ( true );

-- Merchant manage (via lien offer_id)
create policy "Merchants can manage offer images" 
on public.offer_images for all
to authenticated
using ( 
  exists ( 
    select 1 from public.offers 
    where offers.id = offer_images.offer_id 
    and offers.merchant_id = auth.uid() 
  )
);


-- SEED DATA (Catégories de base)
insert into public.categories (slug, name, display_order, icon_name) values
('restauration', 'Restauration & Bars', 10, 'utensils'),
('alimentation', 'Alimentation & Épicerie', 20, 'shopping-basket'),
('boutiques', 'Boutiques & Mode', 30, 'shopping-bag'),
('services', 'Services & Soins', 40, 'scissors'),
('sante', 'Santé & Bien-être', 50, 'heart'),
('loisirs', 'Loisirs & Divertissement', 60, 'ticket'),
('maison', 'Maison & Déco', 70, 'home'),
('auto', 'Auto & Transport', 80, 'car');
