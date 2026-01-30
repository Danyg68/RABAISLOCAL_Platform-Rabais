-- Ajout de la colonne pour stocker l'économie réalisée
ALTER TABLE public.coupons 
ADD COLUMN IF NOT EXISTS saved_amount NUMERIC(10,2) DEFAULT 0;

-- Mise à jour de la fonction redeem_coupon pour calculer/stocker l'économie
CREATE OR REPLACE FUNCTION public.redeem_coupon(p_unique_code text, p_merchant_id uuid DEFAULT NULL)
RETURNS jsonb AS $$
DECLARE
  v_merchant_id uuid;
  v_coupon public.coupons%rowtype;
  v_offer public.offers%rowtype;
  v_saved_amount numeric;
BEGIN
  v_merchant_id := auth.uid();

  -- Vérification d'autorisation (Commerçant)
  IF NOT EXISTS (SELECT 1 FROM public.merchants WHERE id = v_merchant_id) THEN
      RETURN jsonb_build_object('success', false, 'message', 'Non autorisé. Compte commerçant requis.');
  END IF;

  -- Verrouillage du coupon
  SELECT * INTO v_coupon FROM public.coupons WHERE unique_code = p_unique_code LIMIT 1 FOR UPDATE;
  
  IF NOT FOUND THEN 
    RETURN jsonb_build_object('success', false, 'message', 'Code invalide ou introuvable.'); 
  END IF;

  IF v_coupon.status = 'USED' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Ce coupon a déjà été utilisé.');
  END IF;

  -- Récupérer l'offre
  SELECT * INTO v_offer FROM public.offers WHERE id = v_coupon.offer_id;

  -- Vérification de propriété (Anti-IDOR)
  IF v_offer.merchant_id <> v_merchant_id THEN
      RETURN jsonb_build_object('success', false, 'message', 'Ce coupon n''est pas valide pour votre commerce.');
  END IF;

  -- CALCUL DE L'ÉCONOMIE
  -- Pour un montant fixe, c'est facile. 
  -- Pour un pourcentage, on met 0 pour l'instant (nécessiterait le montant de la facture).
  IF v_offer.discount_type = 'FIXED_AMOUNT' THEN
     v_saved_amount := v_offer.discount_value;
  ELSE
     v_saved_amount := 0; 
  END IF;

  -- Mise à jour du statut et de l'économie
  UPDATE public.coupons 
  SET 
    status = 'USED', 
    redeemed_at = now(),
    saved_amount = v_saved_amount
  WHERE id = v_coupon.id;
  
  RETURN jsonb_build_object(
    'success', true, 
    'offer_title', v_offer.title, 
    'discount_type', v_offer.discount_type,
    'discount_value', v_offer.discount_value,
    'saved_amount', v_saved_amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions;
