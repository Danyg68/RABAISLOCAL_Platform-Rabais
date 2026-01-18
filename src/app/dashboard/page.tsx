'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function DashboardRedirect() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkRoleAndRedirect = async () => {
            const supabase = createClient();

            // 1. Get current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // Not logged in -> Redirect to login (or home for now)
                router.push('/test-auth');
                return;
            }

            // 2. Get profile to check role
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (error || !profile) {
                console.error("Dashboard: Profile not found", error);
                return;
            }

            // 3. Redirect based on role
            if (profile.role === 'merchant') {
                router.push('/dashboard/merchant');
            } else if (profile.role === 'consumer') {
                router.push('/dashboard/consumer');
            } else if (profile.role === 'admin') {
                router.push('/dashboard/admin'); // Future
            } else {
                // Fallback for unknown roles (ambassadors?)
                router.push('/dashboard/consumer');
            }
        };

        checkRoleAndRedirect();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Chargement de votre espace...</h2>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
        </div>
    );
}
