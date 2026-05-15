// ============================================================
// app/portail/documents/actions.ts
// ============================================================
"use server";

import { revalidatePath } from "next/cache";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getOrganization } from "@/lib/get-organization";

export async function getSignedUrl(documentId: string): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const org = await getOrganization();

  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("id, name, file_path")
    .eq("id", documentId)
    .eq("organization_id", org.id)  // isolation tenant
    .single();

  if (docError || !doc) throw new Error("Document introuvable ou accès refusé");

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const downloadLabel =
    (typeof doc.name === "string" && doc.name.trim() !== "")
      ? doc.name
      : doc.file_path.split("/").pop() ?? "document";

  const { data, error } = await adminClient.storage
    .from("documents")
    .createSignedUrl(doc.file_path, 3600, { download: downloadLabel });

  if (error || !data?.signedUrl) throw new Error("Impossible de générer le lien de téléchargement.");

  return data.signedUrl;
}

export async function uploadDocument(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const org = await getOrganization();

  const file      = formData.get("file")       as File | null;
  const dossierId = formData.get("dossier_id") as string | null;
  const name      = (formData.get("name")      as string | null)?.trim() || file?.name || "Document";
  const category  = (formData.get("category")  as string | null) || "other";

  if (!file || !dossierId) throw new Error("Fichier et dossier requis.");
  if (file.size > 20 * 1024 * 1024) throw new Error("Fichier trop volumineux (max 20 Mo).");

  // Vérifier que le dossier appartient bien à l'org
  const { data: dossier } = await supabase
    .from("dossiers")
    .select("id")
    .eq("id", dossierId)
    .eq("organization_id", org.id)
    .single();
  if (!dossier) throw new Error("Dossier introuvable.");

  // Path isolé par org pour éviter les collisions entre tenants
  const safeFilename = file.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
  const filePath = `${org.slug}/${dossierId}/${Date.now()}-${safeFilename}`;

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(filePath, file, { contentType: file.type });

  if (uploadError) throw new Error(`Erreur lors de l'upload : ${uploadError.message}`);

  const { error: insertError } = await supabase.from("documents").insert({
    dossier_id:        dossierId,
    organization_id:   org.id,
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


// ============================================================
// app/sitemap.ts
// Note : le sitemap reste spécifique à l'org courante
// En multi-tenant, chaque sous-domaine a son propre sitemap
// ============================================================
// Ce fichier doit rester dans app/sitemap.ts du projet
// Le contenu adapté est ci-dessous :

/*
import type { MetadataRoute } from "next";
import { createStaticClient } from "@/lib/supabase/static";
import { getOrganization } from "@/lib/get-organization";
import { headers } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();

  // Récupérer l'org depuis les headers pour construire l'URL de base
  let orgSlug = "maison-alderic";
  try {
    const headersList = await headers();
    orgSlug = headersList.get("x-org-slug") ?? "maison-alderic";
  } catch {}

  const base = `https://${orgSlug}.lawyeros.app`;

  const [avocatsRes, insightsRes] = await Promise.all([
    supabase.from("avocats").select("slug, updated_at").eq("organization_id", ???),
    supabase.from("insights").select("slug, updated_at").eq("is_published", true).eq("organization_id", ???),
  ]);

  // ... reste identique
}
*/

// Pour l'instant, le sitemap.ts original peut rester tel quel.
// Il sera adapté dans une session dédiée quand on s'occupera
// du déploiement multi-domaine.
export {};