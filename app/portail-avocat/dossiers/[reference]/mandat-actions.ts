"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type GenerateMandatResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function generateMandat(dossierId: string): Promise<GenerateMandatResult> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Non authentifié" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "avocat" && profile?.role !== "admin") {
      return { success: false, error: "Accès réservé aux avocats" };
    }

    const { data: dossier, error: dossierError } = await supabase
      .from("dossiers")
      .select(`
        id,
        reference,
        type,
        client:profiles!client_id(id, full_name, email),
        dossier_avocats(role, avocats(id, full_name, email))
      `)
      .eq("id", dossierId)
      .single();

    if (dossierError || !dossier) {
      return { success: false, error: "Dossier introuvable" };
    }

    const client = dossier.client as unknown as { id: string; full_name: string; email: string } | null;
    const leadEntry = (dossier.dossier_avocats as unknown as Array<{ role: string; avocats: { id: string; full_name: string; email: string } | null }>)
      ?.find((da) => da.role === "lead");
    const avocat = leadEntry?.avocats ?? null;

    if (!client) return { success: false, error: "Données client manquantes" };
    if (!avocat) return { success: false, error: "Aucun avocat principal assigné au dossier" };

    const webhookUrl = process.env.N8N_WEBHOOK_MANDAT_URL;
    if (!webhookUrl) {
      return { success: false, error: "Webhook N8N non configuré (N8N_WEBHOOK_MANDAT_URL manquant)" };
    }

    const payload = {
      dossier_id: dossier.id,
      client_id: client.id,
      client_nom: client.full_name,
      client_email: client.email,
      avocat_id: avocat.id,
      avocat_nom: avocat.full_name,
      avocat_email: avocat.email,
      type_dossier: dossier.type,
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[generateMandat] N8N error:", response.status, errorText);
      return {
        success: false,
        error: `N8N a renvoyé une erreur (${response.status}). Si tu es en mode test, clique d'abord "Execute workflow" dans N8N.`,
      };
    }

    revalidatePath(`/portail-avocat/dossiers/${dossier.reference}`);

    return {
      success: true,
      message: `Mandat envoyé à ${client.full_name} (${client.email})`,
    };
  } catch (error) {
    console.error("[generateMandat] Exception:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
