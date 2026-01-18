-- Create merchants table (Extension of profiles for role 'merchant')
create table public.merchants (
  id uuid not null references public.profiles(id) on delete cascade,
  company_name text not null,
  description text,
  address_street text,
  address_city text,
  address_zip text,
  phone text,
  website text,
  industry_sector text,
  logo_url text,
  
  is_verified boolean default false,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (id)
);

-- Create consumers table (Extension of profiles for role 'consumer')
create table public.consumers (
  id uuid not null references public.profiles(id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  
  points_balance integer default 0,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (id)
);

-- RLS Policies

-- MERCHANTS
alter table public.merchants enable row level security;

-- Merchants can view and update their own business profile
create policy "Merchants can view own profile" 
on public.merchants for select 
using ( auth.uid() = id );

create policy "Merchants can update own profile" 
on public.merchants for update 
using ( auth.uid() = id );

-- Public read access for merchants (for the directory) - We might restrict this later
create policy "Public can view verified merchants" 
on public.merchants for select 
using ( is_verified = true );


-- CONSUMERS
alter table public.consumers enable row level security;

-- Consumers can view and update their own profile
create policy "Consumers can view own profile" 
on public.consumers for select 
using ( auth.uid() = id );

create policy "Consumers can update own profile" 
on public.consumers for update 
using ( auth.uid() = id );
