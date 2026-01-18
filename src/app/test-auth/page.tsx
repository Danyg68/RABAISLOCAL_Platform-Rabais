'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { identityService } from '@/modules/identity/service';
import { UserProfile } from '@/modules/identity/types';

export default function TestAuthPage() {
    const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');

    const supabase = createClient();

    useEffect(() => {
        checkConnection();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function checkConnection() {
        try {
            // Simple ping to check if we can talk to Supabase
            const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

            if (error && error.code !== 'PGRST116') { // Ignore "no rows" errors if table empty context
                console.error('Connection error:', error);
                setStatus('error');
            } else {
                setStatus('connected');
            }

            // Check current user
            const userProfile = await identityService.getCurrentUserProfile();
            setProfile(userProfile);
        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    }

    async function handleSignUp() {
        setMsg('Inscription en cours...');
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    role: 'consumer' // Default role for test
                }
            }
        });

        if (error) setMsg('Erreur: ' + error.message);
        else setMsg('Inscription réussie ! Vérifiez vos emails (si confirm activé) ou le profil ci-dessous.');

        checkConnection();
    }

    async function handleSignIn() {
        setMsg('Connexion en cours...');
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) setMsg('Erreur: ' + error.message);
        else {
            setMsg('Connecté !');
            checkConnection();
        }
    }

    async function handleSignOut() {
        await supabase.auth.signOut();
        setProfile(null);
        setMsg('Déconnecté.');
    }

    return (
        <div className="p-8 max-w-2xl mx-auto font-sans">
            <h1 className="text-2xl font-bold mb-6">Test Module 0: Identity & Access</h1>

            {/* 1. Connection Status */}
            <div className={`p-4 rounded-md mb-6 ${status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Statut Connexion Supabase : <strong>{status.toUpperCase()}</strong>
            </div>

            {/* 2. Auth Actions */}
            <div className="border p-6 rounded-md mb-6 bg-white shadow-sm text-black">
                <h2 className="text-lg font-semibold mb-4">Test Authentification</h2>

                {!profile ? (
                    <div className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email test"
                            className="border p-2 w-full rounded text-black"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            className="border p-2 w-full rounded text-black"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <button onClick={handleSignIn} className="bg-blue-600 text-white px-4 py-2 rounded">
                                Se Connecter
                            </button>
                            <button onClick={handleSignUp} className="bg-green-600 text-white px-4 py-2 rounded">
                                S&apos;inscrire (Nouveau)
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="mb-4">Connecté en tant que : <strong>{profile.email}</strong></p>
                        <button onClick={handleSignOut} className="bg-gray-600 text-white px-4 py-2 rounded">
                            Se Déconnecter
                        </button>
                    </div>
                )}

                {msg && <p className="mt-4 text-sm font-medium text-blue-800">{msg}</p>}
            </div>

            {/* 3. User Profile Data */}
            <div className="border p-6 rounded-md bg-gray-50 text-black">
                <h2 className="text-lg font-semibold mb-2">Données Profil (DB)</h2>
                <pre className="bg-black text-white p-4 rounded text-xs overflow-auto">
                    {profile ? JSON.stringify(profile, null, 2) : 'Aucun profil chargé.'}
                </pre>
            </div>
        </div>
    );
}
