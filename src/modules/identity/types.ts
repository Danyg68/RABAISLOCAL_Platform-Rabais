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
