-- ============================================================
-- MIGRATION 20 — Multi-tenant : table organizations
-- LawyerOS — pivot SaaS
-- ============================================================

-- -------------------------------------------------------
-- TABLE : organizations
-- Chaque cabinet d'avocats = 1 organisation = 1 tenant
-- -------------------------------------------------------
create table organizations (
  id            uuid primary key default gen_random_uuid(),

  -- Identité
  name          text not null,                          -- "Cabinet Dupont & Associés"
  slug          text not null unique,                   -- "cabinet-dupont" → sous-domaine
  
  -- Branding white-label
  logo_url      text,
  primary_color text not null default '#1A1A1A',        -- couleur principale UI
  accent_color  text not null default '#7A1F2B',        -- couleur accent/CTA

  -- Contact
  address       text,
  phone         text,
  contact_email text,
  website_url   text,

  -- Domaines
  subdomain     text not null unique,                   -- "cabinet-dupont" dans cabinet-dupont.lawyeros.app
  domain_custom text unique,                            -- "portail.dupont-avocats.be" (option Premium)

  -- Abonnement Stripe
  stripe_customer_id      text unique,
  stripe_subscription_id  text unique,
  plan          text not null default 'trial',          -- 'trial' | 'solo' | 'cabinet' | 'premium'
  plan_interval text not null default 'monthly',        -- 'monthly' | 'yearly'
  is_active     boolean not null default true,
  trial_ends_at timestamptz default (now() + interval '14 days'),
  
  -- Setup fee
  setup_paid    boolean not null default false,

  -- Feature flags (pour activer/désactiver par plan)
  feature_esignature      boolean not null default false,  -- Yousign, inactif MVP
  feature_custom_domain   boolean not null default false,  -- Premium only
  feature_ai_summary      boolean not null default false,  -- Premium only
  feature_intake_forms    boolean not null default false,  -- Cabinet + Premium

  -- Metadata
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Index utiles
create index idx_organizations_slug      on organizations(slug);
create index idx_organizations_subdomain on organizations(subdomain);
create index idx_organizations_plan      on organizations(plan);

-- Trigger updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger organizations_updated_at
  before update on organizations
  for each row execute function update_updated_at();

-- -------------------------------------------------------
-- TABLE : organization_members
-- Lien entre un user auth et une organisation, avec son rôle
-- -------------------------------------------------------
create table organization_members (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id         uuid not null references auth.users(id) on delete cascade,
  
  role            text not null default 'avocat',
  -- 'owner'      → associé fondateur, voit tout, gère la facturation SaaS
  -- 'admin'      → gère les membres et paramètres, pas la facturation
  -- 'avocat'     → accès à ses dossiers assignés
  -- 'secretaire' → accès lecture + création RDV
  -- 'client'     → accès portail client (ses dossiers uniquement)

  invited_by      uuid references auth.users(id),
  joined_at       timestamptz default now(),
  
  unique(organization_id, user_id)
);

create index idx_org_members_org  on organization_members(organization_id);
create index idx_org_members_user on organization_members(user_id);

-- -------------------------------------------------------
-- RLS : organizations
-- -------------------------------------------------------
alter table organizations enable row level security;

-- Un member peut lire son organisation
create policy "org_select_member"
  on organizations for select
  using (
    id in (
      select organization_id from organization_members
      where user_id = auth.uid()
    )
  );

-- Seul l'owner peut modifier son organisation
create policy "org_update_owner"
  on organizations for update
  using (
    id in (
      select organization_id from organization_members
      where user_id = auth.uid() and role = 'owner'
    )
  );

-- L'insert se fait uniquement via la fonction create_organization (service role)
-- Pas de policy INSERT pour les users normaux

-- -------------------------------------------------------
-- RLS : organization_members
-- -------------------------------------------------------
alter table organization_members enable row level security;

-- Un member voit tous les membres de son organisation
create policy "org_members_select"
  on organization_members for select
  using (
    organization_id in (
      select organization_id from organization_members
      where user_id = auth.uid()
    )
  );

-- Owner/admin peut inviter des membres
create policy "org_members_insert_admin"
  on organization_members for insert
  with check (
    organization_id in (
      select organization_id from organization_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

-- Owner/admin peut modifier les rôles
create policy "org_members_update_admin"
  on organization_members for update
  using (
    organization_id in (
      select organization_id from organization_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

-- Owner/admin peut supprimer des membres (pas se supprimer soi-même si owner)
create policy "org_members_delete_admin"
  on organization_members for delete
  using (
    organization_id in (
      select organization_id from organization_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
    and user_id != auth.uid() -- on peut pas se virer soi-même
  );

-- -------------------------------------------------------
-- FONCTION : create_organization
-- Crée l'org + ajoute le créateur comme owner en une transaction
-- Appelée depuis Next.js avec service role key
-- -------------------------------------------------------
create or replace function create_organization(
  p_name          text,
  p_slug          text,
  p_subdomain     text,
  p_contact_email text,
  p_user_id       uuid
)
returns organizations
language plpgsql security definer as $$
declare
  v_org organizations;
begin
  -- Vérifier que le slug est unique
  if exists (select 1 from organizations where slug = p_slug) then
    raise exception 'slug_already_taken';
  end if;

  -- Vérifier que le subdomain est unique
  if exists (select 1 from organizations where subdomain = p_subdomain) then
    raise exception 'subdomain_already_taken';
  end if;

  -- Créer l'organisation
  insert into organizations (name, slug, subdomain, contact_email)
  values (p_name, p_slug, p_subdomain, p_contact_email)
  returning * into v_org;

  -- Ajouter le créateur comme owner
  insert into organization_members (organization_id, user_id, role)
  values (v_org.id, p_user_id, 'owner');

  return v_org;
end;
$$;

-- -------------------------------------------------------
-- SEED : Organisation démo Maison Aldéric
-- -------------------------------------------------------
insert into organizations (
  id,
  name,
  slug,
  subdomain,
  logo_url,
  primary_color,
  accent_color,
  address,
  phone,
  contact_email,
  plan,
  is_active,
  setup_paid,
  trial_ends_at,
  feature_esignature,
  feature_custom_domain,
  feature_ai_summary,
  feature_intake_forms
) values (
  'a0000000-0000-0000-0000-000000000001',
  'Maison Aldéric & Associés',
  'maison-alderic',
  'maison-alderic',
  null,
  '#1A1A1A',
  '#7A1F2B',
  'Avenue Louise 480, 1050 Bruxelles',
  '+32 2 000 00 00',
  'contact@maison-alderic.be',
  'premium',
  true,
  true,
  null,   -- pas de trial, c'est la démo permanente
  true,
  true,
  true,
  true
);

-- Lecture publique des organizations (nécessaire pour le middleware)
create policy "organizations_public_read"
  on organizations for select
  using (true);