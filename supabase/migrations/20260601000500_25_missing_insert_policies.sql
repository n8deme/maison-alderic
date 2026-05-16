-- ============================================================
-- MIGRATION 25 — Seed organization_members pour users existants
--
-- CAUSE RÉELLE DU BUG RLS :
--   Les INSERT policies pour notes, time_entries, dossier_timeline,
--   messages, conflict_checks, intake_forms, etc. EXISTENT toutes.
--   Elles utilisent get_user_org_id() et is_cabinet_member(), deux
--   fonctions qui interrogent UNIQUEMENT organization_members.
--
--   La migration 11 a seedé les users dans auth.users + profiles,
--   mais organization_members n'existait pas encore (migration 20).
--   Résultat : la table est vide pour tous les users seedés.
--   → get_user_org_id() retourne NULL
--   → organization_id = NULL → DENY sur toutes les INSERT policies
--
-- FIX : insérer tous les users seedés dans organization_members.
-- Les nouveaux users passant par create_organization() sont déjà
-- ajoutés automatiquement (cf. migration 20, fonction security definer).
-- ============================================================

-- -------------------------------------------------------
-- Associés fondateurs → role 'owner'
-- -------------------------------------------------------
insert into organization_members (organization_id, user_id, role) values
  (
    'a0000000-0000-0000-0000-000000000001',
    'a0000001-1111-4111-8111-000000000001',
    'owner'   -- Aldéric Vermeulen, associé fondateur
  ),
  (
    'a0000000-0000-0000-0000-000000000001',
    'a0000002-1111-4111-8111-000000000002',
    'owner'   -- Sophie de Borchgrave, associée fondatrice
  ),
  (
    'a0000000-0000-0000-0000-000000000001',
    'a0000003-1111-4111-8111-000000000003',
    'owner'   -- Jean-Marc Petit, associé fondateur
  ),
  (
    'a0000000-0000-0000-0000-000000000001',
    'a0000004-1111-4111-8111-000000000004',
    'owner'   -- Anaïs Lambert, associée
  ),

-- -------------------------------------------------------
-- Counsels & Senior Associates → role 'avocat'
-- -------------------------------------------------------
  (
    'a0000000-0000-0000-0000-000000000001',
    'a0000005-1111-4111-8111-000000000005',
    'avocat'  -- Marc Dewinter, Counsel
  ),
  (
    'a0000000-0000-0000-0000-000000000001',
    'a0000006-1111-4111-8111-000000000006',
    'avocat'  -- Léa Brouwers, Senior Associate
  ),
  (
    'a0000000-0000-0000-0000-000000000001',
    'a0000007-1111-4111-8111-000000000007',
    'avocat'  -- Olivier Maertens, Senior Associate
  ),
  (
    'a0000000-0000-0000-0000-000000000001',
    'a0000008-1111-4111-8111-000000000008',
    'avocat'  -- Camille Janssens, Senior Associate
  ),

-- -------------------------------------------------------
-- Clients fictifs → role 'client'
-- -------------------------------------------------------
  (
    'a0000000-0000-0000-0000-000000000001',
    'c0000001-2222-4222-8222-000000000001',
    'client'  -- Élise Vandenbroucke, TechScale BV
  ),
  (
    'a0000000-0000-0000-0000-000000000001',
    'c0000002-2222-4222-8222-000000000002',
    'client'  -- Pierre Vandenberghe, Belgian Industrial Holding
  ),
  (
    'a0000000-0000-0000-0000-000000000001',
    'c0000003-2222-4222-8222-000000000003',
    'client'  -- Christine de Hennin, Family Office Hennin
  ),
  (
    'a0000000-0000-0000-0000-000000000001',
    'c0000004-2222-4222-8222-000000000004',
    'client'  -- Thomas Mertens, Mertens Capital
  ),
  (
    'a0000000-0000-0000-0000-000000000001',
    'c0000005-2222-4222-8222-000000000005',
    'client'  -- Caroline Dubois, Distribution Group SA
  )
on conflict (organization_id, user_id) do nothing;
