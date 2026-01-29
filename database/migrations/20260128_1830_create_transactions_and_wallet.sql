-- MODULE 4: TRANSACTIONS & WALLET

-- 1. Table Transactions
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  merchant_id uuid not null references public.merchants(id), -- Le commerçant qui encaisse/valide
  consumer_id uuid not null references public.consumers(id), -- Le client
  offer_id uuid references public.offers(id), -- Optionnel: Si lié à un rabais spécifique
  
  transaction_date timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Montants financiers
  bill_amount_cents integer default 0, -- Montant de la facture en cents (ex: 1500 = 15.00$)
  
  -- Points
  points_earned integer default 0, -- Points gagnés sur cette transaction
  points_redeemed integer default 0, -- Points utilisés sur cette transaction
  
  -- Statut
  status text check (status in ('PENDING', 'COMPLETED', 'CANCELLED')) default 'COMPLETED',
  type text check (type in ('EARN', 'REDEEM', 'BOTH')) default 'EARN',
  
  -- Metadonnées
  metadata jsonb default '{}'::jsonb,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Transactions
alter table public.transactions enable row level security;

-- Les commerçants voient les transactions qu'ils ont traitées
create policy "Merchants can view own transactions" 
on public.transactions for select 
to authenticated
using ( merchant_id = auth.uid() );

-- Les consommateurs voient leurs propres transactions
create policy "Consumers can view own transactions" 
on public.transactions for select 
to authenticated
using ( consumer_id = auth.uid() );

-- Seuls les commerçants peuvent CRÉER (Initialiser) une transaction (Scan)
create policy "Merchants can create transactions" 
on public.transactions for insert 
to authenticated
with check ( merchant_id = auth.uid() );


-- 2. Table Wallet Ledger (Grand Livre des Points)
create table public.wallet_ledger (
  id uuid default gen_random_uuid() primary key,
  consumer_id uuid not null references public.consumers(id),
  transaction_id uuid references public.transactions(id), -- Lien vers la transaction source (si applicable)
  
  amount integer not null, -- Positif (Crédit) ou Négatif (Débit)
  entry_type text check (entry_type in ('EARN', 'REDEEM', 'BONUS', 'EXPIRE', 'ADJUSTMENT')) not null,
  description text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Wallet Ledger
alter table public.wallet_ledger enable row level security;

-- Consommateurs : Lecture seule de LEUR historique
create policy "Consumers can view own ledger" 
on public.wallet_ledger for select 
to authenticated
using ( consumer_id = auth.uid() );

-- Personne ne peut écrire directement via l'API client (Sécurité)
-- Les écritures se feront via des Fonctions Database (RPC) ou Triggers.


-- 3. Fonction Helper : Calculer la balance d'un utilisateur
-- Cette fonction sera accessible via RPC ou computed column
create or replace function public.get_wallet_balance(user_uuid uuid)
returns integer
language plpgsql
security definer -- S'exécute avec les droits du créateur pour lire le ledger
as $$
declare
  total_balance integer;
begin
  select coalesce(sum(amount), 0)
  into total_balance
  from public.wallet_ledger
  where consumer_id = user_uuid;
  
  return total_balance;
end;
$$;

-- Trigger Automatique : Créer une entrée Ledger lors d'une Transaction
-- Pour simplifier le MVP, chaque fois qu'une transaction est insérée avec statut 'COMPLETED',
-- on génère les lignes dans le ledger.
create or replace function public.handle_new_transaction()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Si des points sont gagnés
  if NEW.points_earned > 0 then
    insert into public.wallet_ledger (consumer_id, transaction_id, amount, entry_type, description)
    values (NEW.consumer_id, NEW.id, NEW.points_earned, 'EARN', 'Points gagnés - Achat chez ' || NEW.merchant_id); -- TODO: Améliorer le nom du merchant si possible, sinon gérer côté front
  end if;

  -- Si des points sont utilisés
  if NEW.points_redeemed > 0 then
     insert into public.wallet_ledger (consumer_id, transaction_id, amount, entry_type, description)
    values (NEW.consumer_id, NEW.id, -NEW.points_redeemed, 'REDEEM', 'Rabais utilisé');
  end if;

  return NEW;
end;
$$;

create trigger on_transaction_created
  after insert on public.transactions
  for each row
  when (NEW.status = 'COMPLETED')
  execute function public.handle_new_transaction();
