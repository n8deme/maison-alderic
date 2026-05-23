-- ============================================================
-- MIGRATION 26 — Durcissement RLS pré-lancement
-- organizations, avocats, deals
-- ============================================================

-- -------------------------------------------------------
-- 1. organizations : colonnes Stripe inaccessibles en anon
--
--    Deux mécanismes PG indépendants et complémentaires :
--    a) GRANT colonne-par-colonne → protège les COLONNES sensibles
--       (stripe_customer_id, stripe_subscription_id, stripe_price_id,
--        stripe_cancel_at inaccessibles pour le rôle anon)
--    b) Policy RLS → contrôle quelles LIGNES sont visibles
--       (USING(true) = toutes ; nécessaire car RLS est deny-by-default
--        et le middleware doit retrouver n'importe quelle org par subdomain)
--
--    L'ancienne policy "organizations_public_read" n'était pas scopée → les
--    utilisateurs authentifiés l'activaient aussi et pouvaient lire toutes
--    les orgs (colonnes Stripe incluses). Le scope TO anon force les
--    authenticated à passer par org_select_member (leur org uniquement).
-- -------------------------------------------------------
drop policy if exists "organizations_public_read" on organizations;

-- Protection colonne (niveau privilege PG) :
revoke select on organizations from anon;
grant select (
  id, name, slug, subdomain,
  plan, is_active, trial_ends_at,
  primary_color, accent_color, logo_url,
  feature_esignature, feature_ai_summary, feature_intake_forms
) on organizations to anon;
-- Note : subdomain est nécessaire même s'il n'est pas dans le SELECT du
-- middleware — il est utilisé dans le WHERE, ce qui exige SELECT sur la colonne.

-- Protection ligne (niveau RLS) :
create policy "organizations_anon_read"
  on organizations for select
  to anon
  using (true);

-- -------------------------------------------------------
-- 2. avocats : supprimer le trou IS NULL
--    get_user_org_id() IS NULL = vrai pour tout utilisateur anon
--    → tous les avocats de tous les cabinets étaient lisibles publiquement.
--    L'org de démo reste accessible en anon pour /demo/associes.
-- -------------------------------------------------------
drop policy if exists "avocats_select" on avocats;

create policy "avocats_select"
  on avocats for select
  using (organization_id = get_user_org_id());

create policy "avocats_select_demo_public"
  on avocats for select
  to anon
  using (organization_id = 'a0000000-0000-0000-0000-000000000001'::uuid);

-- -------------------------------------------------------
-- 3. deals : restreindre la lecture cross-tenant
--    L'org de démo reste publique (vitrine /demo/deals).
--    Pour les vrais cabinets : membres authentifiés uniquement.
-- -------------------------------------------------------
drop policy if exists "deals_select" on deals;

create policy "deals_select"
  on deals for select
  using (
    organization_id = 'a0000000-0000-0000-0000-000000000001'::uuid
    or organization_id = get_user_org_id()
  );
