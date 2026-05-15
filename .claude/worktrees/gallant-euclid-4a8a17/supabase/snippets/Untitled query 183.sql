-- Désactiver RLS sur organization_members temporairement
-- et mettre une policy simple sans récursion
drop policy if exists "org_members_select" on organization_members;

create policy "org_members_select"
  on organization_members for select
  using (user_id = auth.uid());