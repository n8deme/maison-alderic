-- ============================================================
-- 14 — contact_messages table
-- ============================================================

create table if not exists contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  company     text,
  subject     text not null,
  message     text not null,
  is_read     boolean not null default false
);

-- RLS
alter table contact_messages enable row level security;

-- Allow anonymous inserts (public contact form)
create policy "anon can insert contact_messages"
  on contact_messages
  for insert
  to anon
  with check (true);

-- Only authenticated users (staff) can read
create policy "auth can read contact_messages"
  on contact_messages
  for select
  to authenticated
  using (true);

-- Only authenticated users can update (mark as read)
create policy "auth can update contact_messages"
  on contact_messages
  for update
  to authenticated
  using (true);
