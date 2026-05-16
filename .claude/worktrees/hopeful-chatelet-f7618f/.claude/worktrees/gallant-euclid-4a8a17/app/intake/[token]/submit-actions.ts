"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const submitSchema = z.object({
  formId: z.string().uuid(),
  orgId: z.string().uuid(),
  responses: z.record(z.string(), z.string()),
});

export async function submitIntakeResponse(
  formId: string,
  orgId: string,
  responses: Record<string, string>,
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();

  const parsed = submitSchema.safeParse({ formId, orgId, responses });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides" };

  // Vérifier que le formulaire existe et est actif (double-check côté serveur)
  const { data: form } = await supabase
    .from("intake_forms")
    .select("id")
    .eq("id", formId)
    .eq("is_active", true)
    .single();

  if (!form) return { error: "Formulaire introuvable ou inactif" };

  const { error } = await supabase.from("intake_responses").insert({
    organization_id: orgId,
    intake_form_id: formId,
    responses,
  });

  if (error) return { error: error.message };

  return { success: true };
}
