'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { onboardingService } from '@/modules/onboarding/service';
import { useRouter } from 'next/navigation';

export default function InscriptionCommercant() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        companyName: '',
        industrySector: '',
        city: '',
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                    data: { role: 'merchant' } // Trigger role 'merchant'
                }
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("Erreur création utilisateur");

            // 2. Création profil Commerçant (Table merchants)
            await onboardingService.createMerchantProfile(authData.user, {
                company_name: formData.companyName,
                industry_sector: formData.industrySector,
                address_city: formData.city
            });

            // 3. Succès
            alert("Compte Entreprise créé !");
            router.push('/test-auth');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    Espace Commerçant
                </h2>
                <p className="mt-2 text-center text-sm text-zinc-400">
                    Rejoignez le réseau RabaisLocal
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-zinc-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-zinc-700">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300">Nom de l&apos;entreprise</label>
                            <input name="companyName" required type="text" onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300">Secteur d&apos;activité</label>
                            <select name="industrySector" onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:ring-green-500 focus:border-green-500 sm:text-sm">
                                <option value="">Sélectionner...</option>
                                <option value="restauration">Restauration</option>
                                <option value="commerce">Commerce de détail</option>
                                <option value="service">Services</option>
                                <option value="sante">Santé / Beauté</option>
                                <option value="autre">Autre</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300">Ville</label>
                            <input name="city" required type="text" onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300">Email professionnel</label>
                            <input name="email" required type="email" onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300">Mot de passe</label>
                            <input name="password" required type="password" onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                        </div>

                        {error && <div className="text-red-400 text-sm">{error}</div>}

                        <div>
                            <button type="submit" disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-zinc-900 bg-green-500 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
                                {loading ? 'Création...' : "Créer mon compte Pro"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
