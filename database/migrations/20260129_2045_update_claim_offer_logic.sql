-- Mise à jour de la fonction claim_offer pour gérer le coût en crédits
CREATE OR REPLACE FUNCTION public.claim_offer(offer_uuid uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_offer public.offers%rowtype;
  v_new_coupon_id uuid;
  v_unique_code text;
  v_user_id uuid;
  v_user_balance integer;
  v_credit_cost integer;
BEGIN
  v_user_id := auth.uid();
  
  -- 1. Verrouiller l'offre pour lecture/ecriture
  SELECT * INTO v_offer FROM public.offers WHERE id = offer_uuid FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'Offre introuvable');
  END IF;

  IF NOT v_offer.is_active THEN
    RETURN jsonb_build_object('success', false, 'message', 'Offre inactive');
  END IF;

  -- 2. Vérifier quantité
  IF v_offer.quantity_limit IS NOT NULL AND v_offer.quantity_claimed >= v_offer.quantity_limit THEN
    RETURN jsonb_build_object('success', false, 'message', 'Offre épuisée');
  END IF;

  -- 3. GESTION DES CRÉDITS (NOUVEAU)
  -- Récupérer le solde de l'utilisateur
  -- On peut appeler la fonction existante ou faire la somme ici. Utilisons la fonction existante.
  v_user_balance := public.get_wallet_balance(v_user_id);
  v_credit_cost := coalesce(v_offer.credit_cost, 0); -- Par sécurité, 0 si null (mais colonne est NOT NULL default 1)

  IF v_user_balance < v_credit_cost THEN
    RETURN jsonb_build_object('success', false, 'message', 'Crédits insuffisants (' || v_user_balance || ' disponibles, ' || v_credit_cost || ' requis)');
  END IF;

  -- 4. Générer Code Unique
  v_unique_code := upper(substring(md5(random()::text), 1, 8));

  -- 5. Créer le Coupon
  INSERT INTO public.coupons (offer_id, consumer_id, unique_code, valid_until)
  VALUES (offer_uuid, v_user_id, v_unique_code, v_offer.end_date)
  RETURNING id INTO v_new_coupon_id;

  -- 6. Incrémenter Claimed sur l'offre
  UPDATE public.offers 
  SET quantity_claimed = quantity_claimed + 1
  WHERE id = offer_uuid;

  -- 7. DÉBITER LE WALLET (NOUVEAU)
  IF v_credit_cost > 0 THEN
      INSERT INTO public.wallet_ledger (consumer_id, transaction_id, amount, entry_type, description)
      VALUES (
          v_user_id, 
          NULL, -- Pas de transaction commerçant ici, c'est un achat interne de coupon
          -v_credit_cost, 
          'REDEEM', 
          'Obtention coupon: ' || v_offer.title
      );
  END IF;

  RETURN jsonb_build_object('success', true, 'coupon_id', v_new_coupon_id, 'code', v_unique_code);
END;
$$;
