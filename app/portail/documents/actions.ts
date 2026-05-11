"use server";

import { revalidatePath } from "next/cache";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function getSignedUrl(filePath: string, fileName: string): Promise<string> {
  console.log("[DBG] === getSignedUrl ===");
  console.log("[DBG] filePath received:", filePath);
  console.log("[DBG] fileName received:", fileName);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  console.log("[DBG] user:", user?.id, user?.email);

  if (!user) {
    throw new Error("Non authentifié");
  }

  // Test 1 : SELECT avec RLS (code actuel)
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("id, name, file_path, dossier_id")
    .eq("file_path", filePath)
    .single();

  console.log("[DBG] SELECT with RLS — doc:", doc);
  console.log("[DBG] SELECT with RLS — error:", docError);

  // Test 2 : SELECT sans .single() pour voir si plusieurs lignes
  const { data: docsAll, error: allError } = await supabase
    .from("documents")
    .select("id, name, file_path")
    .eq("file_path", filePath);

  console.log("[DBG] SELECT all matching — count:", docsAll?.length);
  console.log("[DBG] SELECT all matching — error:", allError);

  // Test 3 : count total visible pour ce user
  const { count } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true });

  console.log("[DBG] Total docs visible to user (count):", count);

  if (docError || !doc) {
    throw new Error("Document introuvable ou accès refusé");
  }

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const { data, error } = await adminClient.storage
    .from("documents")
    .createSignedUrl(filePath, 3600, { download: fileName });
  if (error || !data?.signedUrl) {
    console.error("[getSignedUrl] Storage error:", error);
    throw new Error("Impossible de générer le lien de téléchargement.");
  }
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
