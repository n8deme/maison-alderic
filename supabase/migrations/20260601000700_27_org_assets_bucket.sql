-- ============================================================
-- MIGRATION 27 — Storage bucket org-assets (logos cabinets)
-- ============================================================
-- Bucket public : les logos sont accessibles via URL CDN publique
-- sans authentification (getPublicUrl() dans l'onboarding).
-- L'API de listing reste restreinte aux utilisateurs authentifiés.
--
-- Structure de path assumée : logos/{auth.uid()}/{timestamp}.{ext}
-- Les policies INSERT/UPDATE/DELETE reposent sur ce chemin.
-- Si d'autres types d'assets sont ajoutés à ce bucket (favicons,
-- bannières…) avec une structure différente, les policies devront
-- être étendues ou un bucket dédié devra être créé.
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'org-assets',
  'org-assets',
  true,
  2097152,  -- 2 Mo
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
on conflict (id) do nothing;

-- -------------------------------------------------------
-- SELECT : restreint aux authentifiés pour l'API de listing.
-- Les URLs CDN publiques restent accessibles sans auth
-- (garanti par public = true sur le bucket, indépendant de RLS).
-- -------------------------------------------------------
create policy "org_assets_select"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'org-assets');

-- -------------------------------------------------------
-- INSERT : logos/{auth.uid()}/...
-- (storage.foldername(name))[1] = 'logos'
-- (storage.foldername(name))[2] = '{user.id}'
-- -------------------------------------------------------
create policy "org_assets_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'org-assets'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

-- -------------------------------------------------------
-- UPDATE : nécessaire car l'onboarding utilise { upsert: true }
-- -------------------------------------------------------
create policy "org_assets_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'org-assets'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

-- -------------------------------------------------------
-- DELETE : chaque user peut supprimer ses propres fichiers
-- -------------------------------------------------------
create policy "org_assets_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'org-assets'
    and (storage.foldername(name))[2] = auth.uid()::text
  );
