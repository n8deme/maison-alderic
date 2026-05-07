import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDateFrLong } from "@/lib/format-date";
import { Receipt, AlertCircle, CheckCircle2, Clock, Ban } from "lucide-react";

export const metadata: Metadata = { title: "Facturation" };

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  draft:     { label: "Brouillon",  color: "var(--text-muted)",     bg: "var(--surface-alt)",        icon: <Clock className="w-3 h-3" />         },
  sent:      { label: "Envoyée",    color: "var(--text-secondary)", bg: "rgba(92,90,85,0.1)",         icon: <Receipt className="w-3 h-3" />       },
  paid:      { label: "Réglée",     color: "#16a34a",               bg: "rgba(22,163,74,0.08)",       icon: <CheckCircle2 className="w-3 h-3" />  },
  overdue:   { label: "En retard",  color: "var(--bordeaux)",       bg: "rgba(122,31,43,0.08)",       icon: <AlertCircle className="w-3 h-3" />   },
  cancelled: { label: "Annulée",    color: "var(--text-muted)",     bg: "var(--surface-alt)",        icon: <Ban className="w-3 h-3" />           },
};

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const c = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-medium uppercase tracking-wider shrink-0"
      style={{ color: c.color, backgroundColor: c.bg, fontFamily: "var(--font-body)" }}
    >
      {c.icon}
      {c.label}
    </span>
  );
}

function fmtEur(n: number) {
  return new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR" }).format(n);
}

export default async function FacturationPage({
  searchParams,
}: {
  searchParams: Promise<{ invoice?: string }>;
}) {
  const { invoice: selectedId } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const [invoicesResult, linesResult] = await Promise.all([
    supabase
      .from("invoices")
      .select("id, invoice_number, amount_ht, vat_amount, amount_ttc, status, issued_at, due_at, paid_at, dossier:dossiers(reference, title)")
      .eq("client_id", user.id)
      .order("issued_at", { ascending: false }),

    selectedId
      ? supabase
          .from("invoice_lines")
          .select("id, description, quantity, unit_price, total, display_order")
          .eq("invoice_id", selectedId)
          .order("display_order", { ascending: true })
      : Promise.resolve({ data: null }),
  ]);

  const invoices = invoicesResult.data ?? [];
  const lines    = (linesResult as { data: unknown }).data as Array<{
    id: string; description: string; quantity: number; unit_price: number; total: number; display_order: number;
  }> | null;

  const totalDue = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((s, i) => s + Number(i.amount_ttc), 0);

  const selected = selectedId ? invoices.find((i) => i.id === selectedId) : null;

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="mb-6">
        <h1
          className="text-2xl md:text-3xl font-medium"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          Facturation
        </h1>
        <p className="mt-1 text-sm text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
          {invoices.length} facture{invoices.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Summary card */}
      {totalDue > 0 && (
        <div
          className="mb-6 border rounded-sm px-5 py-4 flex items-center justify-between gap-4"
          style={{ borderColor: "rgba(122,31,43,0.3)", backgroundColor: "rgba(122,31,43,0.04)" }}
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" style={{ color: "var(--bordeaux)" }} />
            <p className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--foreground)" }}>
              <span className="font-medium tabular-nums">{fmtEur(totalDue)}</span>
              {" "}en attente de règlement
            </p>
          </div>
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--bordeaux)", fontFamily: "var(--font-body)" }}
          >
            Action requise
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice list */}
        <div className="lg:col-span-2">
          {invoices.length === 0 ? (
            <div className="bg-surface border border-border rounded-sm p-12 text-center">
              <Receipt className="w-8 h-8 mx-auto mb-3 text-text-muted" />
              <p className="text-sm text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
                Aucune facture.
              </p>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-sm overflow-hidden">
              {invoices.map((inv, idx) => {
                const dossier = inv.dossier as unknown as { reference: string; title: string } | null;
                const isSelected = inv.id === selectedId;
                return (
                  <a
                    key={inv.id}
                    href={`/portail/facturation?invoice=${inv.id}`}
                    className={`flex items-center gap-4 px-5 py-4 transition-colors ${
                      idx !== 0 ? "border-t border-border-subtle" : ""
                    } ${isSelected ? "bg-surface-alt" : "hover:bg-surface-alt"}`}
                  >
                    {isSelected && (
                      <span
                        className="w-0.5 h-6 rounded-full shrink-0"
                        style={{ backgroundColor: "var(--bordeaux)" }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] text-text-muted uppercase tracking-wider font-medium" style={{ fontFamily: "var(--font-body)" }}>
                          {inv.invoice_number}
                        </span>
                        {dossier && (
                          <>
                            <span className="text-[10px] text-border">·</span>
                            <span className="text-[10px] text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                              {dossier.reference}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium tabular-nums" style={{ fontFamily: "var(--font-body)" }}>
                          {fmtEur(Number(inv.amount_ttc))}
                        </span>
                        {inv.due_at && (inv.status === "sent" || inv.status === "overdue") && (
                          <span className="text-xs text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                            Échéance {formatDateFrLong(inv.due_at)}
                          </span>
                        )}
                        {inv.paid_at && inv.status === "paid" && (
                          <span className="text-xs text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                            Payée le {formatDateFrLong(inv.paid_at)}
                          </span>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={inv.status as InvoiceStatus} />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Invoice detail */}
        <div>
          {selected ? (
            <div className="bg-surface border border-border rounded-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-medium uppercase tracking-wider text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                  {selected.invoice_number}
                </h2>
                <StatusBadge status={selected.status as InvoiceStatus} />
              </div>

              {/* Lines */}
              {lines && lines.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider" style={{ fontFamily: "var(--font-body)" }}>
                    Détail
                  </p>
                  {lines.map((line) => (
                    <div key={line.id} className="flex justify-between gap-3 py-1 border-t border-border-subtle">
                      <div className="min-w-0">
                        <p className="text-xs" style={{ fontFamily: "var(--font-body)" }}>{line.description}</p>
                        <p className="text-[10px] text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                          {line.quantity} × {fmtEur(Number(line.unit_price))}
                        </p>
                      </div>
                      <span className="text-xs tabular-nums shrink-0" style={{ fontFamily: "var(--font-body)" }}>
                        {fmtEur(Number(line.total))}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Totals */}
              <div className="border-t border-border pt-3 space-y-1.5">
                <div className="flex justify-between text-xs text-text-secondary">
                  <span style={{ fontFamily: "var(--font-body)" }}>Sous-total HT</span>
                  <span className="tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{fmtEur(Number(selected.amount_ht))}</span>
                </div>
                <div className="flex justify-between text-xs text-text-secondary">
                  <span style={{ fontFamily: "var(--font-body)" }}>TVA</span>
                  <span className="tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{fmtEur(Number(selected.vat_amount))}</span>
                </div>
                <div className="flex justify-between text-sm font-medium border-t border-border pt-2 mt-1">
                  <span style={{ fontFamily: "var(--font-body)" }}>Total TTC</span>
                  <span className="tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{fmtEur(Number(selected.amount_ttc))}</span>
                </div>
              </div>

              {(selected.status === "sent" || selected.status === "overdue") && (
                <button
                  className="w-full py-2.5 text-xs font-medium rounded-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--bordeaux)", color: "#fff", fontFamily: "var(--font-body)" }}
                >
                  Régler cette facture
                </button>
              )}
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-sm p-5">
              <p className="text-xs text-text-muted text-center" style={{ fontFamily: "var(--font-body)" }}>
                Sélectionnez une facture pour voir son détail.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
