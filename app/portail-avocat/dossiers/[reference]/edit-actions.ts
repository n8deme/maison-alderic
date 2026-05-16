"use server";

import { createClient } from "@/lib/supabase/server";
import { getOrganization } from "@/lib/get-organization";
import { logAuditEvent } from "@/lib/audit/log";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const dossierEditSchema = z.object({
  title: z.string().min(1, "Titre requis"),
  description: z.string().optional(),
  status: z.enum(["active", "pending", "archived", "won", "lost"]),
  type: z.enum(["M&A", "Litigation", "Tax", "Corporate", "PE", "Restructuring"]),
  lead_avocat_id: z.string().uuid("Lead avocat requis"),
  team_avocat_ids: z.array(z.string().uuid()).default([]),
  budget_estimated: z.coerce.number().min(0).optional().nullable(),
});

export type DossierEditInput = z.infer<typeof dossierEditSchema>;

export async function updateDossier(
  dossierId: string,
  reference: string,
  data: DossierEditInput,
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const org = await getOrganization();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "avocat") return { error: "Accès refusé" };

  const parsed = dossierEditSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  const { error: updateError } = await supabase
    .from("dossiers")
    .update({
      title: parsed.data.title,
      description: parsed.data.description || null,
      status: parsed.data.status,
      type: parsed.data.type,
      budget_estimated: parsed.data.budget_estimated ?? null,
    })
    .eq("id", dossierId);

  if (updateError) return { error: updateError.message };

  // Reconstruire les avocats : supprimer les existants et ré-insérer
  await supabase.from("dossier_avocats").delete().eq("dossier_id", dossierId);

  const avocatRows = [
    { dossier_id: dossierId, avocat_id: parsed.data.lead_avocat_id, role: "lead" as const },
    ...parsed.data.team_avocat_ids
      .filter((id) => id !== parsed.data.lead_avocat_id)
      .map((id) => ({ dossier_id: dossierId, avocat_id: id, role: "support" as const })),
  ];

  const { error: avocatError } = await supabase.from("dossier_avocats").insert(avocatRows);
  if (avocatError) return { error: "Erreur mise à jour équipe avocats" };

  await logAuditEvent(org.id, user.id, "dossier_updated", "dossier", dossierId, { reference });

  revalidatePath(`/portail-avocat/dossiers/${reference}`);
  return { success: true };
}
