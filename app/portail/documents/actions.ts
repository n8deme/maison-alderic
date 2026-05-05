"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getSignedUrl(filePath: string): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(filePath, 3600);
  if (error || !data?.signedUrl) throw new Error("Impossible de générer le lien de téléchargement.");
  return data.signedUrl;
}

export async function uploadDocument(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const file      = formData.get("file")      as File | null;
  const dossierId = formData.get("dossier_id") as string | null;
  const name      = (formData.get("name")     as string | null)?.trim() || file?.name || "Document";
  const category  = (formData.get("category") as string | null) || "other";

  if (!file || !dossierId) throw new Error("Fichier et dossier requis.");
  if (file.size > 20 * 1024 * 1024) throw new Error("Fichier trop volumineux (max 20 Mo).");

  const safeFilename = file.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
  const filePath     = `${dossierId}/${Date.now()}-${safeFilename}`;

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(filePath, file, { contentType: file.type });

  if (uploadError) throw new Error(`Erreur lors de l'upload : ${uploadError.message}`);

  const { error: insertError } = await supabase.from("documents").insert({
    dossier_id:        dossierId,
    name,
    file_path:         filePath,
    file_size:         file.size,
    mime_type:         file.type,
    category,
    uploaded_by:       user.id,
    visible_to_client: true,
  });

  if (insertError) {
    await supabase.storage.from("documents").remove([filePath]);
    throw new Error(`Erreur lors de l'enregistrement : ${insertError.message}`);
  }

  revalidatePath("/portail/documents");
}
