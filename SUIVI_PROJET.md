
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
    - [x] Vue Solde V1 (Connectée au Wallet)
    - [x] QR Code Membre (Dynamique)
    - [x] Historique des transactions
- [ ] **Dashboard Admin**
    - [ ] Vue globale des utilisateurs

---

## 🔴 PHASE 3 : Cœur du Métier (Rabais & Transactions)

### 📦 MODULE 3 : Gestion des Offres (Terminé)
- [x] **Base de Données**
    - [x] Tables `offers`, `categories`, `offer_images`
- [x] **Gestion Commerçant**
    - [x] Créer une offre (V1)
    - [x] Modifier une offre
    - [x] Supprimer une offre (V1)
    - [x] Définir les règles (%, montant, conditions)
- [x] **Catalogue Public**
    - [x] Page de recherche / Filtres (`/offres`)
    - [x] Page détail d'une offre (`/offres/[id]`)

### 📦 MODULE 3-BIS : Gestion des Coupons (NOUVEAU - Terminé)
- [x] **Logique d'achat/réclamation**
    - [x] Table `coupons` avec code unique
    - [x] Fonction `claim_offer` (RPC) avec limite de quantité
- [x] **Interface Consommateur**
    - [x] Bouton "Obtenir ce rabais" fonctionnel
    - [x] Affichage des coupons actifs avec QR Code (`/dashboard/consumer`)

### 📦 MODULE 4 : Transactions & Wallet (Terminé V1)
- [x] **Base de Données**
    - [x] Tables `transactions`, `wallet_ledger`
    - [x] Triggers automatiques
- [x] **Le Système de Scan (Validation Coupons)**
    - [x] Interface de scan (`/merchant/scan`)
    - [x] Vérification Code Unique `redeem_coupon` (RPC)
    - [x] Validation (Passage de ACTIVE à USED)
    - [x] Feedback visuel immédiat (Succès/Erreur)
- [x] **Mouvements financiers**
    - [x] Crédit de points (Backend)
    - [x] Débit/Utilisation de rabais (Backend)
    - [x] Visualisation Solde (Frontend Consommateur)

---

## ⚫ PHASE 4 : Optimisations & Lancement

### 📦 MODULE 5 : Administration Avancée (En Cours)
- [x] **Base de Données**
    - [x] Statut validation commerçant
    - [x] Policies `offers`
- [x] **Interface Admin ( `/dashboard/admin` )**
    - [x] Vue globale Commerçants
    - [x] Actions Valider/Rejeter
### 📦 MODULE 5 : Administration Avancée (En Cours)
- [x] **Base de Données**
    - [x] Statut validation commerçant
    - [x] Policies `offers`
- [x] **Interface Admin ( `/dashboard/admin` )**
    - [x] Vue globale Commerçants
    - [x] Actions Valider/Rejeter
- [ ] Gestion des litiges
- [ ] Logs & Audit (Voir Module 22)

---

## 🚀 PHASE 5 : EXTENSIONS PRIORITAIRES (Critiques)

### 🟢 PROCHAINE ÉTAPE : MODULE 16 (Voir bas de page) - REPRENDRE ICI
> **Note Session:** Base de données prête (`saved_amount`). Prochaine tâche : Afficher la cagnotte économies sur le Dashboard.
### 📦 MODULE 7 : Système de Crédits (Visible)
*Objectif : Système de crédits central et compréhensible par offre.*
- [x] **Base de Données** : Ajout `credit_cost` sur la table `offers`.
- [x] **Logique Métier** : Calcul dynamique du coût (Ex: 0-29$ = 1 crédit, 30-89$ = 2 crédits...).
- [ ] **Configuration** : Paramètres modifiables par l'Admin (Module 21).
- [x] **Interface** : Affichage clair du coût en crédits sur les listes et détails.
- [x] **Distinction** : Offres "Gratuites" vs "À Crédit".

### 📦 MODULE 8 : Notifications & Emails (Engagement)
*Objectif : Engagement et rétention.*
- [x] **Emails Transactionnels** : Bienvenue, Coupon obtenu, Rappel expiration, Coupon utilisé.
- [ ] **Notifications In-App** : "Nouvelle promotion" en temps réel.
- [ ] **Ciblage** : Envoi par région (Rayon 25km) et catégorie.
- [ ] **Planification** : Envoi quotidien/hebdomadaire configurable.

### 📦 MODULE 9 : Rareté & Expiration (Action)
*Objectif : Déclencher l’action via l'urgence.*
- [x] **Front** : Countdown visible, Date d'expiration explicite.
- [x] **États** : Actif / Bientôt expiré / Expiré (Visuel distinct).
- [x] **Back** : Blocage automatique des coupons/offres expirés.

---

