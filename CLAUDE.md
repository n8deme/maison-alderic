# CLAUDE.md — Maison Aldéric & Associés

> Projet showcase Kayo Agency — cabinet d'avocats d'affaires fictif, Bruxelles.
> Outil : Claude Code Desktop (Phase A) → Cursor (Phase B polish design).

---

## Stack

- **Framework** : Next.js 16 (App Router, RSC, Server Actions)
- **Language** : TypeScript 5 strict (`"strict": true` — ne pas baisser)
- **CSS** : Tailwind CSS v4 (syntaxe `@theme` dans `globals.css`, pas de `tailwind.config.js`)
- **Composants UI** : shadcn/ui (custom-skinné palette Maison Aldéric)
- **Animations** : Framer Motion (micro-interactions) + GSAP + Lenis (Phase B)
- **Backend** : Supabase (Auth, Postgres, Storage, Realtime)
- **Package manager** : **pnpm exclusivement** — jamais npm, jamais yarn

---

## Design system — Palette « Moderne sobre »

```
Background   #F8F7F4   → var(--background)      → bg-background
Surface      #FFFFFF   → var(--surface)          → bg-surface
Surface alt  #F2F0EB   → var(--surface-alt)      → bg-surface-alt
Text primary #1A1A1A   → var(--foreground)       → text-foreground
Text second. #5C5A55   → var(--text-secondary)   → text-text-secondary
Text muted   #8B887F   → var(--text-muted)       → text-text-muted
Primary      #1A1A1A   → var(--primary)          → bg-primary
Accent       #7A1F2B   → var(--accent)           → bg-accent (bordeaux)
Accent hover #5C1820   → var(--bordeaux-hover)
Border       #E5E2DB   → var(--border)           → border-border
Border sub.  #EFEDE6   → var(--border-subtle)
```

**Mode light strict.** Aucun dark mode. Ne jamais ajouter de classes `dark:`.

---

## Typographie

| Rôle    | Font      | Variable CSS     | Tailwind       |
|---------|-----------|------------------|----------------|
| Display | Fraunces  | `--font-display` | `font-heading` |
| Body    | Inter     | `--font-body`    | `font-sans`    |

**Règles absolues :**
- Titres h1-h3 : `font-heading` weight 500, `tracking-tight` (-0.02em)
- Body : `font-sans` weight 400 ; labels/UI buttons : weight 500
- Signature éditoriale : Fraunces 500 **italic** sur les phrases de transition
- Jamais weight 700+ sur Fraunces (max 600)
- Jamais une autre police que Fraunces/Inter

---

## Espacement

```
Sections       : py-32 md:py-40
Padding H      : px-6 md:px-12 lg:px-20
Container max  : max-w-7xl (grilles) / max-w-3xl (texte éditorial)
Gap            : multiples de 4 — gap-4, gap-8, gap-12, gap-16
```

---

## Animations

- **Durée standard** : 600ms entrées / 200ms micro-interactions
- **Easing signature** : `[0.22, 1, 0.36, 1]` (expo out)
- **Lenis** : durée 1.2s, cubic-bezier custom (Phase B)
- **Mouvement hero** : un mot du titre tourne toutes les 4s via masque vertical letter-by-letter.
  Mots : « stratégique », « décisif », « précis », « architecturé »

---

## Architecture fichiers

```
app/
  (public)/     → routes publiques site vitrine
  (legal)/      → mentions légales, confidentialité
  portail/      → portail client (auth required — Session 1.5)

components/
  public/       → composants site vitrine
  portail/      → composants portail (dashboard/, dossiers/, ...)
  ui/           → shadcn/ui custom-skinné

lib/
  supabase/     → client.ts, server.ts, middleware.ts
  stripe/       → stripe client + helpers
  resend/       → templates emails
  n8n/          → webhooks vers n8n
  seed/         → seed data fictive
```

---

## Anti-patterns — INTERDITS

- Couleurs hors palette définie
- Polices autres que Fraunces/Inter
- Dark mode ou classes `dark:`
- `border-radius` full sur cartes — max `rounded-md`, préférer `rounded-sm`
- Shadows lourdes — uniquement `shadow-sm` / `shadow-md` avec faible opacity
- Auto-rotate carousels — scroll horizontal manuel/sticky uniquement
- Animations tape-à-l'œil — pas de scale x2 au hover
- Lorem ipsum — vrais textes partout
- Stock photos — portraits IA N&B cohérent (Phase B)
- npm ou yarn — pnpm uniquement
- Emojis dans le contenu éditorial

---

## Conventions de code

- Composants RSC par défaut — `"use client"` uniquement si interactions/hooks nécessaires
- Server Actions pour toutes les mutations (formulaires, portail)
- `zod` pour toute validation (server ET client)
- `next/image` pour toutes les images
- `next/link` pour tous les liens
- Pas de commentaires évidents — seulement les WHY non-obvieux

---

## Sessions

| Session | Scope |
|---------|-------|
| 1 — Foundation ✅ | Next.js scaffold, Tailwind v4, polices, layout, placeholder pages |
| 1.5 — Supabase | Auth magic link, migrations, seed data, middleware |
| 2 — Site vitrine | Toutes pages publiques avec contenu réel |
| 3 — Portail client | Dashboard, dossiers, docs, messages, factures, RDV |
| 4 — n8n workflows | 4 automations + tests E2E |
| 5-9 — Phase B | Polish design (Cursor + Magic MCP) |

---

*Kayo Agency — projet Maison Aldéric & Associés — v1*
*Brief master : `BRIEF-MAISON-ALDERIC.md`*
