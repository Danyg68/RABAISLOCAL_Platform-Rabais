'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { offersService } from '@/modules/offers/service';
import { Category, DiscountType } from '@/modules/offers/types';
import { identityService } from '@/modules/identity/service';

export default function CreateOfferPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [discountType, setDiscountType] = useState<DiscountType>('PERCENTAGE');
    const [discountValue, setDiscountValue] = useState('');
    const [description, setDescription] = useState('');
    const [conditions, setConditions] = useState('');

    useEffect(() => {
        // Load categories on mount
        const loadData = async () => {
            const cats = await offersService.getCategories();
            setCategories(cats);
        };
        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const userProfile = await identityService.getCurrentUserProfile();
            if (!userProfile) {
                setError("Impossible de vous identifier. Veuillez vous reconnecter.");
                setLoading(false);
                return;
            }

            // Vérification du statut Commerçant
            // Note: Idéalement, on créerait un helper 'isMerchantValidated()' dans identityService pour réutiliser
            const merchantProfile = await identityService.getMerchantProfile(userProfile.id);
            if (!merchantProfile) {
                setError("Profil commerçant introuvable.");
                setLoading(false);
                return;
            }

            if (merchantProfile.validation_status !== 'VALIDATED') {
                setError("Votre compte est en attente de validation par un administrateur. Vous ne pouvez pas encore publier d'offres.");
                setLoading(false);
                return;
            }

            const numericValue = discountValue ? parseFloat(discountValue) : undefined;

            const { error: apiError } = await offersService.createOffer({
                merchant_id: userProfile.id,
                category_id: categoryId || undefined,
                title,
                description,
                conditions,
                discount_type: discountType,
                discount_value: numericValue,
                is_active: true
            });

            if (apiError) throw apiError;

            // Success, redirect to dashboard
            router.push('/dashboard/merchant');

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Une erreur est survenue lors de la création de l\'offre.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Créer une nouvelle Offre</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Titre de l'offre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'offre</label>
                    <input
                        type="text"
                        required
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: 15% de rabais sur tout le menu"
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
                        placeholder="Détails supplémentaires pour attirer le client..."
                    ></textarea>
                </div>

                {/* Conditions */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Conditions (Optionnel)</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Ex: Valide les lundis seulement, sur place uniquement..."
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
                        disabled={loading}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Création...' : 'Publier l\'offre'}
                    </button>
                </div>
            </form>
        </div>
    );
}
