/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true, // Nécessaire car l'export statique ne supporte pas l'optimisation d'image Next.js par défaut
    },
    trailingSlash: true, // Requis pour éviter les erreurs 403 sur Apache (dossier vs fichier)
};

export default nextConfig;
