# 🏛️ BRIEF MASTER — Maison Aldéric & Associés

> **Projet showcase Kayo Agency** — cabinet d'avocats d'affaires fictif, Bruxelles.
> **Objectif** : démontrer la capacité de Kayo à livrer du 10-12k (site éditorial premium + portail client SaaS + automations backend).
> **Outil de build** : Claude Code Desktop (Phase A) → Cursor (Phase B polish design)
> **Date de création** : 4 mai 2026

---

## 🎯 Identité du projet fictif

**Nom du cabinet** : Maison Aldéric & Associés
**Forme juridique fictive** : SCRL
**Localisation** : Avenue Louise 480, 1050 Bruxelles, Belgique
**Domaine fictif** : maison-alderic.be
**Année de création fictive** : 2003

**Positionnement** : conseil stratégique pour M&A, private equity, contentieux complexe et droit fiscal international. Cible CAC40 belge + scale-ups en hyper-croissance + family offices.

**Tagline officielle** : *« Le droit comme architecture stratégique. »*

**Sous-tagline** : *« Conseil juridique pour les opérations qui définissent une trajectoire. »*

**Tonalité** : sobre, autoritaire, institutionnelle, premium. Aucune trace de "moderne fun startup". On vise Stibbe, Loyens & Loeff, Sullivan & Cromwell.

---

## 🎨 Design system (validé)

### Palette « Moderne sobre »

| Rôle | Hex | Usage |
|---|---|---|
| Background | `#F8F7F4` | Fond général (blanc cassé chaleureux) |
| Surface | `#FFFFFF` | Cartes, sections élevées |
| Surface alt | `#F2F0EB` | Sections alternées, blocs accent |
| Text primary | `#1A1A1A` | Texte principal (noir charbon) |
| Text secondary | `#5C5A55` | Texte secondaire, captions |
| Text muted | `#8B887F` | Métadonnées, dates |
| Primary | `#1A1A1A` | Boutons primaires, headers contraste |
| Accent | `#7A1F2B` | CTAs critiques, hover, chiffres clés (bordeaux) |
| Accent hover | `#5C1820` | Hover sur accent |
| Border | `#E5E2DB` | Séparateurs, bordures cartes |
| Border subtle | `#EFEDE6` | Bordures discrètes |

**Mode** : light strict. Pas de toggle dark.

### Typographie

- **Display (titres)** : `Fraunces` (Google Fonts, weights 400-500-600)
  - Usage : H1, H2, H3, kicker, accents éditoriaux
  - Letter-spacing : tracking-tight (-0.02em) sur gros titres
  - Weight prévalent : 500 (medium) — jamais 700+
- **Body** : `Inter` (Google Fonts, weights 300-400-500-600)
  - Usage : paragraphes, navigation, UI portail
  - Weight body : 400, weight UI : 500

**Combinaison signature** : Fraunces 500 italique pour les phrases de transition éditoriales (ça donne le côté "magazine FT").

### Principes d'espacement

- Sections : `py-32 md:py-40` (oui, on pousse plus que d'habitude — c'est éditorial)
- Padding horizontal : `px-6 md:px-12 lg:px-20`
- Container max : `max-w-7xl` pour les grilles, `max-w-3xl` pour le texte éditorial
- Gap : multiples de 4 (gap-4, gap-8, gap-12, gap-16)

### Animations

- Lenis pour scroll smooth (durée 1.2s, easing cubic-bezier custom)
- GSAP ScrollTrigger pour les timelines complexes (apparitions de sections, parallax léger)
- Framer Motion pour les micro-interactions (hover, transitions UI portail)
- Durée standard : 600ms pour entrées, 200ms pour micro
- Easing : `[0.22, 1, 0.36, 1]` (expo out)

### Mouvement signature

**Transition de mots dans le hero** : un mot du titre principal change toutes les 4 secondes via une animation de masque (le mot ancien se dissout vers le haut pendant que le nouveau apparaît du bas, en stagger letter-by-letter). Les mots qui tournent : « stratégique », « décisif », « précis », « architecturé ».

---

## 📐 Architecture du projet

