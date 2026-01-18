# 🚀 Suivi d'Avancement - Plateforme RabaisLocal

Ce document sert de tableau de bord pour suivre le développement modulaire de la plateforme.
Une tâche barrée (~~Tâche~~) est terminée et validée en production.

---

## 🟢 PHASE 1 : Socle & Identité

### 📦 MODULE 0 : Identity & Access (Le Socle)
- [x] **Architecture Projet**
    - [x] Initialisation Next.js + TypeScript + Tailwind
    - [x] Structure de dossiers modulaire (`src/modules`)
    - [x] Configuration Supabase (Client & SSR)
    - [x] Scripts de déploiement (`A_COPIER_SUR_LIKUID`)
- [x] **Base de Données (Identity)**
    - [x] Table `profiles` (reliée à `auth.users`)
    - [x] Gestion des Rôles (Admin, Commerçant, Consommateur, Ambassadeur)
    - [x] Triggers automatiques à l'inscription
- [x] **Fonctionnalités**
    - [x] Service d'authentification (`identityService`)
    - [x] Page de test de connexion (`/test-auth`)
    - [x] Déploiement initial sur Likuid (Validation 403/htaccess)

---

## 🟡 PHASE 2 : Onboarding & Tableaux de Bord (EN COURS)

### 📦 MODULE 1 : Inscription & Onboarding (Terminé V1)
- [x] **Base de Données**
    - [x] Tables `merchants` et `consumers` créées
    - [x] Policies RLS (Sécurité) activées et corrigées
- [x] **Inscription Commerçant**
    - [x] Formulaire multi-étapes (Infos entreprise, Contact) (V1 Basique)
    - [x] Création profil robuste (Anti-Race Condition)
    - [ ] Upload de Logo/Images (Futur)
- [x] **Inscription Consommateur**
    - [x] Formulaire simple
    - [x] Création profil robuste
    - [ ] Création du Wallet (Portefeuille) initial (Module 4)
- [ ] **Inscription Ambassadeur**
    - [ ] Formulaire spécifique (Synchro GoAffPro à venir)

### 📦 MODULE 2 : Tableaux de Bord (Dashboards) (EN COURS)
- [x] **Layouts & Routing**
    - [x] Routing intelligent (`/dashboard` redirige selon le rôle)
    - [x] Correction 403 Apache (`trailingSlash: true`)
- [x] **Dashboard Commerçant**
    - [x] Vue d'ensemble V1 (Stats placeholder)
    - [x] Bouton d'accès création d'offre
- [x] **Dashboard Consommateur**
    - [x] Vue Solde V1
    - [x] Placeholder QR Code
- [ ] **Dashboard Admin**
    - [ ] Vue globale des utilisateurs

---

## 🔴 PHASE 3 : Cœur du Métier (Rabais & Transactions)

### 📦 MODULE 3 : Gestion des Offres (Rabais) (PROCHAINE ÉTAPE)
- [ ] **Base de Données**
    - [ ] Tables `offers`, `categories`, `offer_images`
- [ ] **Gestion Commerçant**
    - [ ] Créer / Modifier / Supprimer une offre
    - [ ] Définir les règles (%, montant, conditions)
- [ ] **Catalogue Public**
    - [ ] Page de recherche / Filtres
    - [ ] Page détail d'une offre

### 📦 MODULE 4 : Transactions & Wallet
- [ ] **Base de Données**
    - [ ] Tables `transactions`, `wallet_ledger`
- [ ] **Le Système de Scan**
    - [ ] Scanner QR Code (Côté Commerçant)
    - [ ] Validation de transaction
- [ ] **Mouvements financiers**
    - [ ] Crédit de points
    - [ ] Débit/Utilisation de rabais

---

## ⚫ PHASE 4 : Optimisations & Lancement

### 📦 MODULE 5 : Administration Avancée
- [ ] Validation manuelle des Commerçants
- [ ] Gestion des litiges

### 📦 MODULE 6 : Notifications & Emails
- [ ] Emails transactionnels (Bienvenue, Confirmation achat)
- [ ] Notifications in-app

---

## ⚠️ NOTES TECHNIQUES & CONFIGURATION

### Supabase / Authentification
- **Confirm Email** : DÉSACTIVÉ (Disabled) pour le développement afin de faciliter les tests.
  - *Note* : À RÉACTIVER impérativement avant le lancement grand public si on veut valider les emails.
- **RLS Policies** : Les policies sur `profiles`, `merchants`, `consumers` sont configurées pour permettre aux utilisateurs authentifiés de créer leur propre ligne (INSERT with `auth.uid() = id`).
