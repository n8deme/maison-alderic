# Supabase — Maison Aldéric & Associés

## Architecture des migrations

13 fichiers ordonnés (timestamp préfixé), à exécuter **dans l'ordre numérique** :

| # | Fichier | Contenu |
|---|---|---|
| 01 | `..._01_extensions.sql` | uuid-ossp, pgcrypto, citext, schema `private` |
| 02 | `..._02_enums.sql` | Tous les types ENUM (status, types, catégories) |
| 03 | `..._03_tables_core.sql` | `profiles` + `avocats` |
| 04 | `..._04_tables_portail.sql` | `dossiers`, `documents`, `messages`, `invoices`, etc. |
| 05 | `..._05_tables_public.sql` | `insights`, `deals`, `deal_avocats` |
| 06 | `..._06_functions_helpers.sql` | `private.is_internal/is_partner/is_dossier_member` |
| 07 | `..._07_indexes.sql` | Tous les index (FK + colonnes filtrées) |
| 08 | `..._08_triggers.sql` | `updated_at` + `handle_new_user` + protection role |
| 09 | `..._09_rls_policies.sql` | RLS sur toutes les tables |
| 10 | `..._10_storage.sql` | Bucket `documents` + storage policies |
| 11 | `..._11_seed_users_avocats.sql` | 8 avocats + 5 clients fictifs (auth.users + profiles + avocats) |
| 12 | `..._12_seed_public.sql` | 8 deals + 6 articles d'insights complets |
| 13 | `..._13_seed_portail.sql` | 13 dossiers + timeline + docs + messages + RDV + factures |

---

## Comment runner les migrations

### Option A — Via Dashboard SQL Editor (recommandée pour la première fois)

1. Ouvrir le projet sur [supabase.com](https://supabase.com)
2. Aller dans **SQL Editor**
3. Pour chaque fichier, dans l'ordre numérique :
   - Copier le contenu intégral du fichier
   - Coller dans une nouvelle query
   - **Run** (Ctrl/Cmd + Enter)
   - Vérifier l'absence d'erreur avant de passer au suivant
4. Les erreurs typiques :
   - Si une migration échoue à mi-chemin → corriger puis relancer cette migration uniquement
   - Si vous voulez réinitialiser → `drop schema public cascade; create schema public;` puis tout rejouer

### Option B — Via Supabase CLI

Prérequis : [Supabase CLI](https://supabase.com/docs/guides/cli) installé.

```bash
# Une fois — link le projet local au projet Supabase
supabase link --project-ref <PROJECT_REF>

# Push les migrations
supabase db push
```

La CLI applique automatiquement toutes les migrations dans l'ordre des timestamps préfixés.

---

## Variables d'environnement requises

Dans `.env.local` à la racine du projet Next.js :

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> Note : Supabase utilise désormais des préfixes `sb_publishable_*` et `sb_secret_*`. Le SDK `@supabase/ssr` 0.10+ les supporte nativement.

---

## Comptes fictifs

Voir [`SEED_CREDENTIALS.md`](./SEED_CREDENTIALS.md) (gitignored) pour la liste complète des emails et passwords des 13 comptes seed.

Tous les emails utilisent le format `kev+<slug>@n8de.me` (alias Gmail) — ce qui permet de tester le login magic link en recevant les emails sur la vraie boîte `kevin@n8de.me`.

---

## Tester l'auth flow

1. Lancer `pnpm dev`
2. Aller sur http://localhost:3000/portail → redirige vers `/portail/login`
3. Saisir un email seed (ex : `kev+client-industrial@n8de.me`)
4. **Option password** : entrer le password depuis `SEED_CREDENTIALS.md` → redirection vers `/portail`
5. **Option magic link** : cliquer "Recevoir un lien magique" → email reçu → cliquer → redirection vers `/portail`
6. Cliquer sur "Se déconnecter" → retour `/portail/login`

---

## Vérifier que les RLS fonctionnent

Une fois loggué en tant que client :

- ✅ doit voir uniquement ses propres dossiers, factures, messages, RDV
- ❌ ne doit **pas** voir les dossiers des autres clients
- ❌ ne doit **pas** voir les documents marqués `visible_to_client = false`
- ✅ doit voir tous les avocats (lecture publique)
- ✅ doit voir tous les insights publiés (lecture publique)

Loggué en tant qu'associé fondateur (Aldéric, Sophie, Jean-Marc, Anaïs) :

- ✅ voit tous les dossiers, factures, documents (`is_partner = true`)
- ✅ peut créer/modifier des dossiers, deals, etc.

Loggué en tant que counsel/senior (Marc D, Léa, Olivier, Camille) :

- ✅ voit uniquement ses dossiers assignés (via `dossier_avocats`)
- ❌ ne voit pas les dossiers où il n'est pas membre

---

## Reset complet de la BDD

Si besoin de tout réinitialiser :

```sql
-- Dans le SQL Editor, à exécuter avec EXTREME prudence
drop schema public cascade;
create schema public;
grant all on schema public to postgres;
grant all on schema public to public;

-- Puis nettoyer auth.users (utilisateurs seed)
delete from auth.users where email like 'kev+%@n8de.me';

-- Puis rejouer toutes les migrations dans l'ordre
```
