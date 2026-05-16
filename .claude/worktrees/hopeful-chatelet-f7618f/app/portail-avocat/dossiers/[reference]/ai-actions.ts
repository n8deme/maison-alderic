"use server";

import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

export async function generateDossierSummary(
  dossierId: string,
  orgId: string,
): Promise<{ error?: string; summary?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "avocat") return { error: "Accès refusé" };

  const [dossierRes, timelineRes, messagesRes, notesRes] = await Promise.all([
    supabase
      .from("dossiers")
      .select("title, status, type")
      .eq("id", dossierId)
      .eq("organization_id", orgId)
      .single(),
    supabase
      .from("dossier_timeline")
      .select("title, status, completed_at, due_date")
      .eq("dossier_id", dossierId)
      .order("display_order", { ascending: false })
      .limit(5),
    supabase
      .from("messages")
      .select("content, created_at, sender_type")
      .eq("dossier_id", dossierId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("notes")
      .select("content, created_at")
      .eq("dossier_id", dossierId)
      .eq("organization_id", orgId)
      .eq("is_internal", false)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  if (!dossierRes.data) return { error: "Dossier introuvable" };

  const dossier  = dossierRes.data;
  const timeline = timelineRes.data ?? [];
  const messages = messagesRes.data ?? [];
  const notes    = notesRes.data ?? [];

  const fmtDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString("fr-FR") : null;

  const timelineText = timeline.length
    ? timeline
        .map((t) => {
          const date = t.completed_at
            ? `, terminé le ${fmtDate(t.completed_at)}`
            : t.due_date
              ? `, échéance ${fmtDate(t.due_date)}`
              : "";
          return `- ${t.title} (${t.status}${date})`;
        })
        .join("\n")
    : "Aucune étape";

  const messagesText = messages.length
    ? messages
        .map((m) => `- [${m.sender_type}] ${String(m.content ?? "").slice(0, 200)}`)
        .join("\n")
    : "Aucun message";

  const notesText = notes.length
    ? notes.map((n) => `- ${String(n.content ?? "").slice(0, 200)}`).join("\n")
    : "Aucune note";

  const context = `Dossier: ${dossier.title}
Statut: ${dossier.status}
Type: ${dossier.type}

Dernières étapes de la timeline:
${timelineText}

Derniers messages:
${messagesText}

Notes partagées récentes:
${notesText}`;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { error: "Clé API Anthropic manquante (ANTHROPIC_API_KEY)" };

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    system:
      "Tu es l'assistant juridique de LawyerOS. Génère un résumé concis (3-5 bullets) de l'état actuel de ce dossier en langage simple pour l'avocat. Inclus les actions en attente.",
    messages: [{ role: "user", content: context }],
  });

  const block = response.content[0];
  if (!block || block.type !== "text") return { error: "Réponse inattendue de l'API" };

  return { summary: block.text };
}
