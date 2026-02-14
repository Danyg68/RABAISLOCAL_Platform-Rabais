import { cityService } from "@/modules/cities/service";
import CitiesList from "@/modules/cities/components/CitiesList";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Nos Villes - RabaisLocal",
    description: "Découvrez les villes participantes et leurs actualités locales sur la plateforme RabaisLocal.",
};

export default async function CitiesIndexPage() {
    // Note: This is executed on the server, so 'cities' is fetched initially
    // and passed to the client component for interactive filtering.
    const cities = await cityService.getAllCities();

    return (
        <div className="min-h-screen bg-slate-50 font-roboto text-gray-800 py-12">
            <header className="mb-8 text-center px-4">
                <h1 className="text-4xl font-bold text-[#004d80] mb-4">
                    Nos Villes Partenaires
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Retrouvez toute l'actualité, les événements et les lieux incontournables de nos villes membres.
                </p>
            </header>

            <CitiesList cities={cities} />
        </div>
    );
}
