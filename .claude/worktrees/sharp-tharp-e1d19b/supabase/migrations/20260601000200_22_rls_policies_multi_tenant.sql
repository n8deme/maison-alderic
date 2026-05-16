-- ============================================================
-- MIGRATION 22 — Réécriture RLS policies multi-tenant
-- À exécuter APRÈS les migrations 20 et 21
-- ============================================================

-- -------------------------------------------------------
-- Helper functions (security definer = bypass RLS)
-- -------------------------------------------------------
create or replace function get_user_org_id()
returns uuid language sql stable security definer as $$
  select organization_id from organization_members
  where user_id = auth.uid()
  limit 1
$$;

create or replace function get_user_role()
returns text language sql stable security definer as $$
  select role from organization_members
  where user_id = auth.uid()
  limit 1
$$;

create or replace function is_cabinet_member()
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from organization_members
    where user_id = auth.uid()
    and role in ('owner', 'admin', 'avocat', 'secretaire')
  )
$$;

-- -------------------------------------------------------
-- organization_members
-- Policy simple sans récursion — un user voit ses propres memberships
-- -------------------------------------------------------
drop policy if exists "org_members_select" on organization_members;
drop policy if exists "org_members_insert_admin" on organization_members;
drop policy if exists "org_members_update_admin" on organization_members;
drop policy if exists "org_members_delete_admin" on organization_members;

create policy "org_members_select"
  on organization_members for select
  using (user_id = auth.uid());

