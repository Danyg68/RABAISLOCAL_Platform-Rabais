import { createClient } from '@/lib/supabase/client';
import { MerchantProfile, UserProfile } from '@/modules/identity/types';

export const adminService = {
    /**
     * Récupère tous les commerçants (avec possibilité de filtrer par statut)
     * Réservé aux admins via RLS
     */
    async getAllMerchants(statusFilter?: 'PENDING' | 'VALIDATED' | 'REJECTED'): Promise<MerchantProfile[]> {
        const supabase = createClient();
        let query = supabase
            .from('merchants')
            .select('*')
            .order('created_at', { ascending: false });

        if (statusFilter) {
            query = query.eq('validation_status', statusFilter);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching merchants (admin):', error);
            // On pourrait vérifier ici si l'erreur est 403 (Forbidden) pour savoir si c'est un problème de droits
            return [];
        }

        return data as MerchantProfile[];
    },

    /**
     * Met à jour le statut d'un commerçant
     */
    async updateMerchantStatus(merchantId: string, newStatus: 'VALIDATED' | 'REJECTED'): Promise<{ success: boolean; error?: any }> {
        const supabase = createClient();
        const { error } = await supabase
            .from('merchants')
            .update({ validation_status: newStatus })
            .eq('id', merchantId);

        if (error) {
            console.error(`Error updating merchant status to ${newStatus}:`, error);
            return { success: false, error };
        }

        return { success: true };
    }
};