```
maison-alderic/
├── apps/
│   ├── web/                    → Site vitrine public (Next.js 15)
│   │   └── app/
│   │       ├── (public)/
│   │       │   ├── page.tsx                    → Home
│   │       │   ├── expertises/page.tsx
│   │       │   ├── expertises/[slug]/page.tsx
│   │       │   ├── associes/page.tsx
│   │       │   ├── associes/[slug]/page.tsx
│   │       │   ├── deals/page.tsx
│   │       │   ├── insights/page.tsx
│   │       │   ├── insights/[slug]/page.tsx
│   │       │   └── contact/page.tsx
│   │       ├── (legal)/
│   │       │   ├── mentions-legales/page.tsx
│   │       │   └── confidentialite/page.tsx
│   │       └── portail/        → Voir ci-dessous
│   │
│   └── (portail intégré dans /portail/* du même Next.js, pas un app séparée)
│
├── components/
│   ├── public/                 → Composants site vitrine
│   │   ├── hero-cinematic.tsx
│   │   ├── expertise-grid.tsx
│   │   ├── associes-grid.tsx
│   │   ├── deals-showcase.tsx
│   │   ├── insights-magazine.tsx
│   │   ├── editorial-quote.tsx
│   │   ├── site-nav.tsx
│   │   └── site-footer.tsx
│   │
│   ├── portail/                → Composants portail client
│   │   ├── dashboard/
│   │   ├── dossiers/
│   │   ├── documents/
│   │   ├── messages/
│   │   ├── facturation/
│   │   └── rdv/
│   │
│   └── ui/                     → shadcn/ui custom-skinné
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── stripe/
│   ├── resend/
│   ├── n8n/                    → Webhooks vers n8n
│   └── seed/                   → Seed data fictive
│
├── n8n-workflows/              → JSON exportable pour n8n
│   ├── 01-mandat-pdf.json
│   ├── 02-relances-factures.json
│   ├── 03-rappels-rdv.json
│   └── 04-onboarding-client.json
│
├── public/
│   ├── fonts/                  → Fraunces + Inter (en local pour perf)
│   ├── deals/                  → Visuels deals fictifs
│   └── associes/               → Portraits N&B (placeholders pro)
│
├── supabase/
│   ├── migrations/
│   └── seed.sql
│
└── CLAUDE.md                   → Rules projet
```

---

## 🗄️ Schema Supabase complet

### Tables

