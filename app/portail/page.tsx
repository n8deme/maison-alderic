import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FolderOpen, MessageSquare, Calendar, Receipt, ArrowRight, Clock, AlertCircle } from "lucide-react";

export const metadata: Metadata = { title: "Tableau de bord" };

type DossierStatus = "active" | "pending" | "archived" | "won" | "lost";

function StatusBadge({ status }: { status: DossierStatus }) {
  const cfg: Record<DossierStatus, { label: string; color: string; bg: string }> = {
    active:   { label: "Actif",     color: "var(--bordeaux)",       bg: "rgba(122,31,43,0.08)" },
    pending:  { label: "En attente",color: "var(--text-secondary)", bg: "var(--surface-alt)"   },
    archived: { label: "Archivé",   color: "var(--text-muted)",     bg: "var(--surface-alt)"   },
    won:      { label: "Clôturé",   color: "#16a34a",               bg: "rgba(22,163,74,0.08)" },
    lost:     { label: "Perdu",     color: "var(--text-muted)",     bg: "var(--surface-alt)"   },
  };
  const c = cfg[status] ?? cfg.pending;
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium uppercase tracking-wider shrink-0"
      style={{ color: c.color, backgroundColor: c.bg, fontFamily: "var(--font-body)" }}
    >
      {c.label}
    </span>
  );
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", {
    weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portail/login");

  const [dossiersResult, rdvResult, messagesResult, invoicesResult] = await Promise.all([
    supabase
      .from("dossiers")
      .select("id, reference, title, status, type, opened_at", { count: "exact" })
      .eq("client_id", user.id)
      .eq("status", "active")
      .order("opened_at", { ascending: false })
      .limit(3),

    supabase
      .from("appointments")
      .select("id, title, starts_at, ends_at, location, avocat:avocats(full_name)")
      .eq("client_id", user.id)
      .in("status", ["scheduled", "confirmed"])
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(1)
      .maybeSingle(),

    supabase
      .from("messages")
      .select("id, content, created_at, dossier:dossiers(reference, title)", { count: "exact" })
      .eq("sender_type", "avocat")
      .is("read_at", null)
      .order("created_at", { ascending: false })
      .limit(1),

    supabase
      .from("invoices")
      .select("id, invoice_number, amount_ttc, status, due_at")
      .eq("client_id", user.id)
      .in("status", ["sent", "overdue"]),
  ]);

  const dossiers      = dossiersResult.data ?? [];
  const dossiersCount = dossiersResult.count ?? 0;
  const nextRdv       = rdvResult.data;
  const messages      = messagesResult.data ?? [];
  const unreadCount   = messagesResult.count ?? 0;
  const lastMessage   = messages[0] ?? null;
  const invoices      = invoicesResult.data ?? [];
  const invoicesTotal = invoices.reduce((s, i) => s + Number(i.amount_ttc), 0);
  const hasOverdue    = invoices.some((i) => i.status === "overdue");

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-medium"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          Tableau de bord
        </h1>
        <p className="mt-1 text-sm text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
          Bienvenue sur votre espace client Maison Aldéric &amp; Associés.
        </p>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Dossiers actifs */}
        <div className="bg-surface border border-border rounded-sm p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" style={{ color: "var(--bordeaux)" }} />
              <span className="text-xs font-medium uppercase tracking-wider text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                Dossiers actifs
              </span>
            </div>
            <span className="text-2xl font-medium tabular-nums" style={{ fontFamily: "var(--font-body)" }}>
              {dossiersCount}
            </span>
          </div>

          <div className="space-y-0">
            {dossiers.length === 0 ? (
              <p className="text-sm text-text-muted" style={{ fontFamily: "var(--font-body)" }}>Aucun dossier actif.</p>
            ) : (
              dossiers.map((d) => (
                <Link
                  key={d.id}
                  href={`/portail/dossiers/${d.id}`}
                  className="flex items-center justify-between gap-2 py-2 border-t border-border-subtle group"
                >
                  <div className="min-w-0">
                    <p
                      className="text-xs font-medium truncate transition-colors group-hover:text-[color:var(--bordeaux)]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {d.title}
                    </p>
                    <p className="text-[10px] text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                      {d.reference} · {d.type}
                    </p>
                  </div>
                  <StatusBadge status={d.status as DossierStatus} />
                </Link>
              ))
            )}
          </div>

          <Link
            href="/portail/dossiers"
            className="flex items-center gap-1 text-xs mt-auto text-text-secondary hover:text-[color:var(--bordeaux)] transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Voir tous les dossiers <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Messages non lus */}
        <div className="bg-surface border border-border rounded-sm p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" style={{ color: "var(--bordeaux)" }} />
              <span className="text-xs font-medium uppercase tracking-wider text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                Messages non lus
              </span>
            </div>
            <span
              className="text-2xl font-medium tabular-nums"
              style={{ fontFamily: "var(--font-body)", color: unreadCount > 0 ? "var(--bordeaux)" : "var(--foreground)" }}
            >
              {unreadCount}
            </span>
          </div>

          {lastMessage ? (
            <div className="border-l-2 pl-3 py-1" style={{ borderColor: "var(--bordeaux)" }}>
              <p className="text-xs text-text-secondary line-clamp-2" style={{ fontFamily: "var(--font-body)" }}>
                {lastMessage.content}
              </p>
              <p className="text-[10px] text-text-muted mt-1" style={{ fontFamily: "var(--font-body)" }}>
                {(lastMessage.dossier as unknown as { reference: string } | null)?.reference}
                {" · "}
                {formatDate(lastMessage.created_at)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-text-muted" style={{ fontFamily: "var(--font-body)" }}>Aucun nouveau message.</p>
          )}

          <Link
            href="/portail/messages"
            className="flex items-center gap-1 text-xs mt-auto text-text-secondary hover:text-[color:var(--bordeaux)] transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Accéder à la messagerie <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Prochain RDV */}
        <div className="bg-surface border border-border rounded-sm p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color: "var(--bordeaux)" }} />
            <span className="text-xs font-medium uppercase tracking-wider text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
              Prochain rendez-vous
            </span>
          </div>

          {nextRdv ? (
            <div className="space-y-1.5">
              <p className="text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>
                {nextRdv.title}
              </p>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 shrink-0 text-text-muted" />
                <p className="text-xs text-text-secondary capitalize" style={{ fontFamily: "var(--font-body)" }}>
                  {formatDateTime(nextRdv.starts_at)}
                </p>
              </div>
              {nextRdv.location && (
                <p className="text-xs text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                  {nextRdv.location}
                </p>
              )}
              {nextRdv.avocat && (
                <p className="text-xs text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                  Avec {(nextRdv.avocat as unknown as { full_name: string }).full_name}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-text-muted" style={{ fontFamily: "var(--font-body)" }}>Aucun rendez-vous à venir.</p>
          )}

          <Link
            href="/portail/rdv"
            className="flex items-center gap-1 text-xs mt-auto text-text-secondary hover:text-[color:var(--bordeaux)] transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Voir les rendez-vous <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Factures impayées */}
        <div className="bg-surface border border-border rounded-sm p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4" style={{ color: "var(--bordeaux)" }} />
              <span className="text-xs font-medium uppercase tracking-wider text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                Factures impayées
              </span>
            </div>
            {hasOverdue && (
              <div className="flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" style={{ color: "var(--bordeaux)" }} />
                <span
                  className="text-[10px] uppercase tracking-wider font-medium"
                  style={{ color: "var(--bordeaux)", fontFamily: "var(--font-body)" }}
                >
                  En retard
                </span>
              </div>
            )}
          </div>

          {invoices.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-2xl font-medium tabular-nums" style={{ fontFamily: "var(--font-body)" }}>
                {new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR" }).format(invoicesTotal)}
              </p>
              <p className="text-xs text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
                {invoices.length} facture{invoices.length > 1 ? "s" : ""} en attente de règlement
              </p>
              {invoices.slice(0, 2).map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-1.5 border-t border-border-subtle">
                  <span className="text-[10px] text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                    {inv.invoice_number}
                  </span>
                  <span className="text-[10px] tabular-nums text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
                    {new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR" }).format(Number(inv.amount_ttc))}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted" style={{ fontFamily: "var(--font-body)" }}>Aucune facture en attente.</p>
          )}

          <Link
            href="/portail/facturation"
            className="flex items-center gap-1 text-xs mt-auto text-text-secondary hover:text-[color:var(--bordeaux)] transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Voir la facturation <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