create policy "org_members_insert_admin"
  on organization_members for insert
  with check (
    organization_id in (
      select organization_id from organization_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

create policy "org_members_update_admin"
  on organization_members for update
  using (
    organization_id in (
      select organization_id from organization_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

create policy "org_members_delete_admin"
  on organization_members for delete
  using (
    organization_id in (
      select organization_id from organization_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
    and user_id != auth.uid()
  );

-- -------------------------------------------------------
-- profiles
-- -------------------------------------------------------
drop policy if exists "profiles_select" on profiles;
drop policy if exists "profiles_update" on profiles;

create policy "profiles_select"
  on profiles for select
  using (
    organization_id = get_user_org_id()
    and (
      id = auth.uid()
      or is_cabinet_member()
    )
  );

create policy "profiles_update"
  on profiles for update
  using (id = auth.uid());

-- -------------------------------------------------------
-- avocats
-- -------------------------------------------------------
drop policy if exists "avocats_select" on avocats;
drop policy if exists "avocats_insert" on avocats;
drop policy if exists "avocats_update" on avocats;

create policy "avocats_select"
  on avocats for select
  using (
    organization_id = get_user_org_id()
    or get_user_org_id() is null
  );

create policy "avocats_insert"
  on avocats for insert
  with check (
    organization_id = get_user_org_id()
    and get_user_role() in ('owner', 'admin')
  );

create policy "avocats_update"
  on avocats for update
  using (
    organization_id = get_user_org_id()
    and get_user_role() in ('owner', 'admin')
  );

-- -------------------------------------------------------
-- dossiers
-- -------------------------------------------------------
drop policy if exists "dossiers_select" on dossiers;
drop policy if exists "dossiers_insert" on dossiers;
drop policy if exists "dossiers_update" on dossiers;

create policy "dossiers_select"
  on dossiers for select
  using (
    organization_id = get_user_org_id()
    and (
      get_user_role() in ('owner', 'admin', 'avocat', 'secretaire')
      or (get_user_role() = 'client' and client_id = auth.uid())
    )
  );

create policy "dossiers_insert"
  on dossiers for insert
  with check (
    organization_id = get_user_org_id()
    and get_user_role() in ('owner', 'admin', 'avocat')
  );

create policy "dossiers_update"
  on dossiers for update
  using (
    organization_id = get_user_org_id()
    and get_user_role() in ('owner', 'admin', 'avocat')
  );

-- -------------------------------------------------------
-- dossier_timeline
-- -------------------------------------------------------
drop policy if exists "timeline_select" on dossier_timeline;
drop policy if exists "timeline_insert" on dossier_timeline;
drop policy if exists "timeline_update" on dossier_timeline;

create policy "timeline_select"
  on dossier_timeline for select
  using (
    organization_id = get_user_org_id()
    and (
      is_cabinet_member()
      or dossier_id in (
        select id from dossiers where client_id = auth.uid()
      )
    )
  );

create policy "timeline_insert"
  on dossier_timeline for insert
  with check (
    organization_id = get_user_org_id()
    and is_cabinet_member()
  );

create policy "timeline_update"
  on dossier_timeline for update
  using (
    organization_id = get_user_org_id()
    and get_user_role() in ('owner', 'admin', 'avocat')
  );

-- -------------------------------------------------------
-- documents
-- -------------------------------------------------------
drop policy if exists "documents_select" on documents;
drop policy if exists "documents_insert" on documents;

create policy "documents_select"
  on documents for select
  using (
    organization_id = get_user_org_id()
    and (
      is_cabinet_member()
      or (
        get_user_role() = 'client'
        and visible_to_client = true
        and dossier_id in (
          select id from dossiers where client_id = auth.uid()
        )
      )
    )
  );

create policy "documents_insert"
  on documents for insert
  with check (
    organization_id = get_user_org_id()
    and (
      is_cabinet_member()
      or (
        get_user_role() = 'client'
        and dossier_id in (
          select id from dossiers where client_id = auth.uid()
        )
      )
    )
  );

-- -------------------------------------------------------
-- messages
-- -------------------------------------------------------
drop policy if exists "messages_select" on messages;
drop policy if exists "messages_insert" on messages;

create policy "messages_select"
  on messages for select
  using (
    organization_id = get_user_org_id()
    and (
      is_cabinet_member()
      or dossier_id in (
        select id from dossiers where client_id = auth.uid()
      )
    )
  );

create policy "messages_insert"
  on messages for insert
  with check (
    organization_id = get_user_org_id()
    and (
      is_cabinet_member()
      or dossier_id in (
        select id from dossiers where client_id = auth.uid()
      )
    )
    and sender_id = auth.uid()
  );

-- -------------------------------------------------------
-- appointments
-- -------------------------------------------------------
drop policy if exists "appointments_select" on appointments;
drop policy if exists "appointments_insert" on appointments;
drop policy if exists "appointments_update" on appointments;

create policy "appointments_select"
  on appointments for select
  using (
    organization_id = get_user_org_id()
    and (
      is_cabinet_member()
      or client_id = auth.uid()
    )
  );

create policy "appointments_insert"
  on appointments for insert
  with check (
    organization_id = get_user_org_id()
    and get_user_role() in ('owner', 'admin', 'avocat', 'secretaire')
  );

create policy "appointments_update"
  on appointments for update
  using (
    organization_id = get_user_org_id()
    and get_user_role() in ('owner', 'admin', 'avocat', 'secretaire')
  );

-- -------------------------------------------------------
-- invoices
-- -------------------------------------------------------
drop policy if exists "invoices_select" on invoices;
drop policy if exists "invoices_insert" on invoices;
drop policy if exists "invoices_update" on invoices;

create policy "invoices_select"
  on invoices for select
  using (
    organization_id = get_user_org_id()
    and (
      is_cabinet_member()
      or client_id = auth.uid()
    )
  );

create policy "invoices_insert"
  on invoices for insert
  with check (
    organization_id = get_user_org_id()
    and get_user_role() in ('owner', 'admin', 'avocat')
  );

create policy "invoices_update"
  on invoices for update
  using (
    organization_id = get_user_org_id()
    and get_user_role() in ('owner', 'admin', 'avocat')
  );

create policy "invoice_lines_select"
  on invoice_lines for select
  using (
    invoice_id in (
      select id from invoices where organization_id = get_user_org_id()
    )
  );

create policy "invoice_lines_insert"
  on invoice_lines for insert
  with check (
    invoice_id in (
      select id from invoices where organization_id = get_user_org_id()
    )
    and get_user_role() in ('owner', 'admin', 'avocat')
  );

-- -------------------------------------------------------
-- insights
-- -------------------------------------------------------
drop policy if exists "insights_select" on insights;
drop policy if exists "insights_insert" on insights;
drop policy if exists "insights_update" on insights;

create policy "insights_select"
  on insights for select
  using (
    is_published = true
    or (
      organization_id = get_user_org_id()
      and is_cabinet_member()
    )
  );

create policy "insights_insert"
  on insights for insert
  with check (
    organization_id = get_user_org_id()
    and get_user_role() in ('owner', 'admin', 'avocat')
  );

create policy "insights_update"
  on insights for update
  using (
    organization_id = get_user_org_id()
    and get_user_role() in ('owner', 'admin', 'avocat')
  );

-- -------------------------------------------------------
-- deals
-- -------------------------------------------------------
drop policy if exists "deals_select" on deals;
drop policy if exists "deals_insert" on deals;
drop policy if exists "deals_update" on deals;

create policy "deals_select"
  on deals for select
  using (true);

create policy "deals_insert"
  on deals for insert
  with check (
    organization_id = get_user_org_id()
    and get_user_role() in ('owner', 'admin')
  );

create policy "deals_update"
  on deals for update
  using (
    organization_id = get_user_org_id()
    and get_user_role() in ('owner', 'admin')
  );