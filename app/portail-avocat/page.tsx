import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertCircle, CalendarDays, FolderOpen, UserPlus, Euro, Clock3, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

function fmtEur(value: number) {
  return new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR" }).format(value);
}

function fmtDateTime(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default async function PortailAvocatDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);
  const weekEnd = new Date(todayStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const nowIso = now.toISOString();

  const [activeRes, newClientsRes, rdvWeekRes, caRes, overdueRes, activityRes, todayRdvRes, urgentRes] = await Promise.all([
    // Dossiers actifs (active OU pending)
    supabase.from("dossiers").select("id", { count: "exact", head: true }).in("status", ["active", "pending"]),

    // Nouveaux clients du mois
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "client").gte("created_at", monthStart),

    // RDV à venir cette semaine
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .gte("starts_at", todayStart.toISOString())
      .lt("starts_at", weekEnd.toISOString()),

    // CA du mois — FIX : filtrer sur paid_at (et status=paid), pas issued_at
    supabase
      .from("invoices")
      .select("amount_ttc, paid_at")
      .eq("status", "paid")
      .gte("paid_at", monthStart)
      .lt("paid_at", nowIso),

    // Factures en retard — sent OU overdue avec due_at dépassée
    supabase
      .from("invoices")
      .select("id, amount_ttc", { count: "exact" })
      .in("status", ["sent", "overdue"])
      .lt("due_at", nowIso),

    // Activité récente
    supabase
      .from("dossier_timeline")
      .select("id, title, status, created_at, dossier:dossiers(id, reference, title)")
      .order("created_at", { ascending: false })
      .limit(10),

    // RDV aujourd'hui
    supabase
      .from("appointments")
      .select("id, title, starts_at, ends_at, location, avocat:avocats(full_name), client:profiles!client_id(full_name)")
      .gte("starts_at", todayStart.toISOString())
      .lt("starts_at", todayEnd.toISOString())
      .order("starts_at", { ascending: true }),

    // Dossiers urgents (deadline < 7j)
    supabase
      .from("dossier_timeline")
      .select("id, title, due_date, dossier:dossiers(id, reference, title, status)")
      .gte("due_date", todayStart.toISOString())
      .lt("due_date", weekEnd.toISOString())
      .order("due_date", { ascending: true })
      .limit(10),
  ]);

  const caMonth = (caRes.data ?? []).reduce(
    (sum: number, item: { amount_ttc: number | string }) => sum + Number(item.amount_ttc),
    0
  );
  const overdueCount = overdueRes.count ?? 0;
  const overdueAmount = (overdueRes.data ?? []).reduce(
    (sum: number, item: { amount_ttc: number | string }) => sum + Number(item.amount_ttc),
    0
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

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {[
          { label: "Dossiers actifs",        value: activeRes.count ?? 0,      icon: FolderOpen,    href: "/portail-avocat/dossiers?status=active", sublabel: undefined },
          { label: "Nouveaux clients (mois)", value: newClientsRes.count ?? 0, icon: UserPlus,      href: "/portail-avocat/clients", sublabel: undefined },
          { label: "RDV semaine",            value: rdvWeekRes.count ?? 0,     icon: CalendarDays,  href: "/portail-avocat/agenda", sublabel: undefined },
          { label: "CA du mois",             value: fmtEur(caMonth),           icon: Euro,          href: "/portail-avocat/facturation?status=paid", sublabel: undefined },
          { label: "Factures en retard",     value: overdueCount,              icon: AlertTriangle, href: "/portail-avocat/facturation?status=overdue", sublabel: overdueCount > 0 ? fmtEur(overdueAmount) : undefined },
        ].map((card) => {
          const Icon = card.icon;
          const isOverdue = card.label === "Factures en retard" && Number(card.value) > 0;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-lg border border-border bg-surface p-5 cursor-pointer transition-colors hover:bg-surface-alt"
            >
              <div className="mb-2 flex items-center justify-between">
                <Icon className={`h-4 w-4 ${isOverdue ? "text-bordeaux" : "text-bordeaux"}`} />
              </div>
              <p className={`text-3xl ${isOverdue ? "text-bordeaux" : "text-foreground"}`}>{card.value}</p>
              <p className="mt-1 text-xs text-text-muted">{card.label}</p>
              {card.sublabel && (
                <p className="mt-0.5 text-xs text-text-secondary">{card.sublabel}</p>
              )}
            </Link>
          );
        })}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <article className="rounded-lg border border-border bg-surface p-6 xl:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl text-foreground">Activité récente</h2>
            <Link href="/portail-avocat/dossiers" className="text-sm text-bordeaux">Voir dossiers</Link>
          </div>
          <div className="space-y-2">
            {(activityRes.data ?? []).length === 0 ? (
              <p className="text-sm text-text-muted">Aucune activité récente.</p>
            ) : (
              (activityRes.data ?? []).map((item: any) => (
                <div key={item.id} className="rounded-sm border border-border-subtle p-3">
                  <p className="text-sm text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {item.dossier?.reference ?? "Dossier"} - {fmtDateTime(item.created_at)}
                  </p>
                </div>
              ))
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
              <p className="text-sm text-text-muted">Aucun rendez-vous aujourd&apos;hui.</p>
            ) : (
              (todayRdvRes.data ?? []).map((rdv: any) => (
                <div key={rdv.id} className="rounded-sm border border-border-subtle p-3">
                  <p className="text-sm text-foreground">{rdv.title}</p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {fmtDateTime(rdv.starts_at)} - {rdv.client?.full_name ?? "Client"}
                  </p>
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
            <p className="p-6 text-sm text-text-muted">Aucune urgence cette semaine.</p>
          ) : (
            urgentRows.map((item: any, index: number) => (
              <div key={item.id} className={`px-5 py-4 ${index !== 0 ? "border-t border-border-subtle" : ""}`}>
                <p className="text-sm text-foreground">{item.title}</p>
                <p className="mt-1 text-xs text-text-secondary">
                  {item.dossier?.reference} - echeance {new Intl.DateTimeFormat("fr-BE", { day: "numeric", month: "short", year: "numeric" }).format(new Date(item.due_date))}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}