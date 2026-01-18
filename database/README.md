# Gestion de la Base de Données

## Structure
- `/migrations` : Fichiers SQL versionnés pour les changements de schéma.
- `/seeds` : Données initiales pour le développement et les tests.
- `/archive` : Anciens fichiers de schéma (backup).

## Convention de Migration
Nous utilisons une approche de "Migration SQL Manuelle" versionnée.

### Format des fichiers
`YYYYMMDD_HHMM_description_courte.sql`

Exemple : `20260117_1200_create_profiles_table.sql`

### Workflow
1. Créer un nouveau fichier `.sql` dans `/migrations`.
2. Écrire le SQL (CREATE TABLE, ALTER TABLE, etc.).
3. Appliquer manuellement via le Dashboard Supabase (SQL Editor) ou via le CLI.
4. Une fois appliqué, ne JAMAIS modifier un fichier de migration existant. Créer une nouvelle migration pour les corrections.

## Initialisation (Module 0)
Les tables de base pour l'identité (profiles, roles) sont définies dans les premières migrations.
