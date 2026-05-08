-- ============================================================================
-- 02 — ENUMS
-- ============================================================================
-- Tous les statuts en types stricts pour éviter les valeurs implicites
-- ============================================================================

create type user_role as enum ('client', 'avocat', 'admin');

create type avocat_title as enum (
  'Associé fondateur',
  'Associée fondatrice',
  'Associé',
  'Associée',
  'Counsel',
  'Senior Associate'
);

create type dossier_status as enum (
  'active',
  'pending',
  'archived',
  'won',
  'lost'
);

create type dossier_type as enum (
  'M&A',
  'Litigation',
  'Tax',
  'Corporate',
  'PE',
  'Restructuring'
);

create type dossier_avocat_role as enum ('lead', 'support');

create type timeline_status as enum ('pending', 'in_progress', 'completed');

create type document_category as enum (
  'contract',
  'mandat',
  'pleading',
  'correspondence',
  'other'
);

create type message_sender_type as enum ('client', 'avocat');

create type appointment_status as enum (
  'scheduled',
  'confirmed',
  'completed',
  'cancelled'
);

create type invoice_status as enum (
  'draft',
  'sent',
  'paid',
  'overdue',
  'cancelled'
);

create type insight_category as enum (
  'M&A',
  'Tax',
  'Litigation',
  'Corporate',
  'Regulatory'
);

create type deal_category as enum ('M&A', 'PE', 'Restructuring');
