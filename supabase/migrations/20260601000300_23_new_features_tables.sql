-- ============================================================
-- MIGRATION 23 — Nouvelles tables features LawyerOS
-- notes, time_entries, intake_forms, conflict_checks
-- ============================================================

-- -------------------------------------------------------
-- TABLE : notes
-- Notes dans un dossier — internes (avocat only) ou partagées
-- -------------------------------------------------------
create table notes (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  dossier_id      uuid not null references dossiers(id) on delete cascade,
  author_id       uuid not null references auth.users(id),
  author_type     text not null, -- 'avocat' | 'client'
  content         text not null,
  is_internal     boolean not null default false,
  -- true  = visible uniquement par le cabinet (avocat, admin, owner)
  -- false = visible par le cabinet ET le client du dossier
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_notes_dossier on notes(dossier_id);
create index idx_notes_org     on notes(organization_id);
create index idx_notes_author  on notes(author_id);

create trigger notes_updated_at
  before update on notes
  for each row execute function update_updated_at();

-- RLS notes
alter table notes enable row level security;

-- SELECT :
-- - cabinet → toutes les notes de l'org (internes + partagées)
-- - client  → uniquement les notes non-internes de ses dossiers
create policy "notes_select"
  on notes for select
  using (
    organization_id = get_user_org_id()
    and (
      is_cabinet_member()
      or (
        is_internal = false
        and dossier_id in (
          select id from dossiers where client_id = auth.uid()
        )
      )
    )
  );

-- INSERT :
-- - cabinet → peut créer des notes internes ou partagées
-- - client  → peut créer des notes partagées uniquement (is_internal forcé false)
create policy "notes_insert"
  on notes for insert
  with check (
    organization_id = get_user_org_id()
    and author_id = auth.uid()
    and (
      is_cabinet_member()
      or (
        get_user_role() = 'client'
        and is_internal = false
        and dossier_id in (
          select id from dossiers where client_id = auth.uid()
        )
      )
    )
  );

-- UPDATE : uniquement l'auteur de la note
create policy "notes_update"
  on notes for update
  using (
    organization_id = get_user_org_id()
    and author_id = auth.uid()
  );

-- DELETE : auteur ou owner/admin
create policy "notes_delete"
  on notes for delete
  using (
    organization_id = get_user_org_id()
    and (
      author_id = auth.uid()
      or get_user_role() in ('owner', 'admin')
    )
  );

-- -------------------------------------------------------
-- TABLE : time_entries
-- Saisie du temps facturable par dossier
-- -------------------------------------------------------
create table time_entries (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  dossier_id      uuid not null references dossiers(id) on delete cascade,
  avocat_id       uuid not null references avocats(id),
  description     text not null,
  duration_minutes int not null check (duration_minutes > 0),
  rate_per_hour   numeric(10,2) not null, -- taux horaire au moment de la saisie
  total_amount    numeric(10,2) generated always as (
    round((duration_minutes::numeric / 60) * rate_per_hour, 2)
  ) stored,
  billed          boolean not null default false,
  invoice_id      uuid references invoices(id) on delete set null, -- lié si facturé
  date            date not null default current_date,
  created_at      timestamptz not null default now()
);

create index idx_time_entries_dossier on time_entries(dossier_id);
create index idx_time_entries_org     on time_entries(organization_id);
create index idx_time_entries_avocat  on time_entries(avocat_id);
create index idx_time_entries_billed  on time_entries(billed);

alter table time_entries enable row level security;

-- SELECT : membres du cabinet uniquement (pas visible client)
create policy "time_entries_select"
  on time_entries for select
  using (
    organization_id = get_user_org_id()
    and is_cabinet_member()
  );

create policy "time_entries_insert"
  on time_entries for insert
  with check (
    organization_id = get_user_org_id()
    and get_user_role() in ('owner', 'admin', 'avocat')
  );

create policy "time_entries_update"
  on time_entries for update
  using (
    organization_id = get_user_org_id()
    and get_user_role() in ('owner', 'admin', 'avocat')
    and billed = false -- on peut plus modifier si déjà facturé
  );

create policy "time_entries_delete"
  on time_entries for delete
  using (
    organization_id = get_user_org_id()
    and get_user_role() in ('owner', 'admin')
    and billed = false
  );

-- -------------------------------------------------------
-- TABLE : intake_forms
-- Questionnaires envoyés aux clients avant premier RDV
-- -------------------------------------------------------
create table intake_forms (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  title           text not null,
  description     text,
  fields          jsonb not null default '[]',
  -- structure fields : [
  --   { "id": "uuid", "type": "text|textarea|date|select|file", 
  --     "label": "...", "required": true, "options": ["..."] }
  -- ]
  is_active       boolean not null default true,
  created_by      uuid references auth.users(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_intake_forms_org on intake_forms(organization_id);

create trigger intake_forms_updated_at
  before update on intake_forms
  for each row execute function update_updated_at();

alter table intake_forms enable row level security;

create policy "intake_forms_select"
  on intake_forms for select
  using (organization_id = get_user_org_id());

create policy "intake_forms_insert"
  on intake_forms for insert
  with check (
    organization_id = get_user_org_id()
    and get_user_role() in ('owner', 'admin', 'avocat')
  );

create policy "intake_forms_update"
  on intake_forms for update
  using (
    organization_id = get_user_org_id()
    and get_user_role() in ('owner', 'admin', 'avocat')
  );

-- -------------------------------------------------------
-- TABLE : intake_responses
-- Réponses des clients aux questionnaires
-- -------------------------------------------------------
create table intake_responses (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  intake_form_id  uuid not null references intake_forms(id) on delete cascade,
  client_id       uuid references auth.users(id),
  dossier_id      uuid references dossiers(id) on delete set null,
  responses       jsonb not null default '{}',
  -- structure : { "field_id": "valeur", ... }
  submitted_at    timestamptz not null default now()
);

create index idx_intake_responses_org    on intake_responses(organization_id);
create index idx_intake_responses_client on intake_responses(client_id);
create index idx_intake_responses_form   on intake_responses(intake_form_id);

alter table intake_responses enable row level security;

-- Cabinet voit toutes les réponses, client voit les siennes
create policy "intake_responses_select"
  on intake_responses for select
  using (
    organization_id = get_user_org_id()
    and (
      is_cabinet_member()
      or client_id = auth.uid()
    )
  );

create policy "intake_responses_insert"
  on intake_responses for insert
  with check (
    organization_id = get_user_org_id()
    and client_id = auth.uid()
  );

-- -------------------------------------------------------
-- TABLE : conflict_checks
-- Log des vérifications conflits d'intérêts
-- -------------------------------------------------------
create table conflict_checks (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  checked_by      uuid not null references auth.users(id),
  query           text not null,          -- le nom recherché
  result          jsonb not null default '{}',
  -- structure : {
  --   "has_conflict": false,
  --   "matches": [ { "dossier_id": "...", "dossier_ref": "MA-2026-0012", "match_type": "client|adverse_party" } ]
  -- }
  created_at      timestamptz not null default now()
);

create index idx_conflict_checks_org on conflict_checks(organization_id);

alter table conflict_checks enable row level security;

-- Cabinet uniquement
create policy "conflict_checks_select"
  on conflict_checks for select
  using (
    organization_id = get_user_org_id()
    and is_cabinet_member()
  );

create policy "conflict_checks_insert"
  on conflict_checks for insert
  with check (
    organization_id = get_user_org_id()
    and is_cabinet_member()
    and checked_by = auth.uid()
  );

-- -------------------------------------------------------
-- TABLE : audit_logs
-- Traçabilité RGPD de toutes les actions sensibles
-- -------------------------------------------------------
create table audit_logs (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  user_id         uuid references auth.users(id),
  action          text not null,
  -- ex: 'document.viewed' | 'invoice.paid' | 'dossier.created' | 'member.invited'
  resource_type   text,
  resource_id     uuid,
  metadata        jsonb default '{}',
  ip_address      text,
  user_agent      text,
  created_at      timestamptz not null default now()
);

create index idx_audit_logs_org      on audit_logs(organization_id);
create index idx_audit_logs_user     on audit_logs(user_id);
create index idx_audit_logs_action   on audit_logs(action);
create index idx_audit_logs_created  on audit_logs(created_at desc);

alter table audit_logs enable row level security;

-- Owner/admin peuvent consulter les logs de leur org
create policy "audit_logs_select"
  on audit_logs for select
  using (
    organization_id = get_user_org_id()
    and get_user_role() in ('owner', 'admin')
  );

-- INSERT uniquement via service role (pas de policy user)
-- Les logs sont insérés depuis Next.js avec la service role key
