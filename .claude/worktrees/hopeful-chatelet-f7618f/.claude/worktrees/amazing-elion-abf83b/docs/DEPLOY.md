# Guide de déploiement — LawyerOS en production

> Stack : Next.js 16 · Supabase Cloud (EU Frankfurt) · Vercel · Cloudflare

---

## Prérequis

- Compte [Supabase](https://supabase.com) (free tier suffisant pour démo)
- Compte [Vercel](https://vercel.com) (Hobby ou Pro selon usage)
- Domaine `lawyeros.be` configuré sur Cloudflare
- CLI Supabase installé : `pnpm add -g supabase`
- CLI Vercel installé : `pnpm add -g vercel`

---

## Étape 1 — Créer le projet Supabase Cloud

### 1.1 Créer le projet

1. Sur [supabase.com/dashboard](https://supabase.com/dashboard), cliquer **New project**
2. Organisation : votre organisation ou en créer une nouvelle
3. Nom : `lawyeros-prod`
4. Mot de passe DB : générer et sauvegarder en sécurité (LastPass/1Password)
5. **Région : EU (Frankfurt)** — obligatoire pour conformité RGPD
6. Cliquer **Create new project** (2-3 min de provisioning)

### 1.2 Récupérer les credentials

Aller dans **Settings > API** :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` côté client.**

### 1.3 Configurer l'auth (magic link)

Dans **Authentication > Settings** :

- **Site URL** : `https://lawyeros.be`
- **Additional Redirect URLs** :
  ```
  https://lawyeros.be/**
  https://*.lawyeros.be/**
  http://localhost:3000/**
  ```
- **Email Templates** : personnaliser le template magic link avec le branding LawyerOS (optionnel)
- **SMTP Custom** : configurer avec Resend pour les emails transactionnels en prod

---

## Étape 2 — Pousser les migrations

### 2.1 Lier le projet local à Supabase Cloud

```bash
supabase login
supabase link --project-ref xxxxxxxxxxxx
```

### 2.2 Pousser toutes les migrations

```bash
supabase db push
```

Cela applique séquentiellement tous les fichiers dans `supabase/migrations/`.

Vérifier dans **Database > Tables** que les tables suivantes existent :
- `organizations`, `organization_members`
- `profiles`, `avocats`, `dossiers`
- `documents`, `messages`, `appointments`, `invoices`

### 2.3 Vérifier les policies RLS

Dans **Authentication > Policies**, vérifier que chaque table a ses policies activées. En particulier :
- `organizations` : policy `organizations_public_read` (lecture publique pour le middleware)
- `organization_members` : policies CRUD par rôle

### 2.4 Configurer Supabase Storage

Dans **Storage** :
1. Créer le bucket `org-assets` (public, pour logos des cabinets)
2. Créer le bucket `documents` (privé, pour documents clients)
3. Créer le bucket `generated-pdfs` (privé, pour PDFs générés)

Policy pour `org-assets` (lecture publique) :
```sql
create policy "org_assets_public_read"
  on storage.objects for select
  using (bucket_id = 'org-assets');

create policy "org_assets_authenticated_upload"
  on storage.objects for insert
  with check (bucket_id = 'org-assets' and auth.role() = 'authenticated');
```

---

## Étape 3 — Configurer Cloudflare (DNS wildcard)

Le multi-tenant LawyerOS repose sur des sous-domaines : `cabinet-dupont.lawyeros.be`.

### 3.1 Ajouter le domaine sur Cloudflare

Si `lawyeros.be` n'est pas encore sur Cloudflare, transférer les NS chez le registrar.

### 3.2 Créer les enregistrements DNS

Dans **DNS > Records** de Cloudflare :

| Type | Nom | Valeur | Proxy |
|------|-----|--------|-------|
| `CNAME` | `lawyeros.be` | `cname.vercel-dns.com` | Proxied |
| `CNAME` | `www` | `cname.vercel-dns.com` | Proxied |
| `CNAME` | `*` | `cname.vercel-dns.com` | **DNS only (gris)** |

**Important :** Le wildcard `*` doit être en **DNS only** (pas proxied par Cloudflare) car Vercel gère lui-même les wildcard subdomains. Le proxy Cloudflare sur un wildcard casse l'auto-SSL de Vercel.

### 3.3 Vérifier la propagation DNS

```bash
dig +short lawyeros.be
dig +short www.lawyeros.be
dig +short cabinet-test.lawyeros.be
```

Les trois doivent pointer vers une IP Vercel.

---

## Étape 4 — Déployer sur Vercel

### 4.1 Importer le repo

1. Sur [vercel.com](https://vercel.com), cliquer **Add New > Project**
2. Importer depuis GitHub : sélectionner `maison-alderic`
3. **Framework Preset** : Next.js (détecté automatiquement)
4. **Root Directory** : `.` (racine)
5. **Build Command** : `pnpm build`
6. **Install Command** : `pnpm install`

### 4.2 Ajouter le domaine wildcard

Dans **Settings > Domains** du projet Vercel :
1. Ajouter `lawyeros.be`
2. Ajouter `*.lawyeros.be` — cela active le wildcard SSL automatique

Vercel génère automatiquement un certificat Let's Encrypt wildcard pour `*.lawyeros.be`.

### 4.3 Variables d'environnement

Dans **Settings > Environment Variables**, ajouter **toutes** les variables suivantes pour l'environnement **Production** (et optionnellement Preview) :

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# App
NEXT_PUBLIC_SITE_URL=https://lawyeros.be

# Stripe (obtenir sur dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Resend (obtenir sur resend.com)
RESEND_API_KEY=re_...

# n8n (URL de l'instance Hetzner)
N8N_WEBHOOK_URL=https://n8n.lawyeros.be/webhook
N8N_API_KEY=...

# Twilio (SMS rappels RDV)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+32...

# Admin
ADMIN_EMAILS=admin@lawyeros.be,kevforma@gmail.com
```

### 4.4 Déclencher le premier déploiement

```bash
git push origin main
```

Vercel déploie automatiquement. Suivre les logs dans **Deployments > [latest]**.

### 4.5 Vérifier le déploiement

```bash
# Site marketing
curl -I https://lawyeros.be

# Portail d'un tenant (doit retourner 200 ou redirect /connexion)
curl -I https://maison-alderic.lawyeros.be/portail

# Admin (doit retourner redirect /connexion si non authentifié)
curl -I https://lawyeros.be/admin
```

---

## Étape 5 — Stripe en production

### 5.1 Configurer les produits Stripe

Dans le dashboard Stripe (mode Live) :
1. Créer 3 produits : `LawyerOS Solo`, `LawyerOS Cabinet`, `LawyerOS Premium`
2. Pour chaque produit, créer 2 prix : mensuel et annuel
3. Noter les `price_id` correspondants et les mettre en variables d'env

### 5.2 Configurer le webhook Stripe

Dans **Stripe > Webhooks** :
- Endpoint URL : `https://lawyeros.be/api/webhooks/stripe`
- Événements à écouter :
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

Copier le **Signing Secret** (`whsec_...`) dans la variable `STRIPE_WEBHOOK_SECRET`.

---

## Checklist post-déploiement

- [ ] `https://lawyeros.be` charge correctement
- [ ] `https://maison-alderic.lawyeros.be` charge le portail tenant démo
- [ ] Magic link fonctionne (tester avec une adresse email)
- [ ] Upload logo dans l'onboarding fonctionne (Supabase Storage)
- [ ] L'admin `/admin` est accessible uniquement avec `kevforma@gmail.com`
- [ ] Stripe webhook reçoit les événements (vérifier dans Stripe Dashboard)
- [ ] Lighthouse Performance > 90 sur `https://lawyeros.be`
- [ ] Headers de sécurité présents (vérifier avec securityheaders.com)

---

## Troubleshooting courant

### Wildcard subdomain ne résout pas

Vérifier que l'entrée DNS `*` est bien en **DNS only** sur Cloudflare (pas Proxied). Attendre 5-10 min pour la propagation.

### Erreur "JWT expired" en production

La session cookie expire. S'assurer que le middleware `updateSession` est bien appelé dans `middleware.ts` à chaque requête vers `/portail` et `/portail-avocat`.

### Supabase RLS bloque les queries admin

Le dashboard admin utilise `SUPABASE_SERVICE_ROLE_KEY` qui bypasse le RLS. Vérifier que cette variable est bien définie en production et jamais exposée côté client.

### Build échoue sur TypeScript

```bash
pnpm typecheck
```

Corriger toutes les erreurs avant de pusher. Le build Vercel est strict.

---

*LawyerOS · Guide de déploiement v1.0 · Mai 2026*
