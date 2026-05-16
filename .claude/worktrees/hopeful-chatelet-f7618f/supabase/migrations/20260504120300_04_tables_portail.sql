-- ============================================================================
-- 04 — TABLES PORTAIL CLIENT
-- ============================================================================
-- dossiers, dossier_avocats, dossier_timeline,
-- documents, messages, appointments, invoices, invoice_lines
-- ============================================================================

-- DOSSIERS ---------------------------------------------------------------------
create table public.dossiers (
  id                  uuid primary key default gen_random_uuid(),
  reference           text not null unique,
  title               text not null,
  description         text,
  status              dossier_status not null default 'active',
  type                dossier_type not null,
  client_id           uuid not null references public.profiles(id) on delete restrict,
  budget_estimated    numeric(12, 2),
  budget_consumed     numeric(12, 2) not null default 0,
  opened_at           timestamptz not null default now(),
  closed_at           timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.dossiers is 'Dossiers clients. Lead avocat et team gérés via dossier_avocats.';

-- DOSSIER_AVOCATS (jointure dossier ↔ avocat avec rôle) -----------------------
create table public.dossier_avocats (
  dossier_id    uuid not null references public.dossiers(id) on delete cascade,
  avocat_id     uuid not null references public.avocats(id) on delete restrict,
  role          dossier_avocat_role not null default 'support',
  assigned_at   timestamptz not null default now(),
  primary key (dossier_id, avocat_id)
);

-- 1 seul lead par dossier (partial unique index)
create unique index dossier_avocats_unique_lead
  on public.dossier_avocats (dossier_id)
  where role = 'lead';

comment on table public.dossier_avocats is 'Équipe avocats sur un dossier. Max 1 lead par dossier (enforced via partial unique index).';

-- DOSSIER_TIMELINE -------------------------------------------------------------
create table public.dossier_timeline (
  id              uuid primary key default gen_random_uuid(),
  dossier_id      uuid not null references public.dossiers(id) on delete cascade,
  title           text not null,
  description     text,
  status          timeline_status not null default 'pending',
  due_date        timestamptz,
  completed_at    timestamptz,
  created_by      uuid references public.avocats(id) on delete set null,
  display_order   int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.dossier_timeline is 'Étapes/jalons d''un dossier — visualisation timeline côté portail.';

-- DOCUMENTS --------------------------------------------------------------------
create table public.documents (
  id                  uuid primary key default gen_random_uuid(),
  dossier_id          uuid not null references public.dossiers(id) on delete cascade,
  name                text not null,
  description         text,
  file_path           text not null,
  file_size           bigint not null,
  mime_type           text not null,
  category            document_category not null default 'other',
  is_signed           boolean not null default false,
  signed_at           timestamptz,
  uploaded_by         uuid not null references public.profiles(id) on delete restrict,
  visible_to_client   boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on column public.documents.file_path is 'Path Supabase Storage : {dossier_id}/{filename}';
comment on column public.documents.visible_to_client is 'Si false, document de travail interne non visible côté client.';

-- MESSAGES ---------------------------------------------------------------------
create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  dossier_id      uuid not null references public.dossiers(id) on delete cascade,
  sender_id       uuid not null references public.profiles(id) on delete restrict,
  sender_type     message_sender_type not null,
  content         text not null,
  read_at         timestamptz,
  attachments     jsonb not null default '[]'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.messages is 'Thread de messages par dossier. attachments = array d''objets {name, file_path, size}.';

-- APPOINTMENTS -----------------------------------------------------------------
create table public.appointments (
  id                  uuid primary key default gen_random_uuid(),
  dossier_id          uuid references public.dossiers(id) on delete set null,
  client_id           uuid not null references public.profiles(id) on delete restrict,
  avocat_id           uuid not null references public.avocats(id) on delete restrict,
  title               text not null,
  description         text,
  starts_at           timestamptz not null,
  ends_at             timestamptz not null,
  location            text,
  status              appointment_status not null default 'scheduled',
  reminder_sent_j2    boolean not null default false,
  reminder_sent_j1    boolean not null default false,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint appointment_starts_before_ends check (starts_at < ends_at)
);

-- INVOICES ---------------------------------------------------------------------
create table public.invoices (
  id                  uuid primary key default gen_random_uuid(),
  invoice_number      text not null unique,
  client_id           uuid not null references public.profiles(id) on delete restrict,
  dossier_id          uuid references public.dossiers(id) on delete set null,
  amount_ht           numeric(12, 2) not null,
  vat_amount          numeric(12, 2) not null,
  amount_ttc          numeric(12, 2) not null,
  status              invoice_status not null default 'draft',
  issued_at           timestamptz,
  due_at              timestamptz,
  paid_at             timestamptz,
  stripe_invoice_id   text unique,
  reminder_level      int not null default 0 check (reminder_level >= 0 and reminder_level <= 3),
  pdf_url             text,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint invoice_amount_ttc_positive check (amount_ttc >= 0)
);

comment on column public.invoices.reminder_level is '0=aucune, 1=J+7 douce, 2=J+14 ferme, 3=J+21 mise en demeure';

-- INVOICE_LINES ----------------------------------------------------------------
create table public.invoice_lines (
  id              uuid primary key default gen_random_uuid(),
  invoice_id      uuid not null references public.invoices(id) on delete cascade,
  description     text not null,
  quantity        numeric(10, 2) not null default 1,
  unit_price      numeric(12, 2) not null,
  total           numeric(12, 2) not null,
  display_order   int not null default 0,
  created_at      timestamptz not null default now()
);
