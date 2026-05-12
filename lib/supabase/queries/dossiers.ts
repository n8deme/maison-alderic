import { createClient } from "@/lib/supabase/server";

/**
 * Helper centralisé pour fetcher des dossiers avec leurs avocats assignés.
 *
 * La table `dossier_avocats` est une table de liaison N-N entre dossiers et avocats.
 * Le champ `role` = 'lead' identifie l'avocat principal, 'support' = équipe.
 *
 * IMPORTANT : utilise ce helper partout au lieu de réécrire le pattern.
 * Évite les anciennes références à `lead_avocat_id` / `team_avocat_ids` qui
 * N'EXISTENT PAS dans la DB actuelle.
 *
 * Les hints FK explicites (!dossier_avocats_dossier_id_fkey et !dossier_avocats_avocat_id_fkey)
 * forcent Supabase à utiliser la bonne FK pour le join, évitant les ambiguïtés
 * qui causaient des résultats null sur les avocats nested.
 */

// Type du client Supabase exact tel que retourné par createClient() de notre projet.
// On utilise Awaited<ReturnType<...>> pour rester aligné avec le SSR client de Next.js.
type SupabaseClientType = Awaited<ReturnType<typeof createClient>>;

export type AvocatAssignment = {
  avocat_id: string;
  role: "lead" | "support";
  avocat: {
    id: string;
    full_name: string;
    slug: string | null;
    title: string | null;
  };
};

export type DossierWithAvocats = {
  id: string;
  reference: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  client_id: string;
  budget_estimated: number | null;
  budget_consumed: number | null;
  opened_at: string;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  dossier_avocats: AvocatAssignment[];
};

/**
 * Extrait l'avocat lead d'un dossier (peut être null si aucun lead assigné).
 */
export function getLeadAvocat(dossier: { dossier_avocats?: AvocatAssignment[] | null }): AvocatAssignment["avocat"] | null {
  const lead = dossier.dossier_avocats?.find((da) => da.role === "lead");
  return lead?.avocat ?? null;
}

/**
 * Extrait les avocats "support" d'un dossier (équipe).
 */
export function getSupportAvocats(dossier: { dossier_avocats?: AvocatAssignment[] | null }): AvocatAssignment["avocat"][] {
  return (dossier.dossier_avocats ?? []).filter((da) => da.role === "support").map((da) => da.avocat);
}

/**
 * Le SELECT à utiliser dans les queries Supabase pour récupérer un dossier
 * avec ses avocats. À spread dans les .select().
 *
 * NOTE : les hints !dossier_avocats_dossier_id_fkey et !dossier_avocats_avocat_id_fkey
 * forcent l'utilisation de la bonne FK pour résoudre le nested select.
 */
export const DOSSIER_WITH_AVOCATS_SELECT = `
  id,
  reference,
  title,
  description,
  type,
  status,
  client_id,
  budget_estimated,
  budget_consumed,
  opened_at,
  closed_at,
  created_at,
  updated_at,
  dossier_avocats!dossier_avocats_dossier_id_fkey (
    avocat_id,
    role,
    avocat:avocats!dossier_avocats_avocat_id_fkey (
      id,
      full_name,
      slug,
      title
    )
  )
` as const;

/**
 * Récupère un client avec tous ses dossiers + avocats assignés à chaque dossier.
 * Utilisé par la page profil client côté avocat.
 */
export async function getClientWithDossiers(supabase: SupabaseClientType, clientId: string) {
  return await supabase
    .from("profiles")
    .select(`*, dossiers:dossiers!client_id (${DOSSIER_WITH_AVOCATS_SELECT})`)
    .eq("id", clientId)
    .eq("role", "client")
    .single();
}

/**
 * Récupère tous les dossiers visibles pour l'avocat connecté
 * (où il est lead OU support). Utilisé par le dashboard avocat.
 */
export async function getDossiersForAvocat(supabase: SupabaseClientType, avocatId: string) {
  const { data: assignments } = await supabase
    .from("dossier_avocats")
    .select("dossier_id")
    .eq("avocat_id", avocatId);

  const dossierIds: string[] = assignments?.map((da: { dossier_id: string }) => da.dossier_id) ?? [];

  if (dossierIds.length === 0) {
    return { data: [], error: null };
  }

  return await supabase
    .from("dossiers")
    .select(DOSSIER_WITH_AVOCATS_SELECT)
    .in("id", dossierIds)
    .order("opened_at", { ascending: false });
}

/**
 * Récupère un dossier par sa référence (ex : "MA-2026-0001") avec avocats.
 */
export async function getDossierByReference(supabase: SupabaseClientType, reference: string) {
  return await supabase
    .from("dossiers")
    .select(DOSSIER_WITH_AVOCATS_SELECT)
    .eq("reference", reference)
    .single();
}