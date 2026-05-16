-- ============================================================================
-- 08 — TRIGGERS
-- ============================================================================
-- 1. updated_at automatique sur toutes les tables qui en ont besoin
-- 2. handle_new_user : crée auto une row profile à chaque signup auth
-- 3. protect_profile_role : empêche un user non-partner de changer son role
-- ============================================================================

-- ----------------------------------------------------------------------------
-- updated_at trigger universel
-- ----------------------------------------------------------------------------
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at         before update on public.profiles
  for each row execute function public.tg_set_updated_at();
create trigger avocats_set_updated_at          before update on public.avocats
  for each row execute function public.tg_set_updated_at();
create trigger dossiers_set_updated_at         before update on public.dossiers
  for each row execute function public.tg_set_updated_at();
create trigger dossier_timeline_set_updated_at before update on public.dossier_timeline
  for each row execute function public.tg_set_updated_at();
create trigger documents_set_updated_at        before update on public.documents
  for each row execute function public.tg_set_updated_at();
create trigger messages_set_updated_at         before update on public.messages
  for each row execute function public.tg_set_updated_at();
create trigger appointments_set_updated_at     before update on public.appointments
  for each row execute function public.tg_set_updated_at();
create trigger invoices_set_updated_at         before update on public.invoices
  for each row execute function public.tg_set_updated_at();
create trigger insights_set_updated_at         before update on public.insights
  for each row execute function public.tg_set_updated_at();
create trigger deals_set_updated_at            before update on public.deals
  for each row execute function public.tg_set_updated_at();

-- ----------------------------------------------------------------------------
-- handle_new_user : auto-création d'un profile au signup
-- ----------------------------------------------------------------------------
-- Lit raw_user_meta_data pour récupérer full_name + role envoyés au signup.
-- Si pas de role explicite → 'client' par défaut.
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, email, full_name, role, company, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'client'),
    new.raw_user_meta_data->>'company',
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- protect_profile_role : seuls les partners peuvent changer le role
-- ----------------------------------------------------------------------------
create or replace function public.tg_protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if old.role is distinct from new.role then
    if not private.is_partner(auth.uid()) then
      raise exception 'Permission denied: only founding partners can change user roles';
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_protect_role
  before update on public.profiles
  for each row execute function public.tg_protect_profile_role();
