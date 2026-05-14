import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganization } from "@/lib/get-organization";
import { DashboardPremium } from "@/components/portail/dashboard-premium";

export const metadata: Metadata = { title: "Tableau de bord" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  // Multi-tenant : récupérer l'org depuis les headers du middleware
  const org = await getOrganization();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();

  const [profileRes, dossiersRes, invoicesRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .eq("organization_id", org.id)
      .maybeSingle(),
    supabase
      .from("dossiers")
      .select("id, reference, title, status, opened_at")
      .eq("client_id", user.id)
      .eq("organization_id", org.id)
      .order("opened_at", { ascending: false }),
    supabase
      .from("invoices")
      .select("amount_ttc, issued_at")
      .eq("client_id", user.id)
      .eq("organization_id", org.id)
      .gte("issued_at", startOfMonth),
  ]);

  const dossiers = dossiersRes.data ?? [];
  const dossierIds = dossiers.map((item) => item.id);
  const activeDossiers = dossiers.filter((item) => item.status !== "won" && item.status !== "archived").length;
  const currentMonthActive = dossiers.filter(
    (item) =>
      item.status !== "won" &&
      item.status !== "archived" &&
      item.opened_at >= startOfMonth
  ).length;
  const prevMonthActive = dossiers.filter(
    (item) =>
      item.status !== "won" &&
      item.status !== "archived" &&
      item.opened_at >= startOfPrevMonth &&
      item.opened_at < endOfPrevMonth
  ).length;
  const activeTrend =
    prevMonthActive > 0
      ? `${Math.round(((currentMonthActive - prevMonthActive) / prevMonthActive) * 100) > 0 ? "+" : ""}${Math.round(((currentMonthActive - prevMonthActive) / prevMonthActive) * 100)}% ce mois`
      : null;

  const docsRes = dossierIds.length
    ? await supabase
        .from("documents")
        .select("id", { count: "exact", head: true })
        .in("dossier_id", dossierIds)
        .eq("organization_id", org.id)
        .gte("created_at", weekAgo)
    : { count: 0 };

  const [timelineRes, activityRes, leadRes] = dossierIds.length
    ? await Promise.all([
        supabase
          .from("dossier_timeline")
          .select("id, dossier_id, status, due_date, title, created_at")
          .in("dossier_id", dossierIds)
          .eq("organization_id", org.id),
        supabase
          .from("dossier_timeline")
          .select("id, title, status, created_at, dossier:dossiers(id, title, reference)")
          .in("dossier_id", dossierIds)
          .eq("organization_id", org.id)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("dossier_avocats")
          .select("dossier_id, role, avocat:avocats(id, full_name, slug)")
          .in("dossier_id", dossierIds)
          .eq("role", "lead"),
      ])
    : [
        { data: [] as any[] },
        { data: [] as any[] },
        { data: [] as any[] },
      ];

  const timeline = timelineRes.data ?? [];
  const pendingActions = timeline.filter((item) => item.status !== "completed").length;
  const recentDocuments = docsRes.count ?? 0;
  const billedThisMonth = (invoicesRes.data ?? []).reduce((sum, item) => sum + Number(item.amount_ttc), 0);

  const leadByDossier = new Map<string, { id: string; full_name: string; slug: string | null }>();
  for (const row of leadRes.data ?? []) {
    if (row.dossier_id && row.avocat) {
      leadByDossier.set(row.dossier_id, row.avocat as { id: string; full_name: string; slug: string | null });
    }
  }

  const timelineByDossier = new Map<string, Array<{ status: string; due_date: string | null; title: string }>>();
  for (const step of timeline) {
    const list = timelineByDossier.get(step.dossier_id) ?? [];
    list.push({ status: step.status, due_date: step.due_date, title: step.title });
    timelineByDossier.set(step.dossier_id, list);
  }

  const dossiersForCards = dossiers.slice(0, 6).map((dossier) => {
    const steps = timelineByDossier.get(dossier.id) ?? [];
    const completed = steps.filter((item) => item.status === "completed").length;
    const progressPct = steps.length ? Math.round((completed / steps.length) * 100) : 0;
    const next = steps.find((item) => item.status !== "completed");
    return {
      id: dossier.id,
      reference: dossier.reference,
      title: dossier.title,
      status: dossier.status as "active" | "pending" | "archived" | "won" | "lost",
      nextAction: next?.title ?? "Suivi en cours",
      nextActionDate: next?.due_date ?? null,
      progressPct,
      leadAvocat: leadByDossier.get(dossier.id) ?? null,
    };
  });

  const fallbackName = user.email?.split("@")[0]?.split(/[._-]/)[0] ?? "Client";
  const fullName = profileRes.data?.full_name ?? `${fallbackName.charAt(0).toUpperCase()}${fallbackName.slice(1)}`;
  const firstName = fullName.split(" ")[0] ?? fullName;
  const todayLabel = new Intl.DateTimeFormat("fr-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  return (
    <DashboardPremium
      firstName={firstName}
      todayLabel={todayLabel}
      stats={{
        activeDossiers,
        pendingActions,
        recentDocuments,
        billedThisMonth,
        activeTrend,
      }}
      activity={(activityRes.data ?? []) as any[]}
      dossiers={dossiersForCards}
    />
  );
}