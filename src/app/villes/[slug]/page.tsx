import { cityService } from "@/modules/cities/service";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

interface PageProps {
    params: { slug: string };
}

export async function generateStaticParams() {
    const slugs = await cityService.getAllCitySlugs();
    return slugs.map((slug) => ({
        slug: slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const data = await cityService.getCityBySlug(params.slug);
    if (!data) return { title: "Ville non trouvée" };
    return {
        title: `${data.city.name} - Espace Citoyen`,
        description: data.city.slogan || `Découvrez ${data.city.name} sur RabaisLocal.`,
    };
}

export default async function CityPage({ params }: PageProps) {
    const data = await cityService.getCityBySlug(params.slug);

    if (!data) {
        notFound();
    }

    const { city, news, events, places } = data;

    return (
        <div className="min-h-screen bg-slate-50 font-roboto text-gray-800">
            {/* Header Institutionnel */}
            <header className="bg-white border-b-4 border-[#004d80] py-6 mb-10 shadow-sm">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold text-[#004d80] uppercase tracking-wide">
                            {city.name}
                        </h1>
                        {city.slogan && (
                            <p className="text-lg text-gray-500 font-light mt-1">{city.slogan}</p>
                        )}
                    </div>
                    <div className="bg-slate-100 text-[#004d80] px-4 py-2 rounded border border-gray-200 font-medium text-sm">
                        Espace informationnel citoyen
                    </div>
                </div>
            </header>

            {/* Hero Image */}
            {city.hero_image_url && (
                <div className="w-full h-[300px] md:h-[400px] relative mb-10 bg-gray-200">
                    {/* Note: In production, configure next.config.js for remote images */}
                    <img
                        src={city.hero_image_url}
                        alt={`Vue de ${city.name}`}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Message de Bienvenue */}
            <section className="py-12 bg-slate-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-[#004d80] mb-6 relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-[#0077c8]">
                        Bienvenue
                    </h2>
                    {city.welcome_message && (
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                            {city.welcome_message}
                        </p>
                    )}
                </div>
            </section>

            {/* Actualités */}
            {news.length > 0 && (
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-[#004d80] mb-8 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-[#0077c8]">
                            Actualités & Annonces
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {news.map((item) => (
                                <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    {item.image_url && (
                                        <div className="h-48 w-full relative bg-gray-100">
                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <span className="text-sm font-semibold text-[#0077c8] block mb-2">
                                            {item.date ? new Date(item.date).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Récent'}
                                        </span>
                                        <h3 className="text-xl font-bold text-[#004d80] mb-3">{item.title}</h3>
                                        {item.summary && <p className="text-gray-600 mb-4">{item.summary}</p>}
                                        {item.link_url && (
                                            <a href={item.link_url} target="_blank" className="text-[#004d80] font-medium hover:underline">Lire la suite →</a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Événements */}
            {events.length > 0 && (
                <section className="py-12 bg-slate-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-[#004d80] mb-8 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-[#0077c8]">
                            Festivals & Grands Événements
                        </h2>
                        <div className="space-y-6">
                            {events.map((event) => (
                                <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row border-l-4 border-[#0077c8]">
                                    {event.image_url && (
                                        <div className="w-full md:w-64 h-48 md:h-auto relative bg-gray-200 shrink-0">
                                            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="p-6 flex-1">
                                        <h3 className="text-2xl font-bold text-[#004d80] mb-2">{event.title}</h3>
                                        {event.period && (
                                            <span className="text-lg font-semibold text-gray-800 block mb-3">
                                                📅 {event.period}
                                            </span>
                                        )}
                                        {event.description && <p className="text-gray-600 mb-4">{event.description}</p>}
                                        {event.link_url && (
                                            <a href={event.link_url} target="_blank" className="inline-block bg-[#004d80] text-white px-4 py-2 rounded hover:bg-[#003355] transition-colors">
                                                En savoir plus
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* À Découvrir */}
            {places.length > 0 && (
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-[#004d80] mb-8 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-[#0077c8]">
                            À Découvrir
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {places.map((place) => (
                                <div key={place.id} className="group">
                                    {place.image_url && (
                                        <div className="h-56 w-full rounded-lg overflow-hidden mb-4 relative bg-gray-100">
                                            <img src={place.image_url} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    )}
                                    <h3 className="text-xl font-bold text-[#004d80] mb-2 border-b border-gray-200 pb-2 inline-block w-full">{place.name}</h3>
                                    {place.description && <p className="text-gray-600 mb-3">{place.description}</p>}
                                    {place.website_url && (
                                        <a href={place.website_url} target="_blank" className="text-[#0077c8] font-medium hover:underline">Visiter le site →</a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Économie Locale */}
            <section className="py-16 bg-[#004d80] text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-6 relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-white">
                        Soutenir notre économie locale
                    </h2>
                    <p className="text-lg max-w-3xl mx-auto leading-relaxed opacity-90">
                        Nos commerçants et artisans sont le moteur de notre vitalité économique. En choisissant l'achat local, vous contribuez directement à la prospérité de {city.name}. RabaisLocal offre une vitrine pour découvrir ces richesses.
                    </p>
                </div>
            </section>

            {/* Footer Institutionnel */}
            <footer className="bg-[#222] text-[#aaa] py-12 text-center text-sm">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto border border-[#444] rounded p-4 mb-6">
                        <p>Cette page est une initiative indépendante sur la plateforme RabaisLocal, utilisée comme vitrine informationnelle. Ce n'est pas le site municipal officiel.</p>
                    </div>
                    <p>&copy; {new Date().getFullYear()} Plateforme RabaisLocal - Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
}
