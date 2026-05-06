# 📌 PASSATION — Session 5 mai 2026 → Suite

## ✅ FAIT CETTE SESSION

### Setup technique
- Docker installé via WSL2 Ubuntu (pas Docker Desktop)
- Supabase local fonctionne (`supabase start` OK, db reset OK)
- 17 migrations appliquées avec succès
- Studio accessible : http://127.0.0.1:54323

### Bugs résolus
- Migration `add_slug_to_avocats` renommée en `20260504120950_*` (avant le seed)
- BOM caractères supprimés des fichiers SQL (`sed -i '1s/^\xEF\xBB\xBF//'`)
- Insights slugs : il faut utiliser les slugs COMPLETS (pas tronqués)
- **Bug majeur résolu** : redirect loop infinie sur `/portail/login`

### Refactor auth (architecture finale)
- `app/(auth)/connexion/page.tsx` ← Route Group, URL = `/connexion`
- `app/portail/layout.tsx` ← protection `redirect("/connexion")` si !user
- `lib/supabase/middleware.ts` ← protège `/portail/*`, exclut `/connexion`
- 14 fichiers mis à jour (`/portail/login` → `/connexion`)

### Configuration Supabase
- URLs hardcodées dans `lib/supabase/static.ts` ET `lib/supabase/middleware.ts` :
  - `http://127.0.0.1:54321`
  - Anon key : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0`

## 📊 ÉTAT DU PROJET MAISON ALDÉRIC

**Avancement : 80% pour version vendable €10-12k**

### ✅ Complet
- Site public 7 pages (home, expertises, associés, deals, insights, contact, légales)
- 6 articles blog avec slugs corrects
- Design system EB Garamond + Lato
- Lighthouse 98.5/100 sur le public
- Schema DB Supabase (17 tables, RLS, auth seed)
- UI portail (dashboard, dossiers, documents, messages, facturation, RDV, profil)
- Auth flow architecture propre (Route Group)
- Données seed (8 avocats, 8 deals, 6 articles, 5 clients)

### ⏳ À FAIRE (estimation 8h)
1. **Auth Supabase fonctionnelle** (1h) — réactiver vrai login dans `app/(auth)/connexion/page.tsx` (actuellement commenté pour debug)
2. **Tester avec compte seed** (30min) — login + accès portail
3. **Mobile responsive obsessionnel** (2h) — tous breakpoints
4. **1 workflow n8n démo : mandat PDF auto** (2h) — le plus impressionnant pour la démo
5. **Deploy Vercel + custom domain** (30min) — `maison-alderic.demo.kayo.agency`
6. **Vidéo Loom 60-90s** (30min)
7. **Case study sur kayo.agency** (2h)

## 🐛 ATTENTION POUR LA SUITE

- Le formulaire login dans `app/(auth)/connexion/page.tsx` a Supabase **commenté** (mode debug). À réactiver.
- Le serveur Next.js doit être lancé depuis la racine `pnpm dev`, pas depuis `app/portail/`
- Supabase local doit tourner en parallèle (`supabase start` dans WSL)
- Comptes seed disponibles dans la DB (voir `supabase/migrations/11_seed_users_avocats.sql`)

## 🎯 STRATÉGIE COMMERCIALE (post-livraison)

### Plan prospection cabinets d'avocats
1. **Outscraper** : 100-200 cabinets BE/LU/FR (5-30 avocats, site WordPress daté)
2. **Cold email manuel** : 10-20/jour depuis kev@kayo.agency
3. **Démo live** : site + portail + 1 workflow n8n (mandat PDF auto)
4. **Pricing** : €13k (site €4.5k + portail €4k + n8n €3.5k + setup €1k)
5. **Objectif** : 1-3 deals signés sur 200 emails = ROI confirmé

### USP Kayo + n8de.me
"L'agence qui livre site premium + portail client + automatisation cabinet en 3 semaines, déjà construit, démo live."

## 📁 STRUCTURE PROJET ACTUELLE