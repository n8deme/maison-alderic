import { createServiceClient } from "@/lib/supabase/service";

export async function logAuditEvent(
  orgId: string,
  userId: string,
  action: string,
  resource: string,
  resourceId: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    const service = createServiceClient();
    await service.from("audit_logs").insert({
      organization_id: orgId,
      user_id: userId,
      action,
      resource_type: resource,
      resource_id: resourceId,
      metadata: metadata ?? {},
    });
  } catch (err) {
    console.error("[audit] logAuditEvent failed:", err);
  }
}
