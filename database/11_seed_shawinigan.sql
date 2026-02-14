-- 🏙️ MIGRATION : SEEDING SHAWINIGAN (Full Data)
-- Ce script nettoie et réinsère toutes les données complètes de Shawinigan depuis le JSON source.

-- 1. Nettoyage des données existantes pour cette ville (pour éviter les doublons)
DELETE FROM public.city_news WHERE city_id IN (SELECT id FROM public.cities WHERE slug = 'shawinigan');
DELETE FROM public.city_events WHERE city_id IN (SELECT id FROM public.cities WHERE slug = 'shawinigan');
DELETE FROM public.city_places WHERE city_id IN (SELECT id FROM public.cities WHERE slug = 'shawinigan');
DELETE FROM public.cities WHERE slug = 'shawinigan';

-- 2. Insertion de la Ville
INSERT INTO public.cities (slug, name, slogan, welcome_message, hero_image_url)
VALUES (
    'shawinigan',
    'Shawinigan',
    'Là où l''énergie prend forme',
    'Shawinigan est une ville dynamique, fière de son passé industriel et résolument tournée vers l''avenir. Située au cœur de la Mauricie, elle offre un cadre de vie exceptionnel entre nature et urbanité.',
    '/villes/shawinigan/images/hero.jpg'
);

-- 3. Insertion des données liées

-- Actualités
INSERT INTO public.city_news (city_id, title, summary, date, link_url, image_url)
SELECT id, 'Projet de rénovation urbaine', 'Des travaux majeurs débuteront au centre-ville le 1er mai. Ces améliorations visent à revitaliser les espaces publics et moderniser les infrastructures.', '2026-04-15', '#', NULL
FROM public.cities WHERE slug = 'shawinigan';

-- Événements
INSERT INTO public.city_events (city_id, title, period, description, image_url, link_url)
SELECT id, 'Festival de l''Énergie', 'Juillet 2026', 'Célébration annuelle de notre héritage énergétique au Parc de l''Île Melville. Spectacles, animations et feux d''artifice sont au rendez-vous.', '/villes/shawinigan/images/festival.jpg', NULL
FROM public.cities WHERE slug = 'shawinigan';

-- À Visiter (Places)
INSERT INTO public.city_places (city_id, name, description, image_url, website_url)
SELECT id, 'Cité de l''Énergie', 'Un complexe muséal unique incluant une centrale hydroélectrique historique. Montez au sommet de la tour d''observation pour une vue imprenable sur la région.', '/villes/shawinigan/images/cite_energie.jpg', 'https://www.citedelenergie.com'
FROM public.cities WHERE slug = 'shawinigan';