```sql
-- Profils utilisateurs (clients du cabinet)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  full_name text not null,
  company text,
  role text not null default 'client', -- 'client' | 'avocat' | 'admin'
  phone text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Avocats du cabinet (équipe interne)
create table avocats (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  title text not null, -- 'Associé fondateur' | 'Associé' | 'Counsel' | 'Senior Associate'
  expertises text[] not null,
  email text not null unique,
  phone text,
  bio text,
  avatar_url text,
  linkedin_url text,
  bar_admission text, -- 'Barreau de Bruxelles, 2008'
  languages text[] default array['FR', 'NL', 'EN'],
  is_founding_partner boolean default false,
  display_order int default 0,
  created_at timestamptz default now()
);

-- Dossiers
create table dossiers (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique, -- 'MA-2026-0042'
  title text not null,
  description text,
  status text not null default 'active', -- 'active' | 'pending' | 'archived' | 'won' | 'lost'
  type text not null, -- 'M&A' | 'Litigation' | 'Tax' | 'Corporate' | 'PE'
  client_id uuid references profiles(id) on delete cascade not null,
  lead_avocat_id uuid references avocats(id) not null,
  team_avocat_ids uuid[] default array[]::uuid[],
  budget_estimated numeric(10,2),
  budget_consumed numeric(10,2) default 0,
  opened_at timestamptz default now(),
  closed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Étapes timeline d'un dossier
create table dossier_timeline (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid references dossiers(id) on delete cascade not null,
  title text not null,
  description text,
  status text not null default 'pending', -- 'pending' | 'in_progress' | 'completed'
  due_date timestamptz,
  completed_at timestamptz,
  created_by uuid references avocats(id),
  display_order int default 0,
  created_at timestamptz default now()
);

-- Documents
create table documents (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid references dossiers(id) on delete cascade not null,
  name text not null,
  description text,
  file_path text not null, -- Supabase Storage path
  file_size bigint not null,
  mime_type text not null,
  category text not null, -- 'contract' | 'mandat' | 'pleading' | 'correspondence' | 'other'
  is_signed boolean default false,
  signed_at timestamptz,
  uploaded_by uuid references profiles(id) not null,
  visible_to_client boolean default true,
  created_at timestamptz default now()
);

-- Messages (thread par dossier)
create table messages (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid references dossiers(id) on delete cascade not null,
  sender_id uuid references profiles(id) not null,
  sender_type text not null, -- 'client' | 'avocat'
  content text not null,
  read_at timestamptz,
  attachments jsonb default '[]',
  created_at timestamptz default now()
);

-- RDV
create table appointments (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid references dossiers(id) on delete set null,
  client_id uuid references profiles(id) not null,
  avocat_id uuid references avocats(id) not null,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location text, -- 'Bureau Bruxelles' | 'Visio Teams' | 'Visio Zoom' | adresse client
  status text not null default 'scheduled', -- 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  reminder_sent_j2 boolean default false,
  reminder_sent_j1 boolean default false,
  notes text,
  created_at timestamptz default now()
);

-- Factures
create table invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique, -- 'F2026-0042'
  client_id uuid references profiles(id) not null,
  dossier_id uuid references dossiers(id) on delete set null,
  amount_ht numeric(10,2) not null,
  vat_amount numeric(10,2) not null,
  amount_ttc numeric(10,2) not null,
  status text not null default 'draft', -- 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  issued_at timestamptz,
  due_at timestamptz,
  paid_at timestamptz,
  stripe_invoice_id text,
  reminder_level int default 0, -- 0 | 1 (J+7) | 2 (J+14) | 3 (J+21 mise en demeure)
  pdf_url text,
  created_at timestamptz default now()
);

-- Lignes de facturation
create table invoice_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references invoices(id) on delete cascade not null,
  description text not null,
  quantity numeric(10,2) not null default 1,
  unit_price numeric(10,2) not null,
  total numeric(10,2) not null,
  display_order int default 0
);

-- Insights (articles de blog publics)
create table insights (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  excerpt text not null,
  content text not null, -- Markdown
  category text not null, -- 'M&A' | 'Tax' | 'Litigation' | 'Corporate' | 'Regulatory'
  author_id uuid references avocats(id) not null,
  cover_image_url text,
  published_at timestamptz,
  is_published boolean default false,
  reading_time_minutes int,
  created_at timestamptz default now()
);

-- Deals notables (cas mis en avant publiquement)
create table deals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  client_name text not null, -- 'Belgian Industrial Holding'
  description text not null,
  amount_label text, -- '240M€' (label, pas montant exact)
  year int not null,
  category text not null, -- 'M&A' | 'PE' | 'Restructuring'
  lead_avocat_ids uuid[] default array[]::uuid[],
  is_featured boolean default false,
  created_at timestamptz default now()
);
```

### RLS (Row Level Security)

- `profiles` : un user ne voit que son propre profil + les avocats du cabinet voient tout
- `dossiers` : un client ne voit que ses dossiers, les avocats voient leurs dossiers assignés, les associés fondateurs voient tout
- `documents` : visibilité selon `visible_to_client` + appartenance au dossier
- `messages` : un user ne voit que les threads des dossiers où il est impliqué
- `invoices` : un client ne voit que ses factures
- `appointments` : un client ne voit que ses RDV
- `insights` + `deals` + `avocats` : public read (table publique du site)

---

## 🌱 Seed data (réaliste, fictif)

### 4 Associés fondateurs

1. **Aldéric Vermeulen** — Associé fondateur, M&A et Private Equity, Barreau de Bruxelles 1995
2. **Sophie de Borchgrave** — Associée fondatrice, Contentieux des affaires, Barreau de Bruxelles 1998
3. **Jean-Marc Petit** — Associé fondateur, Droit fiscal international, Barreau de Bruxelles 2001
4. **Anaïs Lambert** — Associée, Restructurations et Insolvabilité, Barreau de Bruxelles 2007

### 4 Counsels / Senior Associates

5. **Marc Dewinter** — Counsel, M&A
6. **Léa Brouwers** — Senior Associate, Private Equity
7. **Olivier Maertens** — Senior Associate, Contentieux
8. **Camille Janssens** — Senior Associate, Tax

### 8 Deals notables

