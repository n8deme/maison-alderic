import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { FolderOpen, ChevronRight, Calendar } from "lucide-react";

export const metadata: Metadata = { title: "Mes dossiers" };

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

function StatusBadge({ status }: { status: DossierStatus }) {
  const c = STATUS_STYLE[status] ?? STATUS_STYLE.pending;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium uppercase tracking-wider shrink-0"
      style={{ color: c.color, backgroundColor: c.bg, fontFamily: "var(--font-body)" }}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

export default async function DossierListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>;
}) {
  const { status, type } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portail/login");

  let query = supabase
    .from("dossiers")
    .select("id, reference, title, description, status, type, opened_at")
    .eq("client_id", user.id)
    .order("opened_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);
  if (type   && type   !== "all") query = query.eq("type",   type);

  const { data: dossiers } = await query;
  const list = dossiers ?? [];

  function buildUrl(key: "status" | "type", value: string) {
    const p = new URLSearchParams();
    if (key !== "status" && status && status !== "all") p.set("status", status);
    if (key !== "type"   && type   && type   !== "all") p.set("type",   type);
    if (value !== "all") p.set(key, value);
    const qs = p.toString();
    return `/portail/dossiers${qs ? `?${qs}` : ""}`;
  }

  const activeStatus = status ?? "all";
  const activeType   = type   ?? "all";
  const isFiltered   = (status && status !== "all") || (type && type !== "all");

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="mb-6">
        <h1
          className="text-2xl md:text-3xl font-medium"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          Mes dossiers
        </h1>
        <p className="mt-1 text-sm text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
          {list.length} dossier{list.length !== 1 ? "s" : ""}{isFiltered ? " (filtré)" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {(["all", "active", "pending", "archived", "won", "lost"] as const).map((s) => (
            <Link
              key={s}
              href={buildUrl("status", s)}
              className={cn(
                "px-3 py-1 text-xs rounded-sm border transition-colors",
                activeStatus === s
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-text-secondary hover:border-foreground hover:text-foreground"
              )}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {s === "all" ? "Tous" : STATUS_LABELS[s]}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["all", "M&A", "Litigation", "Tax", "Corporate", "PE", "Restructuring"] as const).map((t) => (
            <Link
              key={t}
              href={buildUrl("type", t)}
              className={cn(
                "px-3 py-1 text-xs rounded-sm border transition-colors",
                activeType === t
                  ? "border-[color:var(--bordeaux)] text-[color:var(--bordeaux)]"
                  : "border-border-subtle text-text-muted hover:border-border hover:text-text-secondary"
              )}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {t === "all" ? "Tous types" : t}
            </Link>
          ))}
        </div>
      </div>

      {/* List */}
      {list.length === 0 ? (
        <div className="bg-surface border border-border rounded-sm p-12 text-center">
          <FolderOpen className="w-8 h-8 mx-auto mb-3 text-text-muted" />
          <p className="text-sm text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
            Aucun dossier correspondant.
          </p>
          {isFiltered && (
            <Link
              href="/portail/dossiers"
              className="mt-3 inline-block text-xs underline text-text-muted"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Effacer les filtres
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-sm overflow-hidden">
          {list.map((d, idx) => (
            <Link
              key={d.id}
              href={`/portail/dossiers/${d.id}`}
              className={cn(
                "flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-alt group",
                idx !== 0 && "border-t border-border-subtle"
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider" style={{ fontFamily: "var(--font-body)" }}>
                    {d.reference}
                  </span>
                  <span className="text-[10px] text-border">·</span>
                  <span className="text-[10px] text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                    {d.type}
                  </span>
                </div>
                <p
                  className="text-sm font-medium truncate transition-colors group-hover:text-[color:var(--bordeaux)]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {d.title}
                </p>
                {d.description && (
                  <p className="text-xs text-text-muted truncate mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
                    {d.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <StatusBadge status={d.status as DossierStatus} />
                <div className="hidden sm:flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-text-muted" />
                  <span className="text-[10px] text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                    {fmtDate(d.opened_at)}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
