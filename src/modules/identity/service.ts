import { createClient } from '@/lib/supabase/client';
import { UserProfile, UserRole } from './types';

export const identityService = {
    /**
     * Récupère le profil de l'utilisateur connecté via Supabase
     */
    async getCurrentUserProfile(): Promise<UserProfile | null> {
        const supabase = createClient();

        // 1. Récupérer l'utilisateur de la session auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return null;
        }

        // 2. Récupérer les données supplémentaires de la table profiles
        const { data: profile, error: dbError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (dbError) {
            console.error('Error fetching profile:', dbError);
            return null;
        }

        return profile as UserProfile;
    },

    /**
     * Vérifie si l'utilisateur a un rôle spécifique
     */
    async hasRole(requiredRole: UserRole): Promise<boolean> {
        const profile = await this.getCurrentUserProfile();
        return profile?.role === requiredRole;
    },

    /**
     * Récupère les infos publiques du commerçant (Business Name, etc.)
     */
    async getMerchantPublicProfile(merchantId: string): Promise<any | null> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('merchants')
            .select('*')
            .eq('id', merchantId)
            .single();

        if (error) {
            console.error('Error fetching merchant public profile:', error);
            return null;
        }
        return data;
    },

    /**
     * Alias typé pour récupérer le profil complet (y compris status validation)
     */
    async getMerchantProfile(merchantId: string): Promise<any | null> {
        return this.getMerchantPublicProfile(merchantId);
    },

    /**
     * Récupère le profil public d'un consommateur par son ID (Pour le scan commerçant)
     */
    async getUserPublicProfile(userId: string): Promise<UserProfile | null> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }

        return data as UserProfile;
    }
};
