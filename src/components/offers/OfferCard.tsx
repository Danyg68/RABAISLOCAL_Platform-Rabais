'use client';

import { Offer } from '@/modules/offers/types';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OfferCardProps {
    offer: Offer;
}

export default function OfferCard({ offer }: OfferCardProps) {
    // Determine discount label
    let discountLabel = '';
    if (offer.discount_type === 'PERCENTAGE') {
        discountLabel = `-${offer.discount_value}%`;
    } else if (offer.discount_type === 'FIXED_AMOUNT') {
        discountLabel = `-${offer.discount_value}$`;
    } else if (offer.discount_type === 'BOGO') {
        discountLabel = '2 pour 1';
    } else {
        discountLabel = 'Special';
    }

    return (
        <Link href={`/offres/${offer.id}`} className="group block h-full">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col transform hover:-translate-y-1">
                {/* Image Section */}
                <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {offer.image_url ? (
                        <img
                            src={offer.image_url}
                            alt={offer.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                        </div>
                    )}
                    {/* Discount Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-red-600 font-extrabold px-4 py-1.5 rounded-full text-sm shadow-sm ring-1 ring-red-100">
                        {discountLabel}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 uppercase tracking-wide">
                            Offre
                        </span>
                        {offer.end_date && (
                            <span className="text-xs text-gray-500">
                                Expire le {format(new Date(offer.end_date), 'dd MMM', { locale: fr })}
                            </span>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {offer.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-3 mb-5 flex-1 leading-relaxed">
                        {offer.description || 'Découvrez cette offre exclusive et économisez dès maintenant.'}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800">
                            Voir l'offre
                        </span>
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
