-- Ajout de la colonne credit_cost à la table offers
ALTER TABLE public.offers
ADD COLUMN IF NOT EXISTS credit_cost INTEGER DEFAULT 1 NOT NULL;

-- Fonction pour calculer le coût en crédits
CREATE OR REPLACE FUNCTION public.calculate_offer_credit_cost()
RETURNS TRIGGER AS $$
BEGIN
    -- Logique de calcul des crédits
    -- Si c'est un montant fixe (FIXED_AMOUNT)
    IF NEW.discount_type = 'FIXED_AMOUNT' THEN
        IF NEW.discount_value < 30 THEN
            NEW.credit_cost := 1;
        ELSIF NEW.discount_value < 90 THEN
            NEW.credit_cost := 2;
        ELSE
            NEW.credit_cost := 3; -- 90$ et plus
        END IF;
    
    -- Si c'est un pourcentage (PERCENTAGE)
    -- On pourrait ajuster ici, mais pour l'instant on garde 1 par défaut 
    -- ou 2 si le pourcentage est très élevé (ex: > 50%)
    ELSIF NEW.discount_type = 'PERCENTAGE' THEN
        IF NEW.discount_value >= 50 THEN
            NEW.credit_cost := 2;
        ELSE
            NEW.credit_cost := 1;
        END IF;
    
    -- Pour BOGO (2 pour 1) ou SPECIAL
    ELSE
        NEW.credit_cost := 1;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement le coût en crédits avant insertion ou mise à jour
DROP TRIGGER IF EXISTS trigger_calculate_credit_cost ON public.offers;

CREATE TRIGGER trigger_calculate_credit_cost
BEFORE INSERT OR UPDATE OF discount_value, discount_type ON public.offers
FOR EACH ROW
EXECUTE FUNCTION public.calculate_offer_credit_cost();

-- Recalculer pour les offres existantes
UPDATE public.offers SET id = id;
