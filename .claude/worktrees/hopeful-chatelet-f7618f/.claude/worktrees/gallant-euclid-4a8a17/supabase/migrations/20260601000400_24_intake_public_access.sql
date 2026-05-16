-- -------------------------------------------------------
-- Migration 24 : accès public aux formulaires intake
-- Nécessaire pour que /intake/[token] fonctionne sans auth
-- -------------------------------------------------------

-- Permettre aux utilisateurs anonymes de lire les formulaires actifs
create policy "intake_forms_anon_select"
  on intake_forms for select
  to anon
  using (is_active = true);

-- Permettre aux utilisateurs anonymes de soumettre une réponse
-- uniquement si le formulaire existe et est actif
create policy "intake_responses_anon_insert"
  on intake_responses for insert
  to anon
  with check (
    exists (
      select 1 from intake_forms
      where id = intake_form_id
        and is_active = true
    )
  );
