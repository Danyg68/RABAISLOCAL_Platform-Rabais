import { createClient } from '@/lib/supabase/client';
import { UserRole } from '../identity/types';

export interface MerchantOnboardingData {
    company_name: string;
    address_city?: string;
    phone?: string;
    industry_sector?: string;
}

export interface ConsumerOnboardingData {
    first_name: string;
    last_name: string;
}

// Helper pour S'ASSURER que le profil existe (Création manuelle si besoin)
async function ensureProfileExists(supabase: any, user: any) {
    // 1. On vérifie si le profil existe déjà
    const { data } = await supabase.from('profiles').select('id').eq('id', user.id).single();
    if (data) return true;

    // 2. S'il n'existe pas, ON LE CRÉE NOUS-MÊME
    const { error } = await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || 'consumer'
    });

    if (error) {
        // Si l'erreur est "duplicate key", c'est que le trigger a été plus vite que nous (c'est bon signe)
        if (error.code === '23505') return true;
        console.error("Erreur création profil manuel:", error);
        throw error;
    }
    return true;
}

export const onboardingService = {

    async createMerchantProfile(user: any, data: MerchantOnboardingData) {
        const supabase = createClient();

        // Attendre que le profil parent soit prêt
        await ensureProfileExists(supabase, user);

        const { error } = await supabase
            .from('merchants')
            .insert({
                id: user.id,
                company_name: data.company_name,
                address_city: data.address_city,
                phone: data.phone,
                industry_sector: data.industry_sector
            });

        if (error) throw error;
        return true;
    },

    async createConsumerProfile(user: any, data: ConsumerOnboardingData) {
        const supabase = createClient();

        // Attendre que le profil parent soit prêt
        await ensureProfileExists(supabase, user);

        const { error } = await supabase
            .from('consumers')
            .insert({
                id: user.id,
                first_name: data.first_name,
                last_name: data.last_name
            });

        if (error) throw error;
        return true;
    }
};
