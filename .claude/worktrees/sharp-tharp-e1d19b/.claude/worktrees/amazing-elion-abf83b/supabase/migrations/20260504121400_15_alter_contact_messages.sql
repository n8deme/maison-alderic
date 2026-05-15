-- ============================================================
-- 15 — alter contact_messages : phone + demand_type
-- ============================================================

create type contact_demand_type as enum (
  'm_a',
  'private_equity',
  'litigation',
  'tax',
  'corporate',
  'restructuring',
  'other'
);

alter table contact_messages
  add column if not exists phone       text,
  add column if not exists demand_type contact_demand_type not null default 'other';
