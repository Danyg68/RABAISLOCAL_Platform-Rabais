# Gestion des Pages de Villes

Ce répertoire contient la structure modulaire pour les pages de villes sur RabaisLocal.

## Architecture
Chaque ville possède son propre dossier contenant :
- `index.html` : Le template générique (identique pour toutes les villes).
- `data.json` : Les données spécifiques à la ville (textes, images, événements).
- `images/` : Dossier pour les assets locaux.

## Comment ajouter une nouvelle ville

1. **Copier le dossier** d'une ville existante (ex: `trois-rivieres`).
2. **Renommer le dossier** avec le nom de la nouvelle ville (ex: `shawinigan`).
   - Chemin final : `/public/villes/shawinigan/`
3. **Modifier le fichier `data.json`** :
   - Mettre à jour le nom de la ville, le slogan, les images.
   - Ajouter les nouvelles actualités et événements.
4. **Remplacer les images** dans le dossier `images/` si nécessaire.

Le fichier `index.html` ne doit **jamais** être modifié pour une ville spécifique. Si vous devez changer la structure, modifiez le template et répliquez-le partout.
