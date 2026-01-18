# Module 0: Identity & Access

## Description
Ce module gère l'identité des utilisateurs, l'authentification et les contrôles d'accès (RBAC).
Il est découplé du reste de l'application et sert de source de vérité pour "Qui est l'utilisateur ?".

## Responsabilités
- Gestion de la session utilisateur (via Supabase Auth)
- Définition et validation des Rôles (Admin, Commerçant, Consommateur, Ambassadeur)
- Protection des routes et composants
- Gestion du profil de base de l'utilisateur

## Structure
- `types.ts` : Définitions TypeScript partagées pour l'identité.
- `components/` : Composants UI spécifiques à l'auth (Login, Register) - *À venir*.
- `hooks/` : Hooks React pour l'état d'authentification - *À venir*.
- `utils/` : Validateurs et helpers - *À venir*.

## Dépendances
- Supabase Client (`@/lib/supabase`)
