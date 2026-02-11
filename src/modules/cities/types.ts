export interface City {
    id: string;
    slug: string;
    name: string;
    slogan?: string;
    welcome_message?: string;
    hero_image_url?: string;
    created_at: string;
}

export interface CityNews {
    id: string;
    city_id: string;
    title: string;
    summary?: string;
    date?: string;
    link_url?: string;
    image_url?: string;
    created_at: string;
}

export interface CityEvent {
    id: string;
    city_id: string;
    title: string;
    period?: string;
    description?: string;
    image_url?: string;
    link_url?: string;
    created_at: string;
}

export interface CityPlace {
    id: string;
    city_id: string;
    name: string;
    description?: string;
    image_url?: string;
    website_url?: string;
    created_at: string;
}

export interface CityData {
    city: City;
    news: CityNews[];
    events: CityEvent[];
    places: CityPlace[];
}
