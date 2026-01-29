'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/modules/admin/service';
import { identityService } from '@/modules/identity/service';
import { MerchantProfile } from '@/modules/identity/types';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
    const router = useRouter();
    const [merchants, setMerchants] = useState<MerchantProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Initial Load & Auth Check
    useEffect(() => {
        const checkAuthAndLoad = async () => {
            const user = await identityService.getCurrentUserProfile();

            if (!user || user.role !== 'admin') {
                // Redirection si pas admin (Sécurité Frontend)
                router.push('/dashboard');
                return;
            }

            loadMerchants();
        };
        checkAuthAndLoad();
    }, [router]);

    const loadMerchants = async () => {
        setLoading(true);
        const data = await adminService.getAllMerchants();
        setMerchants(data);
        setLoading(false);
    };

    const handleStatusUpdate = async (merchantId: string, status: 'VALIDATED' | 'REJECTED') => {
        setActionLoading(merchantId);
        const { success } = await adminService.updateMerchantStatus(merchantId, status);
        if (success) {
            // Optimistic update or reload
            setMerchants(prev => prev.map(m =>
                m.id === merchantId ? { ...m, validation_status: status } : m
            ));
        } else {
            alert("Erreur lors de la mise à jour.");
        }
        setActionLoading(null);
    };

    if (loading) {
        return <div className="p-10 text-center">Chargement Administration...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Administration Des Commerçants</h1>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Mode Super-Admin</span>
                </div>

                {/* KPI Rapide */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm">En attente de validation</p>
                        <p className="text-3xl font-bold text-amber-500">
                            {merchants.filter(m => m.validation_status === 'PENDING').length}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm">Commerçants Validés</p>
                        <p className="text-3xl font-bold text-green-600">
                            {merchants.filter(m => m.validation_status === 'VALIDATED').length}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm">Total Inscrits</p>
                        <p className="text-3xl font-bold text-blue-600">{merchants.length}</p>
                    </div>
                </div>

                {/* LISTE */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h2 className="font-bold text-gray-700">Liste des demandes d'inscription</h2>
                    </div>

                    {merchants.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">Aucun commerçant inscrit pour le moment.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                                    <tr>
                                        <th className="px-6 py-3">Entreprise</th>
                                        <th className="px-6 py-3">Contact</th>
                                        <th className="px-6 py-3">Date Inscription</th>
                                        <th className="px-6 py-3">Statut</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {merchants.map((merchant) => (
                                        <tr key={merchant.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{merchant.business_name}</div>
                                                <div className="text-xs text-gray-400">{merchant.id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">{merchant.phone || 'N/A'}</div>
                                                <a href={`http://${merchant.website}`} target="_blank" className="text-xs text-blue-500 hover:underline">{merchant.website}</a>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {/* Use created_at if available in merchant profile, else placeholder */}
                                                Récemment
                                                {/* Note: created_at n'est pas dans MerchantProfile par defaut, il faudrait le join avec Auth ou l'ajouter. 
                                                    Pour l'instant, on laisse statique ou on ajoutera la colonne plus tard. */}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                                    ${merchant.validation_status === 'VALIDATED' ? 'bg-green-100 text-green-700' :
                                                        merchant.validation_status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                            'bg-amber-100 text-amber-700'}`}>
                                                    {merchant.validation_status || 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                {merchant.validation_status !== 'VALIDATED' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(merchant.id, 'VALIDATED')}
                                                        disabled={actionLoading === merchant.id}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                                                    >
                                                        Valider
                                                    </button>
                                                )}
                                                {merchant.validation_status !== 'REJECTED' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(merchant.id, 'REJECTED')}
                                                        disabled={actionLoading === merchant.id}
                                                        className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm disabled:opacity-50"
                                                    >
                                                        Rejeter
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
