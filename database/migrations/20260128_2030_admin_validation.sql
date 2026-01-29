-- MODULE 5: ADMINISTRATION & VALIDATION COMMERÇANTS

-- 1. Ajouter le statut de validation aux commerçants
alter table public.merchants 
add column if not exists validation_status text 
check (validation_status in ('PENDING', 'VALIDATED', 'REJECTED')) 
default 'PENDING';

-- 2. Création ou Mise à jour de la policy pour que les admins puissent tout faire sur les merchants
-- (Supabase ne permet pas facilement de modifier une policy existante, on la drop avant)
drop policy if exists "Admins can manage all merchants" on public.merchants;

create policy "Admins can manage all merchants"
on public.merchants
for all
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- 3. Trigger ou Fonction pour vérifier si un commerçant est validé avant de créer une offre
-- On crée une policy sur 'offers' INSERTS
drop policy if exists "Validated merchants can insert offers" on public.offers;

create policy "Validated merchants can insert offers"
on public.offers
for insert
to authenticated
with check (
  auth.uid() = merchant_id
  and exists (
    select 1 from public.merchants
    where merchants.id = auth.uid()
    and merchants.validation_status = 'VALIDATED'
  )
);

-- NOTE: Il faudra peut-être désactiver l'ancienne policy d'insert sur offers si elle était trop permissive
-- Ancienne: "Merchants can insert their own offers" -> On la remplace ou on s'assure qu'elle est restrictive.
-- Pour simplifier, on assume que l'ancienne policy permet l'insert si merchant_id = auth.uid().
-- On va la resserrer :

drop policy if exists "Merchants can insert their own offers" on public.offers;
-- La nouvelle policy remplace l'ancienne avec la condition VALIDATED

