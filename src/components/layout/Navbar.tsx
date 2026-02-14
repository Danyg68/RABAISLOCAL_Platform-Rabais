"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Renamed function to avoid any conflict
    const getNavLinkClass = (path: string) => {
        return pathname === path ? "text-[#004d80] font-bold" : "text-gray-600 hover:text-[#004d80]";
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-[#004d80]">RabaisLocal</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8">
                        <Link href="/" className={getNavLinkClass("/")}>
                            Accueil
                        </Link>
                        <Link href="/villes" className={getNavLinkClass("/villes")}>
                            Nos Villes
                        </Link>
                        <Link href="/offres" className={getNavLinkClass("/offres")}>
                            Offres
                        </Link>
                        <Link href="/dashboard" className={getNavLinkClass("/dashboard")}>
                            Mon Espace
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="/inscription/commercant"
                            className="text-sm font-medium text-gray-600 hover:text-[#004d80]"
                        >
                            Commerçants
                        </Link>
                        <Link
                            href="/dashboard"
                            className="bg-[#004d80] text-white px-4 py-2 rounded-lg hover:bg-[#003a60] transition-colors"
                        >
                            Connexion
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-md text-gray-600 hover:text-[#004d80] focus:outline-none"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden pb-4">
                        <div className="flex flex-col space-y-3 pt-2">
                            <Link href="/" className={`block px-3 py-2 rounded-md text-base ${getNavLinkClass("/")}`}>
                                Accueil
                            </Link>
                            <Link href="/villes" className={`block px-3 py-2 rounded-md text-base ${getNavLinkClass("/villes")}`}>
                                Nos Villes
                            </Link>
                            <Link href="/offres" className={`block px-3 py-2 rounded-md text-base ${getNavLinkClass("/offres")}`}>
                                Offres
                            </Link>
                            <Link href="/dashboard" className={`block px-3 py-2 rounded-md text-base ${getNavLinkClass("/dashboard")}`}>
                                Mon Espace
                            </Link>
                            <div className="border-t border-gray-100 pt-3 mt-2">
                                <Link
                                    href="/inscription/commercant"
                                    className="block px-3 py-2 rounded-md text-base text-gray-600 hover:text-[#004d80]"
                                >
                                    Espace Commerçant
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="block px-3 py-2 rounded-md text-base text-[#004d80] font-semibold"
                                >
                                    Connexion
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
