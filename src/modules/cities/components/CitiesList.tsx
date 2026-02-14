"use client";

import { useState } from "react";
import Link from "next/link";
import { City } from "@/modules/cities/types";

interface CitiesListProps {
    cities: City[];
}

export default function CitiesList({ cities }: CitiesListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCities = cities.filter((city) => {
        const query = searchQuery.toLowerCase();
        return (
            city.name.toLowerCase().includes(query) ||
            (city.slogan && city.slogan.toLowerCase().includes(query))
        );
    });

    return (
        <div className="container mx-auto px-4">
            {/* Barre de Recherche */}
            <div className="mb-10 max-w-xl mx-auto relative">
                <input
                    type="text"
                    placeholder="Rechercher une ville..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#004d80] text-lg text-gray-700 bg-white"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    🔍
                </div>
            </div>

            {/* État Vide */}
            {filteredCities.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
                    <p className="text-xl text-gray-500">Aucune ville ne correspond à votre recherche.</p>
                </div>
            ) : (
                /* Grille de Villes */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCities.map((city) => (
                        <Link
                            key={city.id}
                            href={`/villes/${city.slug}`}
                            className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 transform hover:-translate-y-1"
                        >
                            <div className="h-48 w-full relative bg-gray-200 overflow-hidden">
                                {city.hero_image_url ? (
                                    <img
                                        src={city.hero_image_url}
                                        alt={`Vue de ${city.name}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                        <span className="text-3xl">🏙️</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h2 className="text-2xl font-bold drop-shadow-md">{city.name}</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                {city.slogan ? (
                                    <p className="text-gray-600 mb-4 h-12 overflow-hidden line-clamp-2 italic">
                                        "{city.slogan}"
                                    </p>
                                ) : (
                                    <p className="text-gray-400 mb-4 h-12 flex items-center italic text-sm">
                                        Découvrez cette ville...
                                    </p>
                                )}
                                <span className="inline-block text-[#004d80] font-semibold group-hover:text-[#0077c8] group-hover:underline">
                                    Visiter l'espace citoyen →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
