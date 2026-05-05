import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, CheckCircle2, FileText, MessageSquare, Euro } from "lucide-react";

export const metadata: Metadata = { title: "Dossier" };

type DossierStatus = "active" | "pending" | "archived" | "won" | "lost";

const STATUS_LABELS: Record<DossierStatus, string> = {
  active: "Actif", pending: "En attente", archived: "Archivé", won: "Clôturé", lost: "Perdu",
};
const STATUS_STYLE: Record<DossierStatus, { color: string; bg: string }> = {
  active:   { color: "var(--bordeaux)",       bg: "rgba(122,31,43,0.08)" },
  pending:  { color: "var(--text-secondary)", bg: "var(--surface-alt)"   },
  archived: { color: "var(--text-muted)",     bg: "var(--surface-alt)"   },
  won:      { color: "#16a34a",               bg: "rgba(22,163,74,0.08)" },
  lost:     { color: "var(--text-muted)",     bg: "var(--surface-alt)"   },
};

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

function fmtEur(n: number) {
  return new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR" }).format(n);
}

type TimelineStep = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  completed_at: string | null;
  display_order: number;
};

function TimelineItem({ step, isLast }: { step: TimelineStep; isLast: boolean }) {
  const done = step.status === "completed";
  const wip  = step.status === "in_progress";

  return (
    <div className="flex gap-4">
      {/* Column left: circle + line */}
      <div className="flex flex-col items-center pt-0.5">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2"
          style={{
            borderColor: done || wip ? "var(--bordeaux)" : "var(--border)",
            backgroundColor: done ? "var(--bordeaux)" : "var(--surface)",
          }}
        >
          {done ? (
            <CheckCircle2 className="w-3 h-3" style={{ color: "#fff" }} />
          ) : wip ? (
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--bordeaux)" }} />
          ) : (
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--border)" }} />
          )}
        </div>
        {!isLast && (
          <div
            className="w-px flex-1 mt-1"
            style={{ backgroundColor: done ? "var(--bordeaux)" : "var(--border)", minHeight: "20px" }}
          />
        )}
      </div>

      {/* Column right: content */}
      <div className={`flex-1 pb-7 ${isLast ? "pb-0" : ""}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p
              className="text-sm font-medium leading-tight"
              style={{
                fontFamily: "var(--font-body)",
                color: done || wip ? "var(--foreground)" : "var(--text-muted)",
              }}
            >
              {step.title}
            </p>
            {step.description && (
              <p className="text-xs text-text-secondary mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
                {step.description}
              </p>
            )}
          </div>
          <div className="shrink-0 text-right space-y-0.5">
            {done && step.completed_at && (
              <p className="text-[10px] text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                {fmtDate(step.completed_at)}
              </p>
            )}
            {!done && step.due_date && (
              <p className="text-[10px] text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                Échéance {fmtDate(step.due_date)}
              </p>
            )}
            <span
              className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[9px] font-medium uppercase tracking-wider"
              style={{
                color: done || wip ? "var(--bordeaux)" : "var(--text-muted)",
                backgroundColor: done || wip ? "rgba(122,31,43,0.08)" : "var(--surface-alt)",
              }}
            >
              {done ? "Terminé" : wip ? "En cours" : "À venir"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function DossierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portail/login");

  const [dossierRes, timelineRes, leadRes, docsRes, msgsRes] = await Promise.all([
    supabase
      .from("dossiers")
      .select("id, reference, title, description, status, type, opened_at, closed_at, budget_estimated, budget_consumed")
      .eq("id", id)
      .eq("client_id", user.id)
      .maybeSingle(),

    supabase
      .from("dossier_timeline")
      .select("id, title, description, status, due_date, completed_at, display_order")
      .eq("dossier_id", id)
      .order("display_order", { ascending: true }),

    supabase
      .from("dossier_avocats")
      .select("avocat:avocats(full_name, title)")
      .eq("dossier_id", id)
      .eq("role", "lead")
      .maybeSingle(),

    supabase
      .from("documents")
      .select("id", { count: "exact", head: true })
      .eq("dossier_id", id)
      .eq("visible_to_client", true),

    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("dossier_id", id),
  ]);

  if (!dossierRes.data) notFound();

  const d           = dossierRes.data;
  const timeline    = timelineRes.data ?? [];
  const lead        = leadRes.data?.avocat as unknown as { full_name: string; title: string } | null;
  const docsCount   = docsRes.count   ?? 0;
  const msgsCount   = msgsRes.count   ?? 0;
  const doneSteps   = timeline.filter((s) => s.status === "completed").length;

  const budgetPct =
    d.budget_estimated && Number(d.budget_estimated) > 0
      ? Math.min(100, Math.round((Number(d.budget_consumed) / Number(d.budget_estimated)) * 100))
      : null;

  const s = STATUS_STYLE[d.status as DossierStatus] ?? STATUS_STYLE.pending;

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Back */}
      <Link
        href="/portail/dossiers"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary mb-6 transition-colors"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Mes dossiers
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="text-[10px] text-text-muted uppercase tracking-widest" style={{ fontFamily: "var(--font-body)" }}>
            {d.reference}
          </span>
          <span className="text-[10px] text-border">·</span>
          <span className="text-[10px] text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
            {d.type}
          </span>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium uppercase tracking-wider"
            style={{ color: s.color, backgroundColor: s.bg, fontFamily: "var(--font-body)" }}
          >
            {STATUS_LABELS[d.status as DossierStatus] ?? d.status}
          </span>
        </div>
        <h1
          className="text-2xl md:text-3xl font-medium"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          {d.title}
        </h1>
        {d.description && (
          <p className="mt-2 text-sm text-text-secondary max-w-2xl" style={{ fontFamily: "var(--font-body)" }}>
            {d.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>
              Avancement du dossier
            </h2>
            {timeline.length > 0 && (
              <span className="text-xs text-text-muted tabular-nums" style={{ fontFamily: "var(--font-body)" }}>
                {doneSteps}/{timeline.length} étapes
              </span>
            )}
          </div>

          {timeline.length === 0 ? (
            <p className="text-sm text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
              Aucune étape définie pour ce dossier.
            </p>
          ) : (
            timeline.map((step, idx) => (
              <TimelineItem key={step.id} step={step} isLast={idx === timeline.length - 1} />
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Infos */}
          <div className="bg-surface border border-border rounded-sm p-5 space-y-4">
            <h2 className="text-xs font-medium uppercase tracking-wider text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
              Informations
            </h2>

            {lead && (
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5" style={{ fontFamily: "var(--font-body)" }}>
                  Avocat référent
                </p>
                <p className="text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>{lead.full_name}</p>
                <p className="text-xs text-text-muted" style={{ fontFamily: "var(--font-body)" }}>{lead.title}</p>
              </div>
            )}

            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5" style={{ fontFamily: "var(--font-body)" }}>
                Ouvert le
              </p>
              <p className="text-sm" style={{ fontFamily: "var(--font-body)" }}>{fmtDate(d.opened_at)}</p>
            </div>

            {d.closed_at && (
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5" style={{ fontFamily: "var(--font-body)" }}>
                  Clôturé le
                </p>
                <p className="text-sm" style={{ fontFamily: "var(--font-body)" }}>{fmtDate(d.closed_at)}</p>
              </div>
            )}

            {budgetPct !== null && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider" style={{ fontFamily: "var(--font-body)" }}>
                    Budget consommé
                  </p>
                  <span className="text-[10px] tabular-nums text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                    {budgetPct}%
                  </span>
                </div>
                <div className="h-1 bg-surface-alt rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${budgetPct}%`,
                      backgroundColor: budgetPct > 80 ? "var(--bordeaux)" : "var(--foreground)",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] tabular-nums text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                    {fmtEur(Number(d.budget_consumed))}
                  </span>
                  <span className="text-[9px] tabular-nums text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                    {fmtEur(Number(d.budget_estimated))}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="bg-surface border border-border rounded-sm overflow-hidden">
            {[
              { href: "/portail/documents", icon: FileText,      label: "Documents",  count: docsCount },
              { href: "/portail/messages",  icon: MessageSquare, label: "Messages",   count: msgsCount },
              { href: "/portail/facturation", icon: Euro,        label: "Facturation", count: null     },
            ].map(({ href, icon: Icon, label, count }, idx) => (
              <div key={href}>
                {idx !== 0 && <div className="border-t border-border-subtle" />}
                <Link
                  href={href}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-alt transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-text-muted" />
                    <span className="text-sm" style={{ fontFamily: "var(--font-body)" }}>{label}</span>
                  </div>
                  {count !== null && (
                    <span className="text-xs tabular-nums text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                      {count}
                    </span>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
