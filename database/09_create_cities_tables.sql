-- 🏙️ MIGRATION : PAGES VILLES (Dynamic City Pages)
-- Cette migration crée les tables nécessaires pour gérer les pages de villes dynamiques.

-- TABLE 1: VILLES (CITIES)
create table public.cities (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique, -- Identifiant URL (ex: 'trois-rivieres')
  name text not null, -- Nom affiché (ex: 'Trois-Rivières')
  slogan text,
  welcome_message text,
  hero_image_url text, -- URL de l'image d'en-tête
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Active RLS sur cities
alter table public.cities enable row level security;

-- Policy : Tout le monde peut lire (Public)
create policy "Public cities are viewable by everyone."
  on public.cities for select
  using ( true );

-- Policy : Seuls les admins peuvent modifier (Pour l'instant via dashboard Supabase)
-- (On pourra affiner plus tard avec les rôles admin)


-- TABLE 2: ACTUALITÉS (CITY_NEWS)
create table public.city_news (
  id uuid default gen_random_uuid() primary key,
  city_id uuid references public.cities(id) on delete cascade not null,
  title text not null,
  summary text,
  date date default CURRENT_DATE,
  link_url text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Active RLS sur city_news
alter table public.city_news enable row level security;

-- Policy : Tout le monde peut lire
create policy "City news are viewable by everyone."
  on public.city_news for select
  using ( true );


-- TABLE 3: ÉVÉNEMENTS (CITY_EVENTS)
create table public.city_events (
  id uuid default gen_random_uuid() primary key,
  city_id uuid references public.cities(id) on delete cascade not null,
  title text not null,
  period text, -- Ex: "26 juin - 6 juillet"
  description text,
  image_url text,
  link_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Active RLS sur city_events
alter table public.city_events enable row level security;

-- Policy : Tout le monde peut lire
create policy "City events are viewable by everyone."
  on public.city_events for select
  using ( true );


-- TABLE 4: À VISITER (CITY_PLACES)
create table public.city_places (
  id uuid default gen_random_uuid() primary key,
  city_id uuid references public.cities(id) on delete cascade not null,
  name text not null,
  description text,
  image_url text,
  website_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Active RLS sur city_places
alter table public.city_places enable row level security;

-- Policy : Tout le monde peut lire
create policy "City places are viewable by everyone."
  on public.city_places for select
  using ( true );


-- 🧪 DONNÉES DE TEST : TROIS-RIVIÈRES
-- Insère la ville et récupère son ID pour insérer les contenus liés
WITH new_city AS (
  INSERT INTO public.cities (slug, name, slogan, welcome_message, hero_image_url)
  VALUES (
    'trois-rivieres',
    'Trois-Rivières',
    'Une ville vivante, fière et rassembleuse',
    'Trois-Rivières est une ville d''histoire et de culture, où la qualité de vie est au cœur de nos priorités.',
    'images/hero.jpg' -- URL à adapter une fois le storage connecté
  )
  RETURNING id
)
INSERT INTO public.city_events (city_id, title, period, description, image_url)
SELECT id, 'Festivoix de Trois-Rivières', '26 juin - 6 juillet 2026', 'L''événement culturel et festif incontournable de la Mauricie !', 'images/festivoix.jpg'
FROM new_city;
