import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertCircle, Clock3, Activity, CalendarX, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getOrganization } from "@/lib/get-organization";
import { DashboardKpiCards } from "@/components/portail-avocat/dashboard/kpi-cards";
import { AnimatedActivityCard } from "@/components/portail-avocat/animated-activity-card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: { absolute: "Dashboard | LawyerOS" },
};

function fmtEur(value: number) {
  return new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR" }).format(value);
}

function fmtDateTime(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

export default async function PortailAvocatDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const org = await getOrganization();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);
  const weekEnd = new Date(todayStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const nowIso = now.toISOString();

  const [activeRes, newClientsRes, rdvWeekRes, caRes, overdueRes, activityRes, todayRdvRes, urgentRes] = await Promise.all([
    supabase
      .from("dossiers")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", org.id)
      .in("status", ["active", "pending"]),

    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", org.id)
      .eq("role", "client")
      .gte("created_at", monthStart),

    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", org.id)
      .gte("starts_at", todayStart.toISOString())
      .lt("starts_at", weekEnd.toISOString()),

    supabase
      .from("invoices")
      .select("amount_ttc, paid_at")
      .eq("organization_id", org.id)
      .eq("status", "paid")
      .gte("paid_at", monthStart)
      .lt("paid_at", nowIso),

    supabase
      .from("invoices")
      .select("id, amount_ttc", { count: "exact" })
      .eq("organization_id", org.id)
      .in("status", ["sent", "overdue"])
      .lt("due_at", nowIso),

    supabase
      .from("dossier_timeline")
      .select("id, title, status, created_at, dossier:dossiers(id, reference, title)")
      .eq("organization_id", org.id)
      .order("created_at", { ascending: false })
      .limit(10),

    supabase
      .from("appointments")
      .select("id, title, starts_at, ends_at, location, avocat:avocats(full_name), client:profiles!client_id(full_name)")
      .eq("organization_id", org.id)
      .gte("starts_at", todayStart.toISOString())
      .lt("starts_at", todayEnd.toISOString())
      .order("starts_at", { ascending: true }),

    supabase
      .from("dossier_timeline")
      .select("id, title, due_date, dossier:dossiers(id, reference, title, status)")
      .eq("organization_id", org.id)
      .gte("due_date", todayStart.toISOString())
      .lt("due_date", weekEnd.toISOString())
      .order("due_date", { ascending: true })
      .limit(10),
  ]);

  const caMonth = (caRes.data ?? []).reduce(
    (sum: number, item: { amount_ttc: number | string }) => sum + Number(item.amount_ttc), 0
  );
  const overdueCount = overdueRes.count ?? 0;
  const overdueAmount = (overdueRes.data ?? []).reduce(
    (sum: number, item: { amount_ttc: number | string }) => sum + Number(item.amount_ttc), 0
  );
  const urgentRows = (urgentRes.data ?? []).filter((item: any) =>
    item.dossier && item.dossier.status !== "won" && item.dossier.status !== "archived"
  );

  return (
    <div className="max-w-7xl p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
          Dashboard avocat
        </h1>
        <p className="mt-1 text-sm text-text-secondary">Vue globale cabinet - dossiers, clients, agenda et facturation.</p>
      </div>

      <DashboardKpiCards
        activeDossiers={activeRes.count ?? 0}
        newClientsMonth={newClientsRes.count ?? 0}
        rdvWeek={rdvWeekRes.count ?? 0}
        caMonth={caMonth}
        overdueCount={overdueCount}
        overdueAmountLabel={overdueCount > 0 ? fmtEur(overdueAmount) : undefined}
      />

      <section className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <article className="rounded-lg border border-border bg-surface p-6 xl:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl text-foreground">Activité récente</h2>
            <Link href="/portail-avocat/dossiers" className="text-sm text-bordeaux">Voir dossiers</Link>
          </div>
          <div className="space-y-2">
            {(activityRes.data ?? []).length === 0 ? (
              <EmptyState icon={Activity} title="Aucune activité" description="Les nouvelles étapes des dossiers apparaîtront ici dès qu'elles seront créées." size="compact" />
            ) : (
              (activityRes.data ?? []).map((item: any, index: number) => {
                const ref = item.dossier?.reference;
                const href = ref ? `/portail-avocat/dossiers/${encodeURIComponent(ref)}` : null;
                return (
                  <AnimatedActivityCard key={item.id} title={item.title} subtitle={`${ref ?? "Dossier"} - ${fmtDateTime(item.created_at)}`} href={href} index={index} />
                );
              })
            )}
          </div>
        </article>

        <article className="rounded-lg border border-border bg-surface p-6 xl:col-span-5">
          <div className="mb-4 flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-bordeaux" />
            <h2 className="text-xl text-foreground">RDV aujourd&apos;hui</h2>
          </div>
          <div className="space-y-2">
            {(todayRdvRes.data ?? []).length === 0 ? (
              <EmptyState icon={CalendarX} title="Journée libre" description="Aucun rendez-vous prévu aujourd'hui." action={{ label: "Voir l'agenda complet", href: "/portail-avocat/agenda" }} size="compact" />
            ) : (
              (todayRdvRes.data ?? []).map((rdv: any) => (
                <div key={rdv.id} className="rounded-sm border border-border-subtle p-3">
                  <p className="text-sm text-foreground">{rdv.title}</p>
                  <p className="mt-1 text-xs text-text-secondary">{fmtDateTime(rdv.starts_at)} - {rdv.client?.full_name ?? "Client"}</p>
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-bordeaux" />
          <h2 className="text-xl text-foreground">Dossiers urgents (deadline &lt; 7j)</h2>
        </div>
        <div className="rounded-lg border border-border bg-surface">
          {urgentRows.length === 0 ? (
            <EmptyState icon={ShieldCheck} title="Tout est sous contrôle" description="Aucune échéance critique cette semaine." size="default" />
          ) : (
            urgentRows.map((item: any, index: number) => (
              <div key={item.id} className={`px-5 py-4 ${index !== 0 ? "border-t border-border-subtle" : ""}`}>
                <p className="text-sm text-foreground">{item.title}</p>
                <p className="mt-1 text-xs text-text-secondary">
                  {item.dossier?.reference} - échéance {new Intl.DateTimeFormat("fr-BE", { day: "numeric", month: "short", year: "numeric" }).format(new Date(item.due_date))}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}