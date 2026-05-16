-- ============================================================================
-- 10 — STORAGE BUCKET `documents`
-- ============================================================================
-- Convention de path : {dossier_id}/{filename}
-- → permet de déduire le dossier_id depuis le path et de tester l'accès.
-- ============================================================================

-- Création du bucket (privé)
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- POLICY : SELECT — lire un fichier
-- ----------------------------------------------------------------------------
-- Le client peut lire un fichier si :
--   • il est dans le bucket "documents"
--   • le 1er segment du path correspond à un dossier dont il est client
--   • un row dans `documents` existe avec ce file_path et visible_to_client=true
-- L'avocat peut lire si membre du dossier ou associé fondateur.
-- ----------------------------------------------------------------------------
create policy "documents_storage_select_client"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and exists (
      select 1
      from public.dossiers d
      join public.documents doc on doc.dossier_id = d.id
      where d.id = ((storage.foldername(name))[1])::uuid
        and doc.file_path = name
        and doc.visible_to_client = true
        and d.client_id = auth.uid()
    )
  );

create policy "documents_storage_select_internal"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and (
      private.is_dossier_member(
        auth.uid(),
        ((storage.foldername(name))[1])::uuid
      )
      or private.is_partner(auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- POLICY : INSERT — uploader un fichier
-- ----------------------------------------------------------------------------
-- Client : peut uploader dans son dossier.
-- Avocat : peut uploader si membre du dossier ou associé fondateur.
-- ----------------------------------------------------------------------------
create policy "documents_storage_insert_client"
  on storage.objects for insert
  with check (
    bucket_id = 'documents'
    and exists (
      select 1 from public.dossiers d
      where d.id = ((storage.foldername(name))[1])::uuid
        and d.client_id = auth.uid()
    )
  );

create policy "documents_storage_insert_internal"
  on storage.objects for insert
  with check (
    bucket_id = 'documents'
    and (
      private.is_dossier_member(
        auth.uid(),
        ((storage.foldername(name))[1])::uuid
      )
      or private.is_partner(auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- POLICY : UPDATE / DELETE — réservé à l'interne
-- ----------------------------------------------------------------------------
create policy "documents_storage_update_internal"
  on storage.objects for update
  using (bucket_id = 'documents' and private.is_internal(auth.uid()))
  with check (bucket_id = 'documents' and private.is_internal(auth.uid()));

create policy "documents_storage_delete_internal"
  on storage.objects for delete
  using (bucket_id = 'documents' and private.is_internal(auth.uid()));
