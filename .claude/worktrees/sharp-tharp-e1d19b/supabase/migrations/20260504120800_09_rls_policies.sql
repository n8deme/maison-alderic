-- ============================================================================
-- 09 — ROW LEVEL SECURITY POLICIES
-- ============================================================================
-- RLS activée sur TOUTES les tables. Lecture publique sur insights/deals/avocats
-- (et leur jointure deal_avocats) — explicite via une policy "select_all".
-- ============================================================================

-- ============================================================================
-- ENABLE RLS
-- ============================================================================
alter table public.profiles            enable row level security;
alter table public.avocats             enable row level security;
alter table public.dossiers            enable row level security;
alter table public.dossier_avocats     enable row level security;
alter table public.dossier_timeline    enable row level security;
alter table public.documents           enable row level security;
alter table public.messages            enable row level security;
alter table public.appointments        enable row level security;
alter table public.invoices            enable row level security;
alter table public.invoice_lines       enable row level security;
alter table public.insights            enable row level security;
alter table public.deals               enable row level security;
alter table public.deal_avocats        enable row level security;

-- Force RLS même pour les owners de tables (sécurité supplémentaire)
alter table public.profiles            force row level security;
alter table public.dossiers            force row level security;
alter table public.dossier_avocats     force row level security;
alter table public.dossier_timeline    force row level security;
alter table public.documents           force row level security;
alter table public.messages            force row level security;
alter table public.appointments        force row level security;
alter table public.invoices            force row level security;
alter table public.invoice_lines       force row level security;

-- ============================================================================
-- PROFILES
-- ============================================================================
create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles_select_internal"
  on public.profiles for select
  using (private.is_internal(auth.uid()));

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles_update_partner"
  on public.profiles for update
  using (private.is_partner(auth.uid()))
  with check (private.is_partner(auth.uid()));

-- INSERT géré par trigger handle_new_user (security definer) — pas de policy nécessaire

-- ============================================================================
-- AVOCATS (lecture publique)
-- ============================================================================
create policy "avocats_select_all"
  on public.avocats for select
  using (true);

create policy "avocats_update_own"
  on public.avocats for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "avocats_manage_partner"
  on public.avocats for all
  using (private.is_partner(auth.uid()))
  with check (private.is_partner(auth.uid()));

-- ============================================================================
-- DOSSIERS
-- ============================================================================
create policy "dossiers_select_client"
  on public.dossiers for select
  using (client_id = auth.uid());

create policy "dossiers_select_member"
  on public.dossiers for select
  using (private.is_dossier_member(auth.uid(), id));

create policy "dossiers_select_partner"
  on public.dossiers for select
  using (private.is_partner(auth.uid()));

create policy "dossiers_insert_internal"
  on public.dossiers for insert
  with check (private.is_internal(auth.uid()));

create policy "dossiers_update_member"
  on public.dossiers for update
  using (private.is_dossier_member(auth.uid(), id) or private.is_partner(auth.uid()))
  with check (private.is_dossier_member(auth.uid(), id) or private.is_partner(auth.uid()));

create policy "dossiers_delete_partner"
  on public.dossiers for delete
  using (private.is_partner(auth.uid()));

-- ============================================================================
-- DOSSIER_AVOCATS
-- ============================================================================
create policy "dossier_avocats_select_internal"
  on public.dossier_avocats for select
  using (private.is_internal(auth.uid()));

create policy "dossier_avocats_select_client"
  on public.dossier_avocats for select
  using (
    exists (
      select 1 from public.dossiers d
      where d.id = dossier_avocats.dossier_id and d.client_id = auth.uid()
    )
  );

create policy "dossier_avocats_manage_internal"
  on public.dossier_avocats for all
  using (private.is_internal(auth.uid()))
  with check (private.is_internal(auth.uid()));

-- ============================================================================
-- DOSSIER_TIMELINE
-- ============================================================================
create policy "dossier_timeline_select_via_dossier"
  on public.dossier_timeline for select
  using (
    exists (
      select 1 from public.dossiers d
      where d.id = dossier_timeline.dossier_id
        and (
          d.client_id = auth.uid()
          or private.is_dossier_member(auth.uid(), d.id)
          or private.is_partner(auth.uid())
        )
    )
  );

create policy "dossier_timeline_manage_internal"
  on public.dossier_timeline for all
  using (private.is_internal(auth.uid()))
  with check (private.is_internal(auth.uid()));

-- ============================================================================
-- DOCUMENTS
-- ============================================================================
create policy "documents_select_client"
  on public.documents for select
  using (
    visible_to_client = true
    and exists (
      select 1 from public.dossiers d
      where d.id = documents.dossier_id and d.client_id = auth.uid()
    )
  );

