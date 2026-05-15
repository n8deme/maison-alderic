"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { logAuditEvent } from "@/lib/audit/log";
import { redirect } from "next/navigation";

export async function deleteOrganization(
  orgId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { data: membership } = await supabase
    .from("organization_members")
    .select("role")
    .eq("user_id", user.id)
    .eq("organization_id", orgId)
    .single();

  if (!membership || membership.role !== "owner") {
    return { error: "Seul le propriétaire peut supprimer le cabinet" };
  }

  const service = createServiceClient();
  const { error: updateError } = await service
    .from("organizations")
    .update({ is_active: false, deleted_at: new Date().toISOString() })
    .eq("id", orgId);

  if (updateError) return { error: "Erreur lors de la suppression. Réessayez." };

  await logAuditEvent(orgId, user.id, "organization_deleted", "organization", orgId);
  await supabase.auth.signOut();
  redirect("/connexion?deleted=1");
}
