-- ============================================================================
-- 01 — EXTENSIONS
-- ============================================================================
-- Maison Aldéric & Associés — Schema initial
-- ============================================================================

create extension if not exists "uuid-ossp"   with schema extensions;
create extension if not exists "pgcrypto"    with schema extensions;
create extension if not exists "citext"      with schema extensions;

-- Schema dédié aux helper functions sécurisées (RLS)
create schema if not exists private;

-- L'utilisateur authentifié peut exécuter les fonctions (mais pas voir le schema)
revoke all on schema private from public;
grant usage on schema private to anon, authenticated, service_role;
