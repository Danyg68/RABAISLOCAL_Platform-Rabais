-- 🏙️ MIGRATION : SEEDING TROIS-RIVIÈRES (Full Data)
-- Ce script nettoie et réinsère toutes les données complètes de Trois-Rivières depuis le JSON source.

-- 1. Nettoyage des données existantes pour cette ville (pour éviter les doublons)
DELETE FROM public.city_news WHERE city_id IN (SELECT id FROM public.cities WHERE slug = 'trois-rivieres');
DELETE FROM public.city_events WHERE city_id IN (SELECT id FROM public.cities WHERE slug = 'trois-rivieres');
DELETE FROM public.city_places WHERE city_id IN (SELECT id FROM public.cities WHERE slug = 'trois-rivieres');
DELETE FROM public.cities WHERE slug = 'trois-rivieres';

-- 2. Insertion de la Ville
WITH new_city AS (
  INSERT INTO public.cities (slug, name, slogan, welcome_message, hero_image_url)
  VALUES (
    'trois-rivieres',
    'Trois-Rivières',
    'Une ville vivante, fière et rassembleuse',
    'Trois-Rivières est une ville d''histoire et de culture, où la qualité de vie est au cœur de nos priorités. Nous sommes fiers de collaborer avec des initiatives locales comme RabaisLocal. Pour toute information officielle, visitez notre site : <a href=''https://www.v3r.net/'' target=''_blank'' style=''color:#004d80; font-weight:bold;''>v3r.net</a>.',
    '/villes/trois-rivieres/images/hero.jpg'
  )
  RETURNING id
)

-- 3. Insertion des données liées (via une série d'CTE ou insertion directe avec subquery)
-- (Comme PostgreSQL ne permet pas facilement de réutiliser `new_city` dans plusieurs INSERT séparés sans transaction bloquante complexe dans un script simple, on va utiliser une variable transactionnelle ou une subquery simple)

INSERT INTO public.city_news (city_id, title, summary, date, link_url, image_url)
SELECT id, 'Avis aux citoyens : Collecte des feuilles', 'La collecte des feuilles mortes débutera le 15 octobre. Consultez le calendrier pour votre secteur.', '2026-10-01', '#', NULL
FROM public.cities WHERE slug = 'trois-rivieres';

INSERT INTO public.city_news (city_id, title, summary, date, link_url, image_url)
SELECT id, 'Communiqué : Nouveaux aménagements cyclables', 'La ville investit dans 15km de nouvelles pistes cyclables pour favoriser la mobilité active.', '2026-09-20', '#', NULL
FROM public.cities WHERE slug = 'trois-rivieres';

INSERT INTO public.city_news (city_id, title, summary, date, link_url, image_url)
SELECT id, 'Séance du conseil municipal', 'La prochaine séance publique aura lieu le mardi 6 octobre à 19h à l''hôtel de ville.', '2026-09-15', '#', NULL
FROM public.cities WHERE slug = 'trois-rivieres';


-- Événements
INSERT INTO public.city_events (city_id, title, period, description, image_url, link_url)
SELECT id, 'Festivoix de Trois-Rivières', '26 juin - 6 juillet 2026', 'L''événement culturel et festif incontournable de la Mauricie ! 9 jours de musique, 350+ artistes, et une ambiance unique au cœur du quartier historique et sur le bord du fleuve.', '/villes/trois-rivieres/images/festivoix.jpg', 'https://festivoix.com'
FROM public.cities WHERE slug = 'trois-rivieres';

INSERT INTO public.city_events (city_id, title, period, description, image_url, link_url)
SELECT id, 'Série Hommage - Cirque du Soleil', 'Juillet - Août 2026', 'Un spectacle exclusif et grandiose créé pour l''Amphithéâtre Cogeco, célébrant les légendes de la musique québécoise.', '/villes/trois-rivieres/images/amphitheatre.jpg', 'https://www.amphitheatrecogeco.com/'
FROM public.cities WHERE slug = 'trois-rivieres';

INSERT INTO public.city_events (city_id, title, period, description, image_url, link_url)
SELECT id, 'Activités du 400ᵉ anniversaire', 'Toute l''année 2034', 'Une programmation exceptionnelle pour célébrer 4 siècles d''histoire.', '/villes/trois-rivieres/images/400e.jpg', NULL
FROM public.cities WHERE slug = 'trois-rivieres';


-- À Visiter (Places)
INSERT INTO public.city_places (city_id, name, description, image_url, website_url)
SELECT id, 'Amphithéâtre Cogeco', 'Une salle de spectacle extérieure de classe mondiale située au confluent de la rivière Saint-Maurice et du fleuve Saint-Laurent. Un joyau architectural à découvrir.', '/villes/trois-rivieres/images/amphitheatre_archi.jpg', 'https://www.amphitheatrecogeco.com/'
FROM public.cities WHERE slug = 'trois-rivieres';

INSERT INTO public.city_places (city_id, name, description, image_url, website_url)
SELECT id, 'Vieux-Trois-Rivières', 'Le cœur historique de la ville, avec ses bâtiments d''époque, ses musées, le Manoir Boucher de Niverville et ses galeries d''art. Une promenade inoubliable.', '/villes/trois-rivieres/images/vieux_tr.jpg', 'https://www.tourismetroisrivieres.com/fr/quoi-faire/vieux-trois-rivieres'
FROM public.cities WHERE slug = 'trois-rivieres';

INSERT INTO public.city_places (city_id, name, description, image_url, website_url)
SELECT id, 'Sanctuaire Notre-Dame-du-Cap', 'Un lieu de recueillement et de beauté architecturale, accueillant des pèlerins du monde entier dans ses magnifiques jardins sur le bord du fleuve.', '/villes/trois-rivieres/images/sanctuaire.jpg', 'https://www.sanctuaire-ndc.ca/'
FROM public.cities WHERE slug = 'trois-rivieres';

INSERT INTO public.city_places (city_id, name, description, image_url, website_url)
SELECT id, 'Île Saint-Quentin', 'Nature et détente à quelques minutes du centre-ville : plage, sentiers, camping et activités familiales au milieu de la rivière Saint-Maurice.', '/villes/trois-rivieres/images/ile_st_quentin.jpg', 'https://www.ilesaintquentin.com/'
FROM public.cities WHERE slug = 'trois-rivieres';
