-- ============================================================
-- MIGRATION 21 — Multi-tenant : ajout organization_id partout
-- À exécuter APRÈS la migration 20
-- ============================================================

-- ID de la démo Maison Aldéric (défini dans migration 20)
-- 'a0000000-0000-0000-0000-000000000001'

-- -------------------------------------------------------
-- profiles
-- -------------------------------------------------------
alter table profiles
  add column if not exists organization_id uuid references organizations(id) on delete cascade;

update profiles set organization_id = 'a0000000-0000-0000-0000-000000000001'
  where organization_id is null;

-- organization_id reste nullable dans profiles
-- pour permettre au trigger handle_new_user de créer des profils sans org

create index if not exists idx_profiles_org on profiles(organization_id);

-- -------------------------------------------------------
-- avocats
-- -------------------------------------------------------
alter table avocats
  add column organization_id uuid references organizations(id) on delete cascade;

update avocats set organization_id = 'a0000000-0000-0000-0000-000000000001'
  where organization_id is null;

alter table avocats
  alter column organization_id set not null;

create index idx_avocats_org on avocats(organization_id);

-- -------------------------------------------------------
-- dossiers
-- -------------------------------------------------------
alter table dossiers
  add column organization_id uuid references organizations(id) on delete cascade;

update dossiers set organization_id = 'a0000000-0000-0000-0000-000000000001'
  where organization_id is null;

alter table dossiers
  alter column organization_id set not null;

create index idx_dossiers_org on dossiers(organization_id);

-- -------------------------------------------------------
-- dossier_timeline
-- -------------------------------------------------------
alter table dossier_timeline
  add column organization_id uuid references organizations(id) on delete cascade;

update dossier_timeline set organization_id = 'a0000000-0000-0000-0000-000000000001'
  where organization_id is null;

alter table dossier_timeline
  alter column organization_id set not null;

create index idx_timeline_org on dossier_timeline(organization_id);

-- -------------------------------------------------------
-- documents
-- -------------------------------------------------------
alter table documents
  add column organization_id uuid references organizations(id) on delete cascade;

update documents set organization_id = 'a0000000-0000-0000-0000-000000000001'
  where organization_id is null;

alter table documents
  alter column organization_id set not null;

create index idx_documents_org on documents(organization_id);

-- -------------------------------------------------------
-- messages
-- -------------------------------------------------------
alter table messages
  add column organization_id uuid references organizations(id) on delete cascade;

update messages set organization_id = 'a0000000-0000-0000-0000-000000000001'
  where organization_id is null;

alter table messages
  alter column organization_id set not null;

create index idx_messages_org on messages(organization_id);

-- -------------------------------------------------------
-- appointments
-- -------------------------------------------------------
alter table appointments
  add column organization_id uuid references organizations(id) on delete cascade;

update appointments set organization_id = 'a0000000-0000-0000-0000-000000000001'
  where organization_id is null;

alter table appointments
  alter column organization_id set not null;

create index idx_appointments_org on appointments(organization_id);

-- -------------------------------------------------------
-- invoices
-- -------------------------------------------------------
alter table invoices
  add column organization_id uuid references organizations(id) on delete cascade;

update invoices set organization_id = 'a0000000-0000-0000-0000-000000000001'
  where organization_id is null;

alter table invoices
  alter column organization_id set not null;

create index idx_invoices_org on invoices(organization_id);

-- invoice_lines hérite via invoices, pas besoin d'organization_id direct

-- -------------------------------------------------------
-- insights
-- -------------------------------------------------------
alter table insights
  add column organization_id uuid references organizations(id) on delete cascade;

update insights set organization_id = 'a0000000-0000-0000-0000-000000000001'
  where organization_id is null;

alter table insights
  alter column organization_id set not null;

create index idx_insights_org on insights(organization_id);

-- -------------------------------------------------------
-- deals
-- -------------------------------------------------------
alter table deals
  add column organization_id uuid references organizations(id) on delete cascade;

update deals set organization_id = 'a0000000-0000-0000-0000-000000000001'
  where organization_id is null;

alter table deals
  alter column organization_id set not null;

create index idx_deals_org on deals(organization_id);