## 🔮 PHASE 6 : STRATÉGIE & DIFFÉRENCIATION

### 📦 MODULE 10 : Profil Consommateur Évolué
- [ ] Préférences : Catégories, Distance, Types d'offres.
- [ ] Gestion fine des notifications.
- [ ] Historique exploitable.

### 📦 MODULE 11 : Recommandations (IA Light)
- [ ] Offres similaires.
- [ ] Offres populaires locales.
- [ ] Suggestions basées sur l'historique.

### 📦 MODULE 12 : Gamification
- [ ] Badges et Niveaux (Exploration, Économies).
- [ ] Défis mensuels.
- [ ] Indicateurs de progression ludiques.

### 📦 MODULE 13 : Carte Membre & Avantages
- [ ] Section dédiée "Ma Carte Membre" avec QR unique (≠ QR Coupon).
- [ ] Avantages récurrents/permanents par région/commerçant.

---

## ⭐ PHASE 7 : UX & CONFIANCE

### 📦 MODULE 14 : Preuve Sociale
- [ ] Compteurs : "Coupons utilisés aujourd'hui", "Membres actifs".
- [ ] Stats locales par région.

### 📦 MODULE 15 : Aide & Compréhension
- [ ] FAQ courte et "Comment ça marche".
- [ ] Vidéo explicative courte.

---

## 🛠️ PHASE 8 : COMPLÉMENTS & ADMIN AVANCÉ

### 📍 PROCHAINE ÉTAPE (PRIORISÉ)
### 📦 MODULE 16 : Historique & Rapports (Conso)
- [x] **Base de Données** : Colonne `saved_amount` & Calcul automatique lors du scan.
- [ ] **Front** : Afficher "Total économisé" sur Dashboard Consommateur.
- [ ] **Front** : Liste historique avec détails économies.

### 📦 MODULE 17 : Favoris & Listes
- [ ] Sauvegarder offres / Suivre commerçants.
- [ ] Alertes sur nouveaux ajouts des favoris.

### 📦 MODULE 18 : Feedback & Signalement
- [ ] Feedback Conso -> Commerçant (Problème, offre invalide).
- [ ] Feedback Commerçant -> Conso (No-show, abus).

### 📦 MODULE 19 : Alertes Intelligentes
- [ ] "Nouveau commerce dans votre zone".
- [ ] "Offre -50% dans vos favoris".

### 📦 MODULE 20 : Mode Découverte
- [ ] Suggestions de commerces moins connus.
- [ ] Parcours de découverte.

### 📦 MODULE 21 : Paramètres Globaux (Super Admin)
- [ ] Gestion centralisée des règles (Seuils crédits, Distances, Fréquences emails).
- [ ] Activation/Désactivation modules.

### 📦 MODULE 22 : Journal d’Audit & Logs
- [ ] Traçabilité des validations et actions critiques.
- [ ] Historique système pour support.

---

---

## 🏙️ PHASE 9 : CONTENU & SEO LOCAL

### 📦 MODULE 23 : Pages Villes & Territoires (Nouveau - Terminé V2 Dynamique)
*Objectif : Créer des pages institutionnelles pour chaque ville, optimisées SEO et maintenance technique.*
- [x] **Architecture Dynamique (Next.js + Supabase)**
    - [x] Route dynamique `/villes/[slug]` (Plus de dossiers statiques)
    - [x] Base de données `cities` (News, Events, Places centralisés)
    - [x] Script de migration de données (JSON -> SQL)
- [x] **Contenu & Design**
    - [x] Template "Institutionnel" React/Tailwind
    - [x] Sections dynamiques (Actus, Événements, Lieux)
    - [x] Migration complète : **Trois-Rivières** (Données en DB)
    - [x] Support technique pour l'export statique (SSG)

### 📦 MODULE 24 : Catalogue & Recherche Villes (À FAIRE)
*Objectif : Permettre aux utilisateurs de trouver leur ville.*
- [ ] **Page Index `/villes`**
    - [ ] Liste de toutes les villes disponibles (Grid ou Liste).
    - [ ] Barre de recherche (Filtrage instantané).
    - [ ] Carte interactive (Optionnel - Phase ultérieure).
- [ ] **Navigation**
    - [ ] Ajout au menu principal / Footer.

---

## ⚠️ NOTES TECHNIQUES & CONFIGURATION

### Supabase / Authentification
- **Confirm Email** : DÉSACTIVÉ (Disabled) pour le développement afin de faciliter les tests.
  - *Note* : À RÉACTIVER impérativement avant le lancement grand public si on veut valider les emails.
- **RLS Policies** : Les policies sur `profiles`, `merchants`, `consumers` sont configurées pour permettre aux utilisateurs authentifiés de créer leur propre ligne (INSERT with `auth.uid() = id`).
