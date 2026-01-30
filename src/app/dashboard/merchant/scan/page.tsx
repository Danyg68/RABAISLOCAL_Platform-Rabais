'use client';

import { useState, useEffect } from 'react';
import { identityService } from '@/modules/identity/service';
import { walletService } from '@/modules/wallet/service';
import { offersService } from '@/modules/offers/service';
import { UserProfile } from '@/modules/identity/types';
import { useRouter } from 'next/navigation';

export default function TerminalPage() {
    const router = useRouter();
    const [scannedId, setScannedId] = useState('');
    const [customer, setCustomer] = useState<UserProfile | null>(null);
    const [customerBalance, setCustomerBalance] = useState<number>(0);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Etape 1: Simuler le Scan (Recherche par ID)
    // Etape 1: Simuler le Scan (Recherche par ID)
    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        // Récupérer le merchant ID (current user)
        const merchant = await identityService.getCurrentUserProfile();
        if (!merchant) {
            setError("Session expirée, veuillez vous reconnecter.");
            setLoading(false);
            return;
        }

        try {
            // Appel direct à redeemCoupon qui scanne ET valide
            const result = await offersService.redeemCoupon(scannedId, merchant.id);

            if (result.success) {
                setSuccess(true);
                // @ts-ignore - On stocke les infos de l'offre dans 'customer' temporairement pour l'affichage
                setCustomer(result);

                // Trigger Email Notification (Background)
                fetch('/api/emails/coupon-redeemed', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ couponId: scannedId })
                }).catch(err => console.error("Failed to send redemption email", err));
            } else {
                setError(result.message || 'Code invalide ou erreur inconnue.');
                setCustomer(null);
            }
        } catch (err) {
            setError('Erreur technique lors du scan.');
        } finally {
            setLoading(false);
        }
    };

    // NOTA: HandleTransaction n'est plus utilisé car la validation est immédiate.

    // Etape 2: Valider la Transaction
    const handleTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customer || !amount) return;

        setLoading(true);
        const billAmount = parseFloat(amount);
        const billCents = Math.round(billAmount * 100);

        // Logique de points simple (1$ = 10 pts)
        const pointsEarned = Math.round(billAmount * 10);

        // Récupérer le merchant ID (current user)
        const merchant = await identityService.getCurrentUserProfile();
        if (!merchant) {
            setError("Session expirée");
            return;
        }

        const { error } = await walletService.createTransaction({
            merchant_id: merchant.id,
            consumer_id: customer.id,
            bill_amount_cents: billCents,
            points_earned: pointsEarned,
            points_redeemed: 0, // Pas de redemption pour l'instant dans cette V1
            status: 'COMPLETED',
            type: 'EARN'
        });

        if (error) {
            setError("Erreur lors de la transaction: " + error.message);
        } else {
            setSuccess(true);
            setAmount('');
            setScannedId('');
            setCustomer(null); // Reset pour le prochain client
            setTimeout(() => setSuccess(false), 5000); // Hide success message after 5s
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                Terminal de Vente
            </h1>

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 animate-bounce">
                    <strong className="font-bold">Succès! </strong>
                    <span className="block sm:inline">Transaction enregistrée et points envoyés.</span>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <strong className="font-bold">Erreur: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {/* SCANNER SECTION */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Scanner le CODE DU COUPON
                </label>
                <form onSubmit={handleScan} className="flex gap-2">
                    <input
                        type="text"
                        value={scannedId}
                        onChange={(e) => setScannedId(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono text-lg"
                        placeholder="Ex: RABAIS-XH52"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                    >
                        {loading ? '...' : 'Valider'}
                    </button>
                </form>
                <p className="text-xs text-gray-400 mt-2">
                    Entrez le code unique présent sur le coupon du client pour le valider.
                </p>
            </div>

            {/* RESULT SECTION */}
            {success && customer && (
                <div className="mt-8 bg-white rounded-xl shadow-xl overflow-hidden border border-green-100 animate-fade-in-up">
                    <div className="bg-green-600 p-4 text-white flex items-center justify-between">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Coupon Valide & Utilisé
                        </h3>
                        <span className="text-xs bg-green-700 px-2 py-1 rounded text-green-100 font-mono">{scannedId}</span>
                    </div>
                    <div className="p-6 text-center">
                        <p className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-2">Offre appliquée</p>
                        <h2 className="text-2xl font-black text-gray-800 leading-tight mb-4">
                            { // @ts-ignore 
                                customer.offer_title || 'Offre Spéciale'}
                        </h2>

                        <div className="inline-block bg-green-50 text-green-700 px-6 py-3 rounded-full font-bold text-xl mb-6 border border-green-100">
                            { // @ts-ignore
                                customer.discount_type === 'PERCENTAGE' ? `-${customer.discount_value}%` :
                                    // @ts-ignore
                                    customer.discount_type === 'FIXED_AMOUNT' ? `-${customer.discount_value}$` : 'Rabais Appliqué'}
                        </div>

                        <button
                            onClick={() => {
                                setSuccess(false);
                                setCustomer(null);
                                setScannedId('');
                            }}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-lg transition"
                        >
                            Scanner un autre coupon
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