1. **Belgian Industrial Holding** — Conseil sur l'acquisition de TechCo France (240M€) — 2025
2. **Maersk Belgium** — Restructuration de l'activité logistique européenne — 2024
3. **PE Fund Mercator IV** — Acquisition à effet de levier de RetailCorp (180M€) — 2025
4. **Famille Vandenberg** — Cession de leur participation dans IndustrieCo (sortie family office) — 2024
5. **TechScale BV** — Tour de table série C (75M€), conseil de la société — 2025
6. **Gouvernement régional bruxellois** — Conseil sur arbitrage international (montant confidentiel) — 2024
7. **Biotech Ventures** — Joint-venture transfrontalière avec partenaire suisse — 2025
8. **Distribution Group SA** — Procédure de réorganisation judiciaire réussie — 2024

### 6 Articles d'insights

1. **« La nouvelle directive européenne CSRD : 5 implications stratégiques pour les conseils d'administration »** — Anaïs Lambert
2. **« W&I Insurance dans les opérations M&A belges : retour d'expérience 2025 »** — Aldéric Vermeulen
3. **« Pilier 2 OCDE : ce que les groupes belges doivent anticiper en 2026 »** — Jean-Marc Petit
4. **« Class actions à la belge : trois ans après la réforme, quel bilan ? »** — Sophie de Borchgrave
5. **« Continuation Funds : la nouvelle frontière du Private Equity européen »** — Léa Brouwers
6. **« Insolvabilité transfrontalière post-Brexit : naviguer entre droit belge et procédures UK »** — Anaïs Lambert

### Clients fictifs (5 profils)

Pour démontrer le portail avec des données réalistes :
- 1 CEO de scale-up tech (3 dossiers actifs, 12 docs, 8 messages)
- 1 CFO de groupe industriel (5 dossiers, 30 docs, 1 facture en retard pour démontrer relance)
- 1 family office director (2 dossiers, RDV upcoming)
- 1 entrepreneur (1 dossier, onboarding récent)
- 1 directeur juridique (4 dossiers, archive importante)

---

## 🔌 Les 4 workflows n8n

### Workflow 1 : Génération mandat PDF auto

**Trigger** : Webhook depuis Next.js quand client signe un mandat dans le portail
**Steps** :
1. Recevoir payload (client_id, dossier_id, mandat_template_id)
2. Récupérer données client + cabinet depuis Supabase
3. Générer PDF avec template (HTML→PDF via Puppeteer node)
4. Uploader PDF dans Supabase Storage
5. Envoyer email au client avec PDF en pièce jointe (Resend)
6. Notifier l'avocat lead par email
7. Créer entry dans `dossier_timeline` ("Mandat signé")

### Workflow 2 : Relances factures impayées

**Trigger** : Cron quotidien à 9h
**Steps** :
1. Query Supabase : factures avec status='sent' ET due_at dépassée
2. Pour chaque facture, vérifier `reminder_level` :
   - Niveau 0 + J+7 → envoyer relance douce, set niveau 1
   - Niveau 1 + J+14 → envoyer relance ferme, set niveau 2
   - Niveau 2 + J+21 → envoyer mise en demeure, set niveau 3, notifier avocat
3. Logger toutes les actions dans une table audit

### Workflow 3 : Rappels RDV

**Trigger** : Cron toutes les 6h
**Steps** :
1. Query appointments J-2 sans rappel envoyé → email "Rappel RDV dans 2 jours"
2. Query appointments J-1 sans SMS envoyé → SMS via Twilio
3. Update flags `reminder_sent_j2` / `reminder_sent_j1`

### Workflow 4 : Onboarding nouveau client

**Trigger** : Webhook depuis Next.js après création profil client par un avocat
**Steps** :
1. Recevoir payload (profile_id)
2. Créer dossier "Onboarding" auto avec timeline standard (4 étapes)
3. Générer welcome pack PDF (présentation cabinet, charte, contacts)
4. Envoyer email bienvenue avec lien magic-link et welcome pack
5. Créer RDV de kick-off avec l'avocat lead (à J+7)
6. Notifier l'avocat lead sur Slack/Teams

---

## 🚀 Plan d'exécution Phase A (Claude Code Desktop)

### Session 1 — Foundation (~3-4h)

