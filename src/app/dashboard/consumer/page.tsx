'use client';

import { useEffect, useState } from 'react';
import { walletService } from '@/modules/wallet/service';
import { identityService } from '@/modules/identity/service';
import { WalletLedgerEntry } from '@/modules/wallet/types';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ConsumerDashboard() {
    const [balance, setBalance] = useState<number>(0);
    const [history, setHistory] = useState<WalletLedgerEntry[]>([]);
    const [activeCoupons, setActiveCoupons] = useState<any[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWalletData = async () => {
            const user = await identityService.getCurrentUserProfile();
            if (user) {
                setUserId(user.id);
                const [bal, hist, coupons] = await Promise.all([
                    walletService.getBalance(user.id),
                    walletService.getHistory(user.id),
                    walletService.getMyCoupons(user.id)
                ]);
                setBalance(bal);
                setHistory(hist);
                // Filter only active for display
                setActiveCoupons(coupons.filter(c => c.status === 'ACTIVE'));
            }
            setLoading(false);
        };
        loadWalletData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center">Chargement de votre portefeuille...</div>;
    }

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto pb-20">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Mon Espace Membre</h1>

            {/* Carte Membre / Solde */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 transform transition-all hover:scale-[1.01] duration-300">
                <div className="bg-gradient-to-r from-blue-700 to-indigo-600 p-8 text-white relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <p className="text-blue-100 font-medium tracking-wide text-sm uppercase mb-1">Solde Disponible</p>
                            <p className="text-5xl font-extrabold tracking-tight">{(balance / 100).toFixed(2).replace('.', ',')} $</p>
                            <p className="text-xs text-blue-200 mt-2">Équivalent à {balance} points</p>
                        </div>
                        {userId && (
                            <div className="bg-white p-2 rounded-xl shadow-lg">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${userId}`}
                                    alt="Mon QR Code Membre"
                                    className="w-32 h-32"
                                />
                            </div>
                        )}
                    </div>
                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                    <span>Membre depuis 2026</span>
                    <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">ID: {userId?.substring(0, 8)}...</span>
                </div>
            </div>

            {/* MES COUPONS ACTIFS */}
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                Mes Coupons Actifs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {activeCoupons.length > 0 ? (
                    activeCoupons.map((coupon) => (
                        <div key={coupon.id} className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col md:flex-row gap-4 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>

                            {/* QR Logic */}
                            <div className="flex-shrink-0 z-10 flex flex-col items-center justify-center bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${coupon.unique_code}`}
                                    alt="QR Coupon"
                                    className="w-24 h-24 md:w-20 md:h-20"
                                />
                                <p className="text-xs font-mono font-bold mt-1 tracking-wider text-gray-600">{coupon.unique_code}</p>
                            </div>

                            <div className="flex-1 z-10">
                                <p className="text-xs font-bold text-blue-600 uppercase mb-1">
                                    {coupon.offer?.merchant?.business_name || 'Commerçant'}
                                </p>
                                <h3 className="font-bold text-gray-900 leading-tight mb-2">
                                    {coupon.offer?.title}
                                </h3>
                                <div className="text-sm bg-gray-50 text-gray-600 p-2 rounded mb-2">
                                    {coupon.offer?.discount_type === 'PERCENTAGE' ? `-${coupon.offer.discount_value}%` :
                                        coupon.offer?.discount_type === 'FIXED_AMOUNT' ? `-${coupon.offer.discount_value}$` : 'Spécial'}
                                </div>
                                <p className="text-xs text-gray-400">
                                    Code à présenter en caisse
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full bg-white p-6 rounded-xl border border-dashed border-gray-300 text-center">
                        <p className="text-gray-500">Vous n'avez aucun coupon actif.</p>
                        <Link href="/offres" className="text-sm text-blue-600 font-bold hover:underline mt-1 block">Explorer les offres</Link>
                    </div>
                )}
            </div>

            {/* Historique */}
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Dernières Transactions
            </h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                {history.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {history.map((entry) => (
                            <div key={entry.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${entry.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {entry.amount > 0 ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{entry.description || (entry.amount > 0 ? 'Points gagnés' : 'Points utilisés')}</p>
                                        <p className="text-xs text-gray-500">{format(new Date(entry.created_at), 'd MMMM yyyy à HH:mm', { locale: fr })}</p>
                                    </div>
                                </div>
                                <div className={`font-bold ${entry.amount > 0 ? 'text-green-600' : 'text-gray-800'}`}>
                                    {entry.amount > 0 ? '+' : ''} {(entry.amount / 100).toFixed(2)} $
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        <p>Aucune transaction récente.</p>
                        <p className="text-sm mt-2">Profitez des offres pour commencer à accumuler des remises !</p>
                    </div>
                )}
            </div>

            <div className="flex justify-center">
                <Link href="/offres" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition">
                    Découvrir les offres locales
                </Link>
            </div>
        </div>
    );
}

