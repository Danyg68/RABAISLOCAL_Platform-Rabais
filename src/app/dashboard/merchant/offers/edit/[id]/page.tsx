'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { offersService } from '@/modules/offers/service';
import { Category, DiscountType } from '@/modules/offers/types';
import { identityService } from '@/modules/identity/service';

export default function EditOfferPage() {
    const router = useRouter();
    const params = useParams();
    const offerId = params.id as string;

    // UI State
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [discountType, setDiscountType] = useState<DiscountType>('PERCENTAGE');
    const [discountValue, setDiscountValue] = useState('');
    const [description, setDescription] = useState('');
    const [conditions, setConditions] = useState('');
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // 1. Verify Authentication & Ownership
                const userProfile = await identityService.getCurrentUserProfile();
                if (!userProfile) {
                    router.push('/test-auth'); // Redirect to login
                    return;
                }

                // 2. Fetch Categories
                const cats = await offersService.getCategories();
                setCategories(cats);

                // 3. Fetch Offer Details
                const offer = await offersService.getOfferById(offerId);

                if (!offer) {
                    setError("Offre introuvable.");
                    return;
                }

                if (offer.merchant_id !== userProfile.id) {
                    setError("Vous n'avez pas la permission de modifier cette offre.");
                    return;
                }

                // 4. Populate Form
                setTitle(offer.title);
                setCategoryId(offer.category_id || '');
                setDiscountType(offer.discount_type);
                setDiscountValue(offer.discount_value?.toString() || '');
                setDescription(offer.description || '');
                setConditions(offer.conditions || '');
                setIsActive(offer.is_active);

            } catch (err) {
                console.error(err);
                setError("Erreur lors du chargement des données.");
            } finally {
                setLoadingData(false);
            }
        };

        if (offerId) {
            loadInitialData();
        }
    }, [offerId, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const numericValue = discountValue ? parseFloat(discountValue) : undefined;

            const { error: apiError } = await offersService.updateOffer(offerId, {
                title,
                category_id: categoryId || undefined,
                description,
                conditions,
                discount_type: discountType,
                discount_value: numericValue,
                is_active: isActive
            });

            if (apiError) throw apiError;

            // Success
            router.push('/dashboard/merchant');

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Une erreur est survenue lors de la mise à jour.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingData) return <div className="p-8">Chargement de l'offre...</div>;

    if (error && !submitting) { // Show error if persistent state error
        return (
            <div className="p-8 max-w-2xl mx-auto">
                <div className="bg-red-50 text-red-600 p-4 rounded mb-4 border border-red-200">
                    {error}
                </div>
                <button onClick={() => router.back()} className="text-blue-600 hover:underline">
                    Retour
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Modifier l'Offre</h1>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Statut (Actif / Inactif) */}
                <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="h-5 w-5 text-blue-600"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                        Offre active (visible par les clients)
                    </label>
                </div>

                {/* Titre de l'offre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'offre</label>
                    <input
                        type="text"
                        required
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* Catégorie */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <select
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Type de Rabais & Valeur */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type de Rabais</label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={discountType}
                            onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                        >
                            <option value="PERCENTAGE">Pourcentage (%)</option>
                            <option value="FIXED_AMOUNT">Montant Fixe ($)</option>
                            <option value="BOGO">2 pour 1 (BOGO)</option>
                            <option value="SPECIAL">Offre Spéciale</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valeur</label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.5"
                                className="w-full border border-gray-300 rounded-md p-2"
                                placeholder={discountType === 'PERCENTAGE' ? '15' : '10.00'}
                                value={discountValue}
                                onChange={(e) => setDiscountValue(e.target.value)}
                                disabled={discountType === 'BOGO' || discountType === 'SPECIAL'}
                            />
                            {discountType === 'PERCENTAGE' && (
                                <span className="absolute right-3 top-2 text-gray-500">%</span>
                            )}
                            {discountType === 'FIXED_AMOUNT' && (
                                <span className="absolute right-3 top-2 text-gray-500">$</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description courte (Optionnel)</label>
                    <textarea
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                {/* Conditions */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Conditions (Optionnel)</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2"
                        value={conditions}
                        onChange={(e) => setConditions(e.target.value)}
                    />
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {submitting ? 'Enregistrement...' : 'Mettre à jour'}
                    </button>
                </div>
            </form>
        </div>
    );
}