1. Créer le projet Next.js 15 avec TypeScript strict, Tailwind v4, pnpm
2. Setup Supabase (créer projet, run migrations, seed data complet)
3. Setup Auth flow (magic link, protected routes, middleware)
4. Setup shadcn/ui avec config palette custom Maison Aldéric
5. Setup polices Fraunces + Inter via next/font
6. Layout principal + globals.css avec design tokens
7. Site map de routes vide (placeholder pages)
8. CLAUDE.md du projet pour Cursor

**Critère de validation Session 1** : `pnpm dev` lance, login magic link fonctionne, on peut se connecter avec un client fictif et voir une page portail vide.

### Session 2 — Site vitrine fonctionnel (~3-4h)

1. Home page (sections vides, structure ok)
2. Page Expertises (liste + détail)
3. Page Associés (grid + détail)
4. Page Deals (showcase)
5. Page Insights (magazine + article individuel)
6. Page Contact (formulaire, pas encore branché)
7. Pages légales (mentions, confidentialité)
8. SiteNav + SiteFooter

**Critère de validation Session 2** : tout le site est navigable, contenu réel partout, mais design encore "fonctionnel" (pas encore le wow factor — ça c'est Cursor en Phase B).

### Session 3 — Portail client (~4-5h)

1. Layout portail avec sidebar + topbar
2. Dashboard avec 4 widgets (dossiers actifs, docs récents, RDV, factures)
3. Page Mes dossiers (liste + détail avec timeline)
4. Page Documents (viewer PDF + upload drag&drop)
5. Page Messages (thread par dossier, realtime via Supabase)
6. Page Facturation (liste + détail + paiement Stripe)
7. Page RDV (calendrier + booking)
8. Profile & settings

**Critère de validation Session 3** : un client fictif peut se logger, voir ses dossiers, lire ses messages, télécharger ses docs, payer une facture.

### Session 4 — n8n workflows + intégrations (~2-3h)

1. Setup instance n8n (Docker local pour dev, Hetzner pour prod)
2. Construire les 4 workflows JSON
3. Webhooks Next.js → n8n
4. Tests end-to-end : signature mandat → PDF → email
5. Tests cron : relance facture, rappel RDV
6. Documentation des workflows (schémas visuels pour le case study)

**Critère de validation Session 4** : les 4 workflows sont opérationnels en local, on a 4 vidéos courtes (15s) qui montrent chaque workflow en action.

---

## 🎨 Plan d'exécution Phase B (Cursor + Magic MCP)

### Session 5 — Hero cinematic (~3h)

C'est LA session sur laquelle il faut passer du temps. Le hero définit toute la perception du site.

1. Vidéo background subtile (boucle 8s, fond Avenue Louise au crépuscule, très désaturée)
2. Overlay gradient subtil bordeaux→noir 3% opacity
3. Titre principal en Fraunces 500 italique avec mouvement signature (mots qui changent letter-by-letter)
4. Sous-titre en Inter 400 weight, max-w-2xl
5. 2 CTAs : « Prendre rendez-vous » (primary, fond noir charbon) + « Découvrir nos expertises » (ghost, border)
6. Indicateur scroll discret en bas
7. SiteNav avec backdrop-blur au scroll, logo "Maison Aldéric & Associés" en Fraunces 500
8. Lenis activé sur tout le site

### Session 6 — Sections home + transitions (~3h)

1. Section "Notre approche" : 3 piliers en bento grid asymétrique
2. Section "Expertises" : 6 cartes en grid 3x2 avec hover sophistiqué
3. Section "Deals notables" : carrousel horizontal scroll (pas auto-rotate, scroll manuel/sticky)
4. Section "Associés" : grid de portraits N&B avec hover qui révèle infos
5. Section "Insights" : layout magazine éditorial (1 article featured + 4 secondaires)
6. Section "Contact" : split-screen avec map Avenue Louise + formulaire minimaliste
7. Footer : 4 colonnes éditoriales + barre légale

### Session 7 — Polish portail (~3-4h)

1. Refonte complète design dashboard (s'inspirer Linear + Stripe Dashboard)
2. Composant Timeline custom pour vue dossier (chef d'œuvre du portail)
3. Viewer PDF custom avec annotations
4. Calendrier RDV custom (pas un plugin, un vrai composant)
5. Thread messages style Intercom léger
6. Animations Framer Motion partout
7. Empty states travaillés (illustrations subtiles)

### Session 8 — Détails + audit (~2-3h)

1. Pages Expertises individuelles avec layout éditorial long-form
2. Pages Associés individuelles (portrait pleine page + bio + dossiers récents anonymisés)
3. Pages Insights individuelles (vrai layout d'article magazine avec sommaire sticky, drop cap, blockquotes éditoriales)
4. Mobile responsive obsessionnel (tester sur vrai device)
5. Audit complet avec `audit-design.md` de Kayo, viser 9+/10 partout
6. Lighthouse 95+ Performance, 100 Accessibility
7. Polish des micro-interactions (chaque hover, chaque focus, chaque transition)

### Session 9 — Showcase Kayo (~2h)

1. Case study sur le site Kayo : page dédiée /case-studies/maison-alderic
2. Vidéo 60s de présentation (capture vidéo OBS du site en navigation + dashboard + workflows n8n)
3. Métriques techniques affichées (Lighthouse, build size, etc.)
4. Process visualisé (du brief à la livraison)
5. README technique sur GitHub

---

## ⚙️ Stack technique détaillée

### Frontend
- Next.js 15.x (App Router, RSC, Server Actions)
- TypeScript 5.x strict
- Tailwind CSS v4 (syntaxe `@theme` dans CSS)
- shadcn/ui (custom-skinné)
- Framer Motion 11.x
- GSAP 3.x + ScrollTrigger
- Lenis 1.x
- Lucide React (icons)
- next/font (Fraunces + Inter en local)
- next/image (toutes les images)

### Backend
- Supabase (Postgres, Auth, Storage, Realtime)
- Server Actions Next.js
- Zod (validation)
- React Hook Form (formulaires)
- Resend (emails transactionnels)
- Stripe (factures via Invoice API)

### Automations
- n8n self-hosted (Docker en dev, Hetzner CX11 en prod ~5€/mois)
- Webhooks bidirectionnels Next.js ↔ n8n
- Twilio (SMS rappels RDV)

### Tooling
- pnpm exclusivement
- ESLint + Prettier
- Husky + lint-staged (pre-commit hooks)
- Playwright (tests E2E sur les flows critiques portail)

### Deploy
- Vercel pour Next.js
- Hetzner pour n8n
- Supabase Cloud (free tier suffit pour démo)
- Cloudflare R2 pour storage si on dépasse Supabase free

---

## 🔐 Variables d'environnement

```env
# Public
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Server only
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
N8N_WEBHOOK_URL=
N8N_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

---

## 📋 Premier prompt à coller dans Claude Code Desktop

Une fois le dossier `maison-alderic/` créé et ouvert dans Claude Code Desktop :

```
Tu es développeur senior chez Kayo Agency. On démarre le projet showcase
"Maison Aldéric & Associés" — cabinet d'avocats fictif, projet portfolio
qui doit prouver qu'on peut livrer du 10-12k.

Lis le fichier BRIEF-MAISON-ALDERIC.md à la racine du projet. C'est le
master brief, tout y est : design system, schema DB, plan de session,
seed data, etc.

Ta mission pour cette session (Session 1 — Foundation) :

1. Initialise un projet Next.js 15 avec :
   - TypeScript strict
   - Tailwind v4
   - pnpm (jamais npm/yarn)
   - App Router
   - Pas d'ESLint au scaffold (on configure manuellement après)

2. Installe les dépendances core :
   - @supabase/supabase-js + @supabase/ssr
   - shadcn/ui (init avec config custom de Maison Aldéric)
   - framer-motion
   - lucide-react
   - zod, react-hook-form, @hookform/resolvers
   - resend
   - stripe
   - clsx, tailwind-merge

3. Configure Tailwind v4 avec la palette "Moderne sobre" (voir BRIEF section
   Design system). Utilise la syntaxe @theme dans globals.css.

4. Configure les polices Fraunces et Inter via next/font/google avec les
   variables CSS --font-display et --font-body.

5. Crée le layout principal app/layout.tsx avec :
   - Métadonnées Maison Aldéric (title, description, OpenGraph)
   - Application des polices via les variables
   - Lang fr-BE
   - Theme color cohérent

6. Crée les pages placeholder (juste un titre + "Page en construction"
   stylisé proprement) pour TOUTES les routes listées dans le BRIEF
   section Architecture.

7. Crée la structure de dossiers components/ (public/, portail/, ui/) et
   lib/ (supabase/, stripe/, resend/, n8n/, seed/) — vides pour l'instant.

8. Crée le fichier CLAUDE.md du projet à la racine avec les règles
   spécifiques (palette, typo, mode strict light, polices, etc.)
   inspirées du template Kayo.

9. Lance pnpm build à la fin pour vérifier que tout compile.

10. Rapport final : liste des fichiers créés, dépendances installées, et
    ce qu'il reste à faire en Session 2.

NE FAIS PAS pour l'instant :
- Auth flow (Session 1.5)
- Schema DB Supabase (Session 1.5)
- Seed data (Session 1.5)
- Vrai contenu sur les pages (Sessions 2+)
- Composants design (Phase B avec Cursor)

Confirme que tu as bien lu le brief avant de commencer en me résumant en
3 lignes : (1) la palette, (2) la combo de polices, (3) le mouvement
signature du hero.

GO.
```

---

## ✅ Checklist phase par phase

### Phase A — Claude Code Desktop
- [ ] Session 1 : Foundation (Next.js scaffold + Tailwind v4 + polices + structure)
- [ ] Session 1.5 : Supabase setup (migrations + seed + auth)
- [ ] Session 2 : Site vitrine fonctionnel (toutes pages publiques avec contenu réel)
- [ ] Session 3 : Portail client complet (toutes routes + Stripe)
- [ ] Session 4 : n8n workflows + tests E2E

### Phase B — Cursor + Magic MCP
- [ ] Session 5 : Hero cinematic (LA session critique)
- [ ] Session 6 : Sections home + Lenis + GSAP
- [ ] Session 7 : Polish portail (Linear-tier)
- [ ] Session 8 : Pages détails + audit qualité 9+/10
- [ ] Session 9 : Case study Kayo + vidéo 60s

### Phase C — Showcase
- [ ] Vidéo demo 60s (OBS + édition)
- [ ] Page case study sur kayo.agency
- [ ] README GitHub propre
- [ ] Lighthouse 95+ partout
- [ ] Tag Git v1.0

---

## 🚨 Anti-patterns absolus pour CE projet

- ❌ Stock photos (pour les portraits associés, on génère via IA en N&B avec prompts cohérents — visages réalistes, vraie cohérence visuelle)
- ❌ Bootstrap-feel (zéro carrousel auto-rotate, zéro accordion classique pour l'about)
- ❌ Couleurs autres que palette définie
- ❌ Police différente de Fraunces/Inter
- ❌ Animations tape-à-l'œil (zéro confettis, zéro parallax exagéré, zéro hover qui scale x2)
- ❌ Drop shadows lourdes (uniquement `shadow-sm` ou `shadow-md` avec opacity faible)
- ❌ Border-radius full sur les cartes (max rounded-md, voire rounded-sm pour vibe institutionnelle)
- ❌ Emojis dans le contenu pro
- ❌ Lorem ipsum (vrais textes partout, même les seed data)

---

## 💎 Détails qui font la différence

1. **Drop cap éditorial** sur les articles d'insights (la première lettre en Fraunces 500 sur 3 lignes)
2. **Smart quotes** automatiques dans tous les textes éditoriaux (« » au lieu de "")
3. **Tabular figures** pour tous les chiffres dans le portail (Inter avec `font-feature-settings: 'tnum'`)
4. **Sommaire sticky** sur les articles longs avec progress indicator
5. **Skeleton loaders** custom (pas les défauts shadcn) qui matchent la palette
6. **Page 404 éditoriale** avec citation latine + retour home stylisé
7. **OG images dynamiques** générées avec @vercel/og pour chaque article et associé
8. **Sitemap.xml dynamique** depuis Supabase
9. **Schema.org LegalService** complet pour le SEO
10. **Robots.txt** propre avec mention "kayo.agency" en commentaire (égo trip subtil)

---

*Brief master Kayo Agency — projet Maison Aldéric & Associés — version 1*
*Créé le 4 mai 2026 — par Kev × Claude*
*À copier dans le projet Claude Code Desktop avant de lancer la Session 1.*
