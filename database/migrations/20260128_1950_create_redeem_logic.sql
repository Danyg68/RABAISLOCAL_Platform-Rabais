-- MODULE 4-BIS: VALIDATION DES COUPONS (REDEEM)

-- Fonction RPC pour "Scanner/Valider" un coupon
create or replace function public.redeem_coupon(
  p_unique_code text,
  p_merchant_id uuid
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_coupon public.coupons%rowtype;
  v_offer public.offers%rowtype;
begin
  -- 1. Trouver le coupon
  select * into v_coupon 
  from public.coupons 
  where unique_code = upper(p_unique_code); -- Insensible à la casse

  if not found then
    return jsonb_build_object('success', false, 'message', 'Code invalide ou introuvable.');
  end if;

  -- 2. Vérifier le statut
  if v_coupon.status = 'USED' then
    return jsonb_build_object('success', false, 'message', 'Ce coupon a déjà été utilisé le ' || to_char(v_coupon.redeemed_at, 'DD/MM/YYYY à HH:MI'));
  end if;
  
  if v_coupon.status = 'EXPIRED' or (v_coupon.valid_until is not null and v_coupon.valid_until < now()) then
    return jsonb_build_object('success', false, 'message', 'Ce coupon est expiré.');
  end if;

  -- 3. Vérifier que l'offre appartient bien au commerçant qui scanne
  select * into v_offer 
  from public.offers 
  where id = v_coupon.offer_id;
  
  if v_offer.merchant_id != p_merchant_id then
    return jsonb_build_object('success', false, 'message', 'Ce coupon n''appartient pas à votre commerce.');
  end if;

  -- 4. VALIDER (Passer à USED)
  update public.coupons 
  set status = 'USED',
      redeemed_at = now()
  where id = v_coupon.id;

  -- 5. Retourner les infos pour l'affichage sucès
  return jsonb_build_object(
    'success', true, 
    'message', 'Coupon validé avec succès !',
    'offer_title', v_offer.title,
    'discount_type', v_offer.discount_type,
    'discount_value', v_offer.discount_value
  );
end;
$$;