create policy "documents_select_internal"
  on public.documents for select
  using (
    private.is_dossier_member(auth.uid(), dossier_id)
    or private.is_partner(auth.uid())
  );

create policy "documents_insert_member"
  on public.documents for insert
  with check (
    auth.uid() is not null
    and (
      exists (
        select 1 from public.dossiers d
        where d.id = documents.dossier_id and d.client_id = auth.uid()
      )
      or private.is_dossier_member(auth.uid(), dossier_id)
      or private.is_partner(auth.uid())
    )
  );

create policy "documents_update_internal"
  on public.documents for update
  using (private.is_internal(auth.uid()))
  with check (private.is_internal(auth.uid()));

create policy "documents_delete_internal"
  on public.documents for delete
  using (private.is_internal(auth.uid()));

-- ============================================================================
-- MESSAGES
-- ============================================================================
create policy "messages_select_participant"
  on public.messages for select
  using (
    exists (
      select 1 from public.dossiers d
      where d.id = messages.dossier_id
        and (
          d.client_id = auth.uid()
          or private.is_dossier_member(auth.uid(), d.id)
          or private.is_partner(auth.uid())
        )
    )
  );

create policy "messages_insert_participant"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.dossiers d
      where d.id = messages.dossier_id
        and (
          d.client_id = auth.uid()
          or private.is_dossier_member(auth.uid(), d.id)
          or private.is_partner(auth.uid())
        )
    )
  );

create policy "messages_update_participant_read"
  on public.messages for update
  using (
    exists (
      select 1 from public.dossiers d
      where d.id = messages.dossier_id
        and (
          d.client_id = auth.uid()
          or private.is_dossier_member(auth.uid(), d.id)
          or private.is_partner(auth.uid())
        )
    )
  );

-- ============================================================================
-- APPOINTMENTS
-- ============================================================================
create policy "appointments_select_participant"
  on public.appointments for select
  using (
    client_id = auth.uid()
    or avocat_id in (select id from public.avocats where user_id = auth.uid())
    or private.is_partner(auth.uid())
  );

create policy "appointments_insert_internal"
  on public.appointments for insert
  with check (private.is_internal(auth.uid()));

create policy "appointments_update_participant"
  on public.appointments for update
  using (
    client_id = auth.uid()
    or avocat_id in (select id from public.avocats where user_id = auth.uid())
    or private.is_partner(auth.uid())
  );

create policy "appointments_delete_internal"
  on public.appointments for delete
  using (private.is_internal(auth.uid()));

-- ============================================================================
-- INVOICES (pas de delete — traçabilité comptable)
-- ============================================================================
create policy "invoices_select_client"
  on public.invoices for select
  using (client_id = auth.uid());

create policy "invoices_select_internal"
  on public.invoices for select
  using (private.is_internal(auth.uid()));

create policy "invoices_insert_internal"
  on public.invoices for insert
  with check (private.is_internal(auth.uid()));

create policy "invoices_update_internal"
  on public.invoices for update
  using (private.is_internal(auth.uid()))
  with check (private.is_internal(auth.uid()));

-- Pas de DELETE policy → impossible de delete une facture via l'API

-- ============================================================================
-- INVOICE_LINES
-- ============================================================================
create policy "invoice_lines_select_via_invoice"
  on public.invoice_lines for select
  using (
    exists (
      select 1 from public.invoices i
      where i.id = invoice_lines.invoice_id
        and (i.client_id = auth.uid() or private.is_internal(auth.uid()))
    )
  );

create policy "invoice_lines_manage_internal"
  on public.invoice_lines for all
  using (private.is_internal(auth.uid()))
  with check (private.is_internal(auth.uid()));

-- ============================================================================
-- INSIGHTS (lecture publique des publiés)
-- ============================================================================
create policy "insights_select_published"
  on public.insights for select
  using (is_published = true);

create policy "insights_select_internal"
  on public.insights for select
  using (private.is_internal(auth.uid()));

create policy "insights_manage_internal"
  on public.insights for all
  using (private.is_internal(auth.uid()))
  with check (private.is_internal(auth.uid()));

-- ============================================================================
-- DEALS (lecture publique)
-- ============================================================================
create policy "deals_select_all"
  on public.deals for select
  using (true);

create policy "deals_manage_partner"
  on public.deals for all
  using (private.is_partner(auth.uid()))
  with check (private.is_partner(auth.uid()));

-- ============================================================================
-- DEAL_AVOCATS (lecture publique)
-- ============================================================================
create policy "deal_avocats_select_all"
  on public.deal_avocats for select
  using (true);

create policy "deal_avocats_manage_partner"
  on public.deal_avocats for all
  using (private.is_partner(auth.uid()))
  with check (private.is_partner(auth.uid()));
