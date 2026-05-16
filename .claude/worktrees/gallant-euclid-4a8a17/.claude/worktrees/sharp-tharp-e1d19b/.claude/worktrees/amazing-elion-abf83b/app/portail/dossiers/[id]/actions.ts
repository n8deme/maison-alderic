"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function completeStep(stepId: string, dossierId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("dossier_timeline")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", stepId);

  if (error) throw error;

  revalidatePath(`/portail/dossiers/${dossierId}`);
}
