'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { offersService } from '@/modules/offers/service';
import { identityService } from '@/modules/identity/service';
import { Offer } from '@/modules/offers/types';
import { MerchantProfile } from '@/modules/identity/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';

export default function OfferDetailsPage() {
    const params = useParams();
    const offerId = params?.id as string;

    const [offer, setOffer] = useState<Offer | null>(null);
    const [merchant, setMerchant] = useState<MerchantProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffer = async () => {
            if (!offerId) return;

            try {
                const offerData = await offersService.getOfferById(offerId);
                if (offerData) {
                    setOffer(offerData);
                    // Fetch Merchant
                    if (offerData.merchant_id) {
                        const merchantData = await identityService.getMerchantPublicProfile(offerData.merchant_id);
                        setMerchant(merchantData);
                    }
                }
            } catch (error) {
                console.error("Error loading offer details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOffer();
    }, [offerId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Chargement de l'offre...</p>
                </div>
            </div>
        );
    }

    if (!offer) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Offre introuvable 😕</h1>
            <p className="text-gray-500 mb-8 max-w-md text-center">Cette offre n'existe plus ou a été retirée. Découvrez d'autres rabais incroyables dans notre catalogue.</p>
            <Link href="/offres" className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg">
                Retourner aux offres
            </Link>
        </div>
    );

    const [claiming, setClaiming] = useState(false);
    const [isClaimed, setIsClaimed] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleClaim = async () => {
        setClaiming(true);
        setErrorMsg('');

        // Vérifier auth
        const user = await identityService.getCurrentUserProfile();
        if (!user) {
            setErrorMsg("Veuillez vous connecter pour obtenir ce rabais.");
            setClaiming(false);
            return;
        }

        const result = await offersService.claimOffer(offer.id);

        if (result.success) {
            setIsClaimed(true);
            // Trigger Email Sending (Fire and forget, don't block UI)
            if (result.coupon_id) {
                fetch('/api/emails/send-coupon', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ couponId: result.coupon_id })
                }).catch(err => console.error("Failed to send email confirmation", err));
            }
        } else {
            setErrorMsg(result.message || "Erreur inconnue");
        }
        setClaiming(false);
    };

    // Determine discount label
    let discountDisplay = '';
    if (offer.discount_type === 'PERCENTAGE') {
        discountDisplay = `-${offer.discount_value}%`;
    } else if (offer.discount_type === 'FIXED_AMOUNT') {
        discountDisplay = `-${offer.discount_value}$`;
    } else if (offer.discount_type === 'BOGO') {
        discountDisplay = '2 pour 1';
    } else {
        discountDisplay = 'Spécial'; // Default
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Back Link */}
            <div className="max-w-5xl mx-auto pt-8 px-4 sm:px-6">
                <Link href="/offres" className="inline-flex items-center text-gray-500 hover:text-blue-600 transition mb-8 font-medium group">
                    <span className="bg-white p-2 rounded-full shadow-sm mr-2 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </span>
                    Retour au catalogue
                </Link>
            </div>

            <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 mb-10">
                <div className="md:flex min-h-[500px]">
                    {/* Image Section */}
                    <div className="md:w-1/2 bg-gray-100 relative min-h-[300px] md:min-h-full">
                        {offer.image_url ? (
                            <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover absolute inset-0" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-300">
                                <svg className="w-32 h-32 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                        )}

                        {/* Large Badge Overlay */}
                        <div className="absolute top-6 left-6 bg-white/95 backdrop-blur shadow-xl text-red-600 font-black px-6 py-3 rounded-2xl text-2xl transform rotate-[-2deg] border border-gray-100">
                            {discountDisplay}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-between relative bg-white">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[4rem] -z-0"></div>

                        <div className="relative z-10">
                            {/* Merchant Header */}
                            {merchant && (
                                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                                    {merchant.logo_url ? (
                                        <img src={merchant.logo_url} className="w-12 h-12 rounded-full object-cover border border-gray-200" alt={merchant.business_name} />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                            {merchant.business_name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="font-bold text-gray-900">{merchant.business_name || 'Commerce Local'}</h2>
                                        <p className="text-xs text-gray-500">Commerçant vérifié</p>
                                    </div>
                                </div>
                            )}

                            {/* Title & Dates */}
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">{offer.title}</h1>

                            {offer.end_date && (
                                <div className="flex items-center gap-3 mb-6">
                                    {/* Smart Date Display */}
                                    {(() => {
                                        const endDate = new Date(offer.end_date);
                                        const now = new Date();
                                        const diffTime = endDate.getTime() - now.getTime();
                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                        if (diffTime < 0) {
                                            return (
                                                <div className="inline-flex items-center text-sm font-bold text-gray-500 bg-gray-100 px-4 py-2 rounded-full border border-gray-200">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    Offre expirée le {format(endDate, 'dd MMM yyyy', { locale: fr })}
                                                </div>
                                            );
                                        } else if (diffDays <= 3) {
                                            return (
                                                <div className="inline-flex items-center text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded-full animate-pulse border border-red-100">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    Dépêchez-vous ! Expire dans {diffDays} jour{diffDays > 1 ? 's' : ''}
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div className="inline-flex items-center text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    Expire le {format(endDate, 'dd MMMM yyyy', { locale: fr })}
                                                </div>
                                            );
                                        }
                                    })()}
                                </div>
                            )}

                            <div className="h-px bg-gray-100 my-6"></div>

                            {/* Description */}
                            <div className="prose prose-blue text-gray-600 mb-8">
                                <h3 className="text-gray-900 font-bold text-lg mb-2">À propos de cette offre</h3>
                                <p className="leading-relaxed mb-6">{offer.description || "Aucune description détaillée fournie par le commerçant."}</p>

                                {offer.conditions && (
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                        <h4 className="font-bold text-gray-800 text-sm mb-2 flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            Conditions d'utilisation
                                        </h4>
                                        <p className="text-sm text-gray-600 whitespace-pre-line">{offer.conditions}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="pt-6 mt-6 md:mt-0 relative z-10">

                            {/* Cost Display */}
                            <div className="flex items-center justify-between mb-4 bg-amber-50 rounded-lg p-4 border border-amber-100">
                                <span className="text-amber-800 font-medium">Coût pour débloquer :</span>
                                <span className="flex items-center font-bold text-amber-700 text-xl">
                                    <svg className="w-5 h-5 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                                    {offer.credit_cost} Crédit{offer.credit_cost > 1 ? 's' : ''}
                                </span>
                            </div>

                            {!isClaimed ? (
                                <button
                                    onClick={handleClaim}
                                    disabled={claiming}
                                    className={`w-full font-bold py-4 rounded-xl shadow-lg transform transition-all duration-200 flex items-center justify-center gap-2 group ${claiming ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:-translate-y-1'}`}
                                >
                                    {claiming ? (
                                        <span>Traitement...</span>
                                    ) : (
                                        <>
                                            <span className="text-lg">Obtenir ce rabais</span>
                                            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                        </>
                                    )}
                                </button>
                            ) : (
                                <div className="w-full bg-green-100 text-green-800 border border-green-200 font-bold py-4 rounded-xl text-center flex flex-col items-center">
                                    <div className="flex items-center gap-2 mb-1">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        <span>Rabais ajouté !</span>
                                    </div>
                                    <Link href="/dashboard/consumer" className="text-sm underline text-green-700 hover:text-green-900 mt-1">
                                        Voir dans mon portefeuille
                                    </Link>
                                </div>
                            )}

                            {errorMsg && (
                                <p className="text-red-500 text-sm text-center mt-3">{errorMsg}</p>
                            )}

                            {!isClaimed && (
                                <p className="text-center text-xs text-gray-400 mt-4">
                                    En cliquant, le coupon sera ajouté à votre compte. Quantités limitées.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
