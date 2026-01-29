export type UserRole = 'admin' | 'merchant' | 'consumer' | 'ambassador';

export interface UserProfile {
    id: string; // References auth.users.id
    email: string;
    role: UserRole;
    created_at: string;
    updated_at: string;
}

export interface AuthState {
    isLoading: boolean;
    user: UserProfile | null;
    error: Error | null;
}

export interface MerchantProfile {
    id: string; // Same as auth.uid
    business_name: string;
    description?: string;
    address?: string;
    phone?: string;
    website?: string;
    logo_url?: string;
    cover_image_url?: string;
    validation_status?: 'PENDING' | 'VALIDATED' | 'REJECTED';
}

