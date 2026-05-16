-- ============================================================
-- MIGRATION 24 — INSERT policy audit_logs
-- Permet aux membres du cabinet d'insérer des logs via leur JWT
-- Supprime la dépendance à SUPABASE_SERVICE_ROLE_KEY pour logAuditEvent
-- ============================================================

create policy "audit_logs_insert"
  on audit_logs for insert
  with check (
    organization_id = get_user_org_id()
    and is_cabinet_member()
  );
