import { createClient } from '@/lib/supabase/client';
import { City, CityEvent, CityNews, CityPlace, CityData } from './types';

export const cityService = {
    /**
     * Récupère une ville par son slug (ex: 'trois-rivieres') ainsi que ses contenus liés.
     */
    async getCityBySlug(slug: string): Promise<CityData | null> {
        const supabase = createClient();

        // 1. Récupérer la ville
        const { data: city, error: cityError } = await supabase
            .from('cities')
            .select('*')
            .eq('slug', slug)
            .single();

        if (cityError || !city) {
            console.error(`Error fetching city with slug ${slug}:`, cityError);
            return null;
        }

        // 2. Récupérer les contenus liés (news, events, places) en parallèle
        const [newsResult, eventsResult, placesResult] = await Promise.all([
            supabase.from('city_news').select('*').eq('city_id', city.id).order('date', { ascending: false }),
            supabase.from('city_events').select('*').eq('city_id', city.id).order('created_at', { ascending: false }), // Ordre par création à défaut de date
            supabase.from('city_places').select('*').eq('city_id', city.id).order('name', { ascending: true }),
        ]);

        return {
            city: city as City,
            news: (newsResult.data as CityNews[]) || [],
            events: (eventsResult.data as CityEvent[]) || [],
            places: (placesResult.data as CityPlace[]) || [],
        };
    },

    /**
     * Récupère la liste de tous les slugs de villes pour la génération statique (SSG/ISR)
     */
    async getAllCitySlugs(): Promise<string[]> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('cities')
            .select('slug');

        if (error) {
            console.error('Error fetching city slugs:', error);
            return [];
        }

        return data.map((city: { slug: string }) => city.slug);
    },

    /**
     * Récupère la liste complète des villes (pour la page index /villes)
     */
    async getAllCities(): Promise<City[]> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('cities')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching cities:', error);
            return [];
        }

        return (data as City[]) || [];
    }
};
