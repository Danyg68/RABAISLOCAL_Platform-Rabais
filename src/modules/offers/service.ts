import { createClient } from '@/lib/supabase/client';
import { Category, CreateOfferDTO, Offer } from './types';

export const offersService = {
    /**
     * Récupère toutes les catégories de rabais
     */
    async getCategories(): Promise<Category[]> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error);
            return [];
        }

        return data as Category[];
    },

    /**
     * Crée une nouvelle offre pour le commerçant actuel
     */
    async createOffer(offerPayload: CreateOfferDTO): Promise<{ data: Offer | null; error: any }> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('offers')
            .insert([offerPayload])
            .select()
            .single();

        return { data, error };
    },

    /**
     * Récupère les offres d'un commerçant spécifique
     */
    async getMerchantOffers(merchantId: string): Promise<Offer[]> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('offers')
            .select('*')
            .eq('merchant_id', merchantId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching merchant offers:', error);
            return [];
        }

        return data as Offer[];
    },

    /**
     * Supprime une offre
     */
    async deleteOffer(offerId: string): Promise<{ error: any }> {
        const supabase = createClient();
        const { error } = await supabase
            .from('offers')
            .delete()
            .eq('id', offerId);

        return { error };
    },

    /**
     * Récupère une offre spécifique par son ID
     */
    async getOfferById(offerId: string): Promise<Offer | null> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('offers')
            .select('*')
            .eq('id', offerId)
            .single();

        if (error) {
            console.error('Error fetching offer:', error);
            return null;
        }

        return data as Offer;
    },

    /**
     * Met à jour une offre existante
     */
    async updateOffer(offerId: string, updates: Partial<CreateOfferDTO>): Promise<{ error: any }> {
        const supabase = createClient();
        const { error } = await supabase
            .from('offers')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', offerId);

        return { error };
    },

    /**
     * Valide un coupon (Action Commerçant)
     */
    async redeemCoupon(uniqueCode: string, merchantId: string): Promise<{ success: boolean; message?: string; offer_title?: string; discount_type?: string; discount_value?: number }> {
        const supabase = createClient();
        const { data, error } = await supabase.rpc('redeem_coupon', {
            p_unique_code: uniqueCode,
            p_merchant_id: merchantId
        });

        if (error) {
            console.error('Error redeeming coupon:', error);
            // Default generic error if RPC fails hard (e.g. permissions)
            return { success: false, message: error.message || "Erreur de validation." };
        }

        return data;
    },

    /**
     * Récupère toutes les offres actives pour le catalogue public
     */
    async getPublicOffers(): Promise<Offer[]> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('offers')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching public offers:', error);
            return [];
        }

        return data as Offer[];
    },

    /**
     * Permet à un utilisateur authentifié de réclamer une offre (Création coupon)
     */
    async claimOffer(offerId: string): Promise<{ success: boolean; message?: string; coupon_id?: string; code?: string }> {
        const supabase = createClient();

        // Appel RPC au backend pour gérer concurrence et quantités
        const { data, error } = await supabase.rpc('claim_offer', { offer_uuid: offerId });

        if (error) {
            console.error('Error claiming offer:', error);
            return { success: false, message: "Erreur technique lors de l'achat." };
        }

        return data as { success: boolean; message?: string; coupon_id?: string; code?: string };
    }
};
