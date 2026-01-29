'use client';

import { useEffect, useState } from 'react';
import { offersService } from '@/modules/offers/service';
import { Offer, Category } from '@/modules/offers/types';
import OfferCard from '@/components/offers/OfferCard';

export default function OffersPage() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [offersData, categoriesData] = await Promise.all([
                    offersService.getPublicOffers(),
                    offersService.getCategories()
                ]);
                setOffers(offersData);
                setCategories(categoriesData);
            } catch (error) {
                console.error("Failed to load offers", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // Filter Logic
    const filteredOffers = offers.filter(offer => {
        const matchesCategory = selectedCategory === 'all' || offer.category_id === selectedCategory;
        const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (offer.description?.toLowerCase()?.includes(searchQuery.toLowerCase()) ?? false);
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Hero Section */}
            <div className="bg-blue-900 text-white pt-24 pb-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                        Économisez Localement
                    </h1>
                    <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-10 font-light">
                        Découvrez les meilleures offres exclusives de vos commerçants préférés.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute inset-0 bg-blue-400 blur opacity-25 group-hover:opacity-40 transition-opacity rounded-full"></div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Rechercher une offre, un commerce..."
                                className="w-full pl-14 pr-6 py-4 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-2xl text-lg transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <svg className="w-6 h-6 text-gray-400 absolute left-5 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories & Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">

                {/* Category Filters */}
                <div className="bg-white rounded-xl shadow-lg p-3 mb-12 overflow-x-auto flex space-x-3 no-scrollbar border border-gray-100">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`whitespace-nowrap px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${selectedCategory === 'all' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                        Toutes les offres
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`whitespace-nowrap px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                        >
                            {cat.icon_name} {cat.name}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-80 bg-gray-200 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-700 text-sm py-1 px-3 rounded-full font-bold">{filteredOffers.length}</span>
                                Offres disponibles
                            </h2>
                        </div>

                        {filteredOffers.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {filteredOffers.map(offer => (
                                    <OfferCard key={offer.id} offer={offer} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                                <div className="inline-block p-6 rounded-full bg-blue-50 mb-4">
                                    <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune offre trouvée</h3>
                                <p className="text-gray-500 max-w-md mx-auto">Nous n'avons trouvé aucune offre correspondant à vos critères. Essayez une autre catégorie ou un autre terme de recherche.</p>
                                <button
                                    onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                                    className="mt-6 px-6 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    Effacer les filtres
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
