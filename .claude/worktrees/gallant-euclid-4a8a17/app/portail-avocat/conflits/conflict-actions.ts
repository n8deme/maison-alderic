"use server";

import { createClient } from "@/lib/supabase/server";

export type ConflictMatch = {
  dossier_id: string;
  dossier_reference: string;
  dossier_title: string;
  match_context: string;
};

export type ConflictResult = {
  has_conflict: boolean;
  matches: ConflictMatch[];
};

export async function checkConflict(
  query: string,
  orgId: string,
): Promise<{ error?: string; result?: ConflictResult }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const trimmed = query.trim();
  if (trimmed.length < 2) return { error: "Requête trop courte (2 caractères minimum)" };

  const pattern = `%${trimmed}%`;

  // Recherche en parallèle : profiles (clients) + dossiers (titre/description)
  const [profilesRes, dossiersRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, company, dossiers!client_id(id, reference, title)")
      .eq("organization_id", orgId)
      .or(`full_name.ilike.${pattern},company.ilike.${pattern}`),

    supabase
      .from("dossiers")
      .select("id, reference, title, description")
      .eq("organization_id", orgId)
      .or(`title.ilike.${pattern},description.ilike.${pattern}`),
  ]);

  const matches: ConflictMatch[] = [];
  const seenIds = new Set<string>();

  // Depuis les profils clients
  for (const profile of profilesRes.data ?? []) {
    const dossiersList = (profile as any).dossiers ?? [];
    for (const d of dossiersList) {
      if (!seenIds.has(d.id)) {
        seenIds.add(d.id);
        matches.push({
          dossier_id: d.id as string,
          dossier_reference: d.reference as string,
          dossier_title: d.title as string,
          match_context: `Client : ${profile.full_name ?? ""}${profile.company ? ` (${profile.company})` : ""}`,
        });
      }
    }
  }

  // Depuis les dossiers directement
  for (const d of dossiersRes.data ?? []) {
    if (!seenIds.has(d.id)) {
      seenIds.add(d.id);
      const inTitle = d.title.toLowerCase().includes(trimmed.toLowerCase());
      matches.push({
        dossier_id: d.id,
        dossier_reference: d.reference,
        dossier_title: d.title,
        match_context: inTitle ? "Correspondance dans le titre" : "Correspondance dans la description",
      });
    }
  }

  const result: ConflictResult = {
    has_conflict: matches.length > 0,
    matches,
  };

  // Log dans conflict_checks
  await supabase.from("conflict_checks").insert({
    organization_id: orgId,
    checked_by: user.id,
    query: trimmed,
    result,
  });

  return { result };
}
