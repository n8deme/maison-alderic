"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type FieldType = "text" | "boolean" | "date";

export type IntakeField = {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
};

const intakeFieldSchema: z.ZodType<IntakeField> = z.object({
  id: z.string().min(1),
  type: z.enum(["text", "boolean", "date"]),
  label: z.string().min(1, "Label requis"),
  required: z.boolean(),
});

const createIntakeFormSchema = z.object({
  orgId: z.string().uuid(),
  title: z.string().min(1, "Titre requis").max(200),
  description: z.string().max(1000).optional(),
  fields: z.array(intakeFieldSchema).min(1, "Au moins un champ requis"),
});

export async function createIntakeForm(
  orgId: string,
  title: string,
  description: string,
  fields: IntakeField[],
): Promise<{ error?: string; formId?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "avocat") return { error: "Accès refusé" };

  const parsed = createIntakeFormSchema.safeParse({ orgId, title, description, fields });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides" };

  const { data: form, error } = await supabase
    .from("intake_forms")
    .insert({
      organization_id: orgId,
      title,
      description: description || null,
      fields,
      is_active: true,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !form) return { error: error?.message ?? "Erreur lors de la création" };

  revalidatePath("/portail-avocat/intake");
  return { formId: form.id };
}

export async function toggleIntakeForm(
  formId: string,
  isActive: boolean,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { error } = await supabase
    .from("intake_forms")
    .update({ is_active: isActive })
    .eq("id", formId);

  if (error) return { error: error.message };

  revalidatePath("/portail-avocat/intake");
  return {};
}
