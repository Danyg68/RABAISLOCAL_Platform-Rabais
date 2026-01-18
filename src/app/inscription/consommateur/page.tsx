'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { onboardingService } from '@/modules/onboarding/service';
import { useRouter } from 'next/navigation';

export default function InscriptionConsommateur() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const supabase = createClient();

            // 1. Création compte Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: { role: 'consumer' } // Important: Trigger le rôle
                }
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("Erreur création utilisateur");

            // 2. Création profil Consommateur (Table consumers)
            await onboardingService.createConsumerProfile(authData.user, {
                first_name: formData.firstName,
                last_name: formData.lastName
            });

            // 3. Succès -> Redirection (ou message confirmation)
            alert("Compte créé avec succès ! Bienvenue.");
            router.push('/test-auth'); // Redirection temporaire vers le dashboard/test

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Devenir Membre RabaisLocal
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Commencez à économiser dès aujourd&apos;hui
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        <div className="flex gap-2">
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                                <input name="firstName" required type="text" onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-700">Nom</label>
                                <input name="lastName" required type="text" onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input name="email" required type="email" onChange={handleChange}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                            <input name="password" required type="password" onChange={handleChange}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" />
                        </div>

                        {error && <div className="text-red-600 text-sm">{error}</div>}

                        <div>
                            <button type="submit" disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                                {loading ? 'Création...' : "S'inscrire Gratuitement"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
