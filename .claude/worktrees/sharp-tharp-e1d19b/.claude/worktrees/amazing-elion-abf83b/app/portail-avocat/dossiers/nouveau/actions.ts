// ============================================================
// app/portail-avocat/dossiers/nouveau/actions.ts
// ============================================================
"use server";

import { createClient } from "@/lib/supabase/server";
import { getOrganization } from "@/lib/get-organization";
import { z } from "zod";

const dossierSchema = z.object({
  client_id: z.string().uuid("Client requis"),
  title: z.string().min(1, "Titre requis"),
  description: z.string().optional(),
  type: z.enum(["M&A", "Litigation", "Tax", "Corporate", "PE", "Restructuring"]),
  lead_avocat_id: z.string().uuid("Lead avocat requis"),
  team_avocat_ids: z.array(z.string().uuid()).default([]),
  budget_estimated: z.coerce.number().min(0).optional().nullable(),
  opened_at: z.string().min(1, "Date d'ouverture requise"),
});

export type DossierFormInput = z.infer<typeof dossierSchema>;

export async function createDossier(
  data: DossierFormInput,
): Promise<{ error?: string; reference?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const org = await getOrganization();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .eq("organization_id", org.id)
    .single();
  if (!profile || profile.role !== "avocat") return { error: "Accès refusé" };

  const parsed = dossierSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides" };

  // Générer la référence avec le slug de l'org (ex: MA-2026-0042 pour maison-alderic)
  const prefix = org.slug.split("-").map(w => w[0].toUpperCase()).join("").slice(0, 3);
  const year = new Date().getFullYear();
  const { data: last } = await supabase
    .from("dossiers")
    .select("reference")
    .eq("organization_id", org.id)
    .like("reference", `${prefix}-${year}-%`)
    .order("reference", { ascending: false })
    .limit(1)
    .maybeSingle();

  let nextNum = 1;
  if (last?.reference) {
    const lastNum = parseInt(last.reference.split("-").pop() ?? "0");
    if (!isNaN(lastNum)) nextNum = lastNum + 1;
  }
  const reference = `${prefix}-${year}-${String(nextNum).padStart(4, "0")}`;

  const { data: dossier, error: insertError } = await supabase
    .from("dossiers")
    .insert({
      reference,
      organization_id: org.id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      type: parsed.data.type,
      client_id: parsed.data.client_id,
      budget_estimated: parsed.data.budget_estimated ?? null,
      opened_at: new Date(parsed.data.opened_at).toISOString(),
      status: "active",
    })
    .select("id, reference")
    .single();

  if (insertError || !dossier) return { error: insertError?.message ?? "Erreur lors de la création" };

  const avocatRows = [
    { dossier_id: dossier.id, avocat_id: parsed.data.lead_avocat_id, role: "lead" as const },
    ...parsed.data.team_avocat_ids
      .filter((id) => id !== parsed.data.lead_avocat_id)
      .map((id) => ({ dossier_id: dossier.id, avocat_id: id, role: "support" as const })),
  ];

  const { error: avocatError } = await supabase.from("dossier_avocats").insert(avocatRows);
  if (avocatError) {
    await supabase.from("dossiers").delete().eq("id", dossier.id);
    return { error: "Erreur lors de l'assignation des avocats" };
  }

  return { reference: dossier.reference };
}