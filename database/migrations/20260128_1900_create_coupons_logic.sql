-- MODULE 3-BIS: GESTION DES COUPONS (CORRECTION FLUX)

-- 1. Modification Offres (Quantités)
alter table public.offers 
add column if not exists quantity_limit integer default null, -- Null = Illimité
add column if not exists quantity_claimed integer default 0;

-- 2. Table Coupons (Les rabais achetés/réclamés par les utilisateurs)
create table public.coupons (
  id uuid default gen_random_uuid() primary key,
  offer_id uuid not null references public.offers(id),
  consumer_id uuid not null references public.consumers(id),
  
  -- Code unique pour le scan (Ex: RABAIS-XH52)
  -- On peut utiliser l'UUID pour le QR code, mais un code court humainement lisible est bien aussi
  unique_code text not null unique, 
  
  status text check (status in ('ACTIVE', 'USED', 'EXPIRED')) default 'ACTIVE',
  redeemed_at timestamp with time zone, -- Date d'utilisation
  
  purchase_date timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Sécurité / Validité du coupon au moment de l'achat
  purchase_price_cents integer default 0, -- Si payant
  valid_until timestamp with time zone -- Copie de la date fin de l'offre
);

-- RLS Coupons
alter table public.coupons enable row level security;

-- Le Consommateur voit SES coupons
create policy "Consumers can view own coupons" 
on public.coupons for select 
to authenticated
using ( consumer_id = auth.uid() );

-- Le Commerçant peut voir les coupons liés à SES offres (pour le scan/validation)
create policy "Merchants can view coupons for their offers" 
on public.coupons for select 
to authenticated
using ( 
  exists (
    select 1 from public.offers
    where offers.id = coupons.offer_id
    and offers.merchant_id = auth.uid()
  )
);

-- Le Commerçant peut MODIFIER (Marquer Used) les coupons de ses offres
create policy "Merchants can update coupons for their offers" 
on public.coupons for update
to authenticated
using ( 
  exists (
    select 1 from public.offers
    where offers.id = coupons.offer_id
    and offers.merchant_id = auth.uid()
  )
);

-- Fonction RPC pour "Acheter/Réclamer" un coupon (Gère la concurrence et les quantités)
create or replace function public.claim_offer(offer_uuid uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_offer public.offers%rowtype;
  v_new_coupon_id uuid;
  v_unique_code text;
  v_user_id uuid;
begin
  v_user_id := auth.uid();
  
  -- 1. Verrouiller l'offre pour lecture/ecriture
  select * into v_offer from public.offers where id = offer_uuid for update;
  
  if not found then
    return jsonb_build_object('success', false, 'message', 'Offre introuvable');
  end if;

  if not v_offer.is_active then
    return jsonb_build_object('success', false, 'message', 'Offre inactive');
  end if;

  -- 2. Vérifier quantité
  if v_offer.quantity_limit is not null and v_offer.quantity_claimed >= v_offer.quantity_limit then
    return jsonb_build_object('success', false, 'message', 'Offre épuisée');
  end if;

  -- 3. Générer Code Unique (Simple Hash pour démo)
  v_unique_code := upper(substring(md5(random()::text), 1, 8));

  -- 4. Créer le Coupon
  insert into public.coupons (offer_id, consumer_id, unique_code, valid_until)
  values (offer_uuid, v_user_id, v_unique_code, v_offer.end_date)
  returning id into v_new_coupon_id;

  -- 5. Incrémenter Claimed
  update public.offers 
  set quantity_claimed = quantity_claimed + 1
  where id = offer_uuid;

  return jsonb_build_object('success', true, 'coupon_id', v_new_coupon_id, 'code', v_unique_code);
end;
$$;
