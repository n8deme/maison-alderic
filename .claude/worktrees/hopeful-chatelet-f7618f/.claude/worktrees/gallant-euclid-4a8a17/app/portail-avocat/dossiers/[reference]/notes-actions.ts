"use server";

import { createClient } from "@/lib/supabase/server";
import { getOrganization } from "@/lib/get-organization";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const addNoteSchema = z.object({
  dossierId: z.string().uuid(),
  content: z.string().min(1, "Contenu requis").max(5000),
  isInternal: z.boolean(),
});

export async function addNote(
  dossierId: string,
  orgId: string,
  content: string,
  isInternal: boolean,
): Promise<{ error?: string; note?: { id: string; content: string; is_internal: boolean; created_at: string; author_full_name: string } }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "avocat") return { error: "Accès refusé" };

  const parsed = addNoteSchema.safeParse({ dossierId, content, isInternal });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides" };

  const { data: note, error } = await supabase
    .from("notes")
    .insert({
      dossier_id: dossierId,
      organization_id: orgId,
      author_id: user.id,
      author_type: "avocat",
      content,
      is_internal: isInternal,
    })
    .select("id, content, is_internal, created_at")
    .single();

  if (error || !note) return { error: error?.message ?? "Erreur lors de l'ajout" };

  const { data: dossier } = await supabase
    .from("dossiers")
    .select("reference")
    .eq("id", dossierId)
    .single();

  if (dossier) {
    revalidatePath(`/portail-avocat/dossiers/${dossier.reference}`);
  }

  return {
    note: {
      ...note,
      author_full_name: profile.full_name ?? "Moi",
    },
  };
}
