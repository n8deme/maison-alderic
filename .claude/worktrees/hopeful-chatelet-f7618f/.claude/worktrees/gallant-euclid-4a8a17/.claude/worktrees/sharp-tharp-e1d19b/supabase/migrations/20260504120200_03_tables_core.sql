-- ============================================================================
-- 03 — TABLES CORE (profiles + avocats)
-- ============================================================================
-- profiles : extension de auth.users (un par compte authentifié)
-- avocats  : équipe interne du cabinet, lié à auth.users via user_id
-- ============================================================================

create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        extensions.citext not null unique,
  full_name    text not null,
  company      text,
  role         user_role not null default 'client',
  phone        text,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.profiles is 'Profils utilisateurs liés à auth.users (clients du cabinet ET avocats internes).';

-- ----------------------------------------------------------------------------

create table public.avocats (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid unique references auth.users(id) on delete set null,
  full_name             text not null,
  title                 avocat_title not null,
  expertises            text[] not null default array[]::text[],
  email                 extensions.citext not null unique,
  phone                 text,
  bio                   text,
  avatar_url            text,
  linkedin_url          text,
  bar_admission         text,
  languages             text[] not null default array['FR', 'NL', 'EN'],
  is_founding_partner   boolean not null default false,
  display_order         int not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

comment on table public.avocats is 'Équipe interne du cabinet. user_id permet à l''avocat de se logger au portail.';
comment on column public.avocats.user_id is 'FK vers auth.users — null si l''avocat n''a pas (encore) de compte auth.';
