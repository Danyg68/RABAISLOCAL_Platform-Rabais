'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { offersService } from '@/modules/offers/service';
import { identityService } from '@/modules/identity/service';
import { Offer } from '@/modules/offers/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function MerchantDashboard() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<any>(null);

    // Initial Data Load
    useEffect(() => {
        const loadData = async () => {
            try {
                const profile = await identityService.getCurrentUserProfile();
                if (profile) {
                    setUserProfile(profile);
                    const fetchedOffers = await offersService.getMerchantOffers(profile.id);
                    setOffers(fetchedOffers);
                }
            } catch (error) {
                console.error("Error loading dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleDelete = async (offerId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;

        const { error } = await offersService.deleteOffer(offerId);
        if (!error) {
            setOffers(offers.filter(o => o.id !== offerId));
        } else {
            alert('Erreur lors de la suppression');
        }
    };

    if (loading) {
        return <div className="p-8">Chargement...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Tableau de Bord Commerçant</h1>
                <div className="flex gap-3">
                    <Link href="/dashboard/merchant/scan" className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                        Terminal / Scan
                    </Link>
                    <Link href="/dashboard/merchant/offers/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                        + Nouvelle Offre
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-gray-500 text-sm font-medium">Offres Actives</h3>
                    <p className="text-3xl font-bold mt-2">{offers.filter(o => o.is_active).length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-gray-500 text-sm font-medium">Ventes estimées (Placeholder)</h3>
                    <p className="text-3xl font-bold mt-2">0 $</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-gray-500 text-sm font-medium">Rabais utilisés (Placeholder)</h3>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>
            </div>

            {/* Offers List */}
            <h2 className="text-xl font-semibold mb-4">Mes Offres</h2>

            {offers.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-10 text-center">
                    <p className="text-gray-500 mb-4">Vous n'avez aucune offre pour le moment.</p>
                    <Link href="/dashboard/merchant/offers/new" className="text-blue-600 hover:underline">
                        Commencer par créer votre première offre
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer) => (
                        <div key={offer.id} className="bg-white rounded-lg shadow border overflow-hidden flex flex-col">
                            {/* Header / Image Placeholder */}
                            <div className="h-4 bg-blue-600"></div>

                            <div className="p-5 flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs px-2 py-1 rounded-full ${offer.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {offer.is_active ? 'Active' : 'Inactif'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {format(new Date(offer.created_at), 'dd MMM yyyy', { locale: fr })}
                                    </span>
                                </div>

                                <h3 className="font-bold text-lg mb-1">{offer.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                    {offer.description || 'Aucune description'}
                                </p>

                                {offer.discount_value && (
                                    <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-md inline-block text-sm font-medium mb-3">
                                        {offer.discount_type === 'PERCENTAGE' ? `-${offer.discount_value}%` :
                                            offer.discount_type === 'FIXED_AMOUNT' ? `-${offer.discount_value}$` :
                                                offer.discount_type}
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 px-5 py-3 border-t flex justify-between items-center">
                                <Link
                                    href={`/dashboard/merchant/offers/edit/${offer.id}`}
                                    className="text-gray-600 hover:text-blue-600 text-sm font-medium"
                                >
                                    Modifier
                                </Link>
                                <button
                                    onClick={() => handleDelete(offer.id)}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
