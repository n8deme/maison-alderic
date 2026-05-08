-- ============================================================================
-- 05 — TABLES PUBLIQUES (insights + deals + deal_avocats)
-- ============================================================================
-- Lecture publique (anon) sur ces tables — contenus du site vitrine
-- ============================================================================

-- INSIGHTS ---------------------------------------------------------------------
create table public.insights (
  id                      uuid primary key default gen_random_uuid(),
  slug                    text not null unique,
  title                   text not null,
  subtitle                text,
  excerpt                 text not null,
  content                 text not null,
  category                insight_category not null,
  author_id               uuid not null references public.avocats(id) on delete restrict,
  cover_image_url         text,
  published_at            timestamptz,
  is_published            boolean not null default false,
  reading_time_minutes    int,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

comment on table public.insights is 'Articles éditoriaux publiés sur /insights — markdown dans content.';

-- DEALS ------------------------------------------------------------------------
create table public.deals (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  client_name     text not null,
  description     text not null,
  amount_label    text,
  year            int not null,
  category        deal_category not null,
  is_featured     boolean not null default false,
  display_order   int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on column public.deals.amount_label is 'Label d''affichage du montant (ex: "240M€"), pas le montant exact';

-- DEAL_AVOCATS (jointure deal ↔ avocat) ----------------------------------------
create table public.deal_avocats (
  deal_id       uuid not null references public.deals(id) on delete cascade,
  avocat_id     uuid not null references public.avocats(id) on delete restrict,
  role          dossier_avocat_role not null default 'lead',
  assigned_at   timestamptz not null default now(),
  primary key (deal_id, avocat_id)
);

comment on table public.deal_avocats is 'Avocats ayant travaillé sur un deal — affiché publiquement sur la page deal.';
