-- ============================================================================
-- 07 — INDEXES
-- ============================================================================
-- Index sur toutes les FK + colonnes filtrées fréquemment (status, dates).
-- Ne pas négliger : les RLS policies font des `WHERE col = auth.uid()` qui
-- font un seq scan sans index dès qu'on a > 1k lignes.
-- ============================================================================

-- profiles
create index profiles_email_idx          on public.profiles (email);
create index profiles_role_idx           on public.profiles (role);

-- avocats
create index avocats_email_idx           on public.avocats (email);
create index avocats_is_founding_partner_idx on public.avocats (is_founding_partner) where is_founding_partner = true;
create index avocats_display_order_idx   on public.avocats (display_order);

-- dossiers
create index dossiers_client_id_idx      on public.dossiers (client_id);
create index dossiers_status_idx         on public.dossiers (status);
create index dossiers_type_idx           on public.dossiers (type);
create index dossiers_opened_at_idx      on public.dossiers (opened_at desc);

-- dossier_avocats
create index dossier_avocats_avocat_id_idx  on public.dossier_avocats (avocat_id);

-- dossier_timeline
create index dossier_timeline_dossier_id_idx   on public.dossier_timeline (dossier_id);
create index dossier_timeline_status_idx       on public.dossier_timeline (status);
create index dossier_timeline_due_date_idx     on public.dossier_timeline (due_date) where due_date is not null;

-- documents
create index documents_dossier_id_idx       on public.documents (dossier_id);
create index documents_uploaded_by_idx      on public.documents (uploaded_by);
create index documents_category_idx         on public.documents (category);
create index documents_visible_to_client_idx on public.documents (visible_to_client);

-- messages
create index messages_dossier_id_idx        on public.messages (dossier_id);
create index messages_sender_id_idx         on public.messages (sender_id);
create index messages_created_at_idx        on public.messages (dossier_id, created_at desc);
create index messages_unread_idx            on public.messages (dossier_id) where read_at is null;

-- appointments
create index appointments_dossier_id_idx    on public.appointments (dossier_id);
create index appointments_client_id_idx     on public.appointments (client_id);
create index appointments_avocat_id_idx     on public.appointments (avocat_id);
create index appointments_starts_at_idx     on public.appointments (starts_at);
create index appointments_status_idx        on public.appointments (status);
create index appointments_reminders_idx     on public.appointments (starts_at)
  where status in ('scheduled', 'confirmed') and reminder_sent_j2 = false;

-- invoices
create index invoices_client_id_idx         on public.invoices (client_id);
create index invoices_dossier_id_idx        on public.invoices (dossier_id);
create index invoices_status_idx            on public.invoices (status);
create index invoices_due_at_idx            on public.invoices (due_at);
create index invoices_overdue_idx           on public.invoices (due_at)
  where status = 'sent';

-- invoice_lines
create index invoice_lines_invoice_id_idx   on public.invoice_lines (invoice_id);

-- insights
create index insights_author_id_idx         on public.insights (author_id);
create index insights_published_at_idx      on public.insights (published_at desc) where is_published = true;
create index insights_category_idx          on public.insights (category);

-- deals
create index deals_year_idx                 on public.deals (year desc);
create index deals_category_idx             on public.deals (category);
create index deals_is_featured_idx          on public.deals (is_featured) where is_featured = true;

-- deal_avocats
create index deal_avocats_avocat_id_idx     on public.deal_avocats (avocat_id);
