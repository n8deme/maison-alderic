"use server";

import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { TimelinePDF } from "@/components/pdf/timeline-pdf";
import { getDossierProgress } from "@/lib/dossiers";

export async function generateTimelinePDF(dossierId: string): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const [dossierRes, timelineRes, leadRes] = await Promise.all([
    supabase
      .from("dossiers")
      .select("id, reference, title, description, status, type, opened_at, closed_at, budget_estimated, budget_consumed, client:profiles!client_id(full_name, company)")
      .eq("id", dossierId)
      .maybeSingle(),

    supabase
      .from("dossier_timeline")
      .select("title, description, status, due_date, completed_at, display_order")
      .eq("dossier_id", dossierId)
      .order("display_order", { ascending: true }),

    supabase
      .from("dossier_avocats")
      .select("avocats(full_name, title)")
      .eq("dossier_id", dossierId)
      .eq("role", "lead")
      .maybeSingle(),
  ]);

  if (!dossierRes.data) throw new Error("Dossier introuvable");

  const d        = dossierRes.data;
  const timeline = timelineRes.data ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lead     = (leadRes.data as any)?.avocats as { full_name: string; title: string | null } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client   = Array.isArray((d as any).client) ? (d as any).client[0] : (d as any).client;

  const generatedAt = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  }).format(new Date());

  const buffer = await renderToBuffer(
    <TimelinePDF
      reference={d.reference}
      title={d.title}
      description={d.description ?? null}
      status={d.status}
      type={d.type ?? null}
      openedAt={d.opened_at}
      closedAt={d.closed_at ?? null}
      budgetEstimated={d.budget_estimated ? Number(d.budget_estimated) : null}
      budgetConsumed={d.budget_consumed ? Number(d.budget_consumed) : null}
      progressPct={getDossierProgress(d, timeline)}
      clientName={client?.full_name ?? null}
      clientCompany={client?.company ?? null}
      leadAvocatName={lead?.full_name ?? null}
      leadAvocatTitle={lead?.title ?? null}
      steps={timeline}
      generatedAt={generatedAt}
    />
  );

  return buffer.toString("base64");
}
