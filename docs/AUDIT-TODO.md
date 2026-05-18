# Audit pré-prod — TODOs

## 3.4 — Démo portail client
**Symptôme** : naviguer vers `/portail` redirige vers `/portail-avocat`.
**Cause probable** : middleware qui détecte le rôle du user démo (Aldéric Vermeulen, avocat) et redirige selon rôle.
**Fix attendu** : permettre l'accès à `/portail` en mode démo avec un user client (ex: Élise Vandenbroucke). Idéalement un switcher "Vue avocat / Vue client" en haut du portail.
**Pré-requis** : avoir un mécanisme `DEMO_MODE` clair (env var `NEXT_PUBLIC_DEMO_MODE=true` à ajouter dans Vercel).
**Budget** : à faire quand Sonnet dispo (Opus si décision archi).

## 3.5 — Protéger suppression cabinet en démo
**Symptôme** : sur `/portail-avocat/settings` → Zone de danger → "Supprimer mon cabinet", le bouton est actif et un visiteur de la démo peut cliquer.
**Risque** : casse la démo pour les autres visiteurs jusqu'au cron de reset 3h du matin.
**Fix attendu** : intercepter le clic en mode démo → modal "Action désactivée. La démo se réinitialise chaque nuit à 3h."
**Pré-requis** : même que 3.4 (`DEMO_MODE`).
**Budget** : à faire quand Sonnet dispo.

## 3.6 — React error #418 (hydration mismatch)
**Symptôme** : exception React #418 en console sur `/associes`, page lente à charger (>90s) sur `/expertises`.
**Cause probable** :
- `new Date()` au rendu sans suppressHydrationWarning
- `Intl.DateTimeFormat` avec locale FR-BE rendue différemment serveur vs client
- Composant client-only en SSR sans mounted guard
- Lenis/GSAP qui modifie le DOM avant hydration React
**Marche à suivre** :
1. Activer source maps (`SENTRY_AUTH_TOKEN` dans Vercel)
2. Reproduire en local + lire stack trace exact
3. Suspecter en priorité `lib/format-date.ts` et les composants qui l'utilisent dans `app/(public)/associes/` et `app/(public)/expertises/`
4. Fix : `useEffect(() => setMounted(true), [])` + early return, ou `suppressHydrationWarning` ciblé
**Budget** : Sonnet minimum, Opus si la cause s'avère architecturale.
