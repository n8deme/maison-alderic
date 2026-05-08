-- ============================================================================
-- 06 — HELPER FUNCTIONS (schema private — utilisées par RLS policies)
-- ============================================================================
-- Toutes SECURITY DEFINER + STABLE pour bypass RLS et permettre le caching.
-- Search path explicite pour éviter le hijack via création d'objet utilisateur.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- private.is_internal(user_id)
-- True si l'utilisateur est un avocat ou admin du cabinet.
-- ----------------------------------------------------------------------------
create or replace function private.is_internal(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.avocats a where a.user_id = p_user_id
  ) or exists (
    select 1 from public.profiles p
    where p.id = p_user_id and p.role in ('avocat', 'admin')
  );
$$;

comment on function private.is_internal(uuid) is
  'True si l''utilisateur est avocat ou admin (interne au cabinet).';

-- ----------------------------------------------------------------------------
-- private.is_partner(user_id)
-- True si associé fondateur (accès étendu — voit tout).
-- ----------------------------------------------------------------------------
create or replace function private.is_partner(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.avocats a
    where a.user_id = p_user_id
      and a.is_founding_partner = true
  );
$$;

comment on function private.is_partner(uuid) is
  'True si associé fondateur (accès complet via RLS).';

-- ----------------------------------------------------------------------------
-- private.is_dossier_member(user_id, dossier_id)
-- True si l'utilisateur est lead OU dans dossier_avocats pour ce dossier.
-- ----------------------------------------------------------------------------
create or replace function private.is_dossier_member(p_user_id uuid, p_dossier_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.dossier_avocats da
    join public.avocats a on a.id = da.avocat_id
    where da.dossier_id = p_dossier_id
      and a.user_id = p_user_id
  );
$$;

comment on function private.is_dossier_member(uuid, uuid) is
  'True si l''utilisateur (avocat) est assigné à ce dossier (lead ou support).';

-- ----------------------------------------------------------------------------
-- private.current_avocat_id()
-- Retourne l'avocat.id de l'utilisateur courant (ou null).
-- ----------------------------------------------------------------------------
create or replace function private.current_avocat_id()
returns uuid
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select id from public.avocats where user_id = auth.uid() limit 1;
$$;

-- ----------------------------------------------------------------------------
-- Permissions d'exécution
-- ----------------------------------------------------------------------------
grant execute on function private.is_internal(uuid)        to anon, authenticated;
grant execute on function private.is_partner(uuid)         to anon, authenticated;
grant execute on function private.is_dossier_member(uuid, uuid) to anon, authenticated;
grant execute on function private.current_avocat_id()      to anon, authenticated;
