"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const addTimeEntrySchema = z.object({
  dossierId: z.string().uuid(),
  orgId: z.string().uuid(),
  durationMinutes: z.number().int().positive(),
  description: z.string().min(1, "Description requise").max(500),
  ratePerHour: z.number().positive("Taux invalide"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide"),
});

export type TimeEntryRow = {
  id: string;
  description: string;
  duration_minutes: number;
  rate_per_hour: number;
  total_amount: number;
  billed: boolean;
  date: string;
  created_at: string;
  avocat_full_name: string;
};

export async function addTimeEntry(
  dossierId: string,
  orgId: string,
  durationMinutes: number,
  description: string,
  ratePerHour: number,
  date: string,
): Promise<{ error?: string; entry?: TimeEntryRow }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { data: avocat } = await supabase
    .from("avocats")
    .select("id, full_name")
    .eq("user_id", user.id)
    .single();
  if (!avocat) return { error: "Profil avocat introuvable" };

  const parsed = addTimeEntrySchema.safeParse({
    dossierId, orgId, durationMinutes, description, ratePerHour, date,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides" };

  const { data: entry, error } = await supabase
    .from("time_entries")
    .insert({
      organization_id: orgId,
      dossier_id: dossierId,
      avocat_id: avocat.id,
      description,
      duration_minutes: durationMinutes,
      rate_per_hour: ratePerHour,
      date,
    })
    .select("id, description, duration_minutes, rate_per_hour, total_amount, billed, date, created_at")
    .single();

  if (error || !entry) return { error: error?.message ?? "Erreur lors de l'ajout" };

  const { data: dossier } = await supabase
    .from("dossiers")
    .select("reference")
    .eq("id", dossierId)
    .single();
  if (dossier) revalidatePath(`/portail-avocat/dossiers/${dossier.reference}`);

  return {
    entry: {
      ...entry,
      rate_per_hour: Number(entry.rate_per_hour),
      total_amount: Number(entry.total_amount),
      avocat_full_name: avocat.full_name,
    },
  };
}
