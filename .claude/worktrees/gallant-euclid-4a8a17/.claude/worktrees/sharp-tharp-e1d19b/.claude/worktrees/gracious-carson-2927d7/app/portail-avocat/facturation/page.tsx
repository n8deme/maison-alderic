import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { NewInvoiceButton } from "@/components/portail-avocat/facturation/new-invoice-button";
import { computeDisplayStatus, invoiceStatusLabel } from "@/lib/invoice-status";

export const metadata: Metadata = { title: "Facturation" };

function fmtDate(iso: string | null) {
  if (!iso) return "-";
  return new Intl.DateTimeFormat("fr-BE", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

function fmtEur(value: number) {
  return new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR" }).format(value);
}

export default async function AvocatFacturationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, invoice_number, amount_ttc, status, issued_at, due_at, dossier:dossiers(reference, title), client:profiles!client_id(full_name)")
    .order("issued_at", { ascending: false });

  const caMonth = (invoices ?? [])
    .filter((i) => i.issued_at >= monthStart && i.status !== "cancelled")
    .reduce((sum, i) => sum + Number(i.amount_ttc), 0);

  const overdue = (invoices ?? []).filter((i) => i.status === "overdue");
  const overdueAmount = overdue.reduce((sum, i) => sum + Number(i.amount_ttc), 0);

  return (
    <div className="max-w-7xl p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>Facturation</h1>
        <NewInvoiceButton />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-sm border border-border bg-surface p-4">
          <p className="text-xs text-text-muted">CA du mois</p>
          <p className="mt-1 text-2xl text-foreground">{fmtEur(caMonth)}</p>
        </div>
        <div className="rounded-sm border border-border bg-surface p-4">
          <p className="text-xs text-text-muted">Factures en retard</p>
          <p className="mt-1 text-2xl text-foreground">{overdue.length}</p>
          <p className="text-sm text-bordeaux">{fmtEur(overdueAmount)}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-sm border border-border bg-surface">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-surface-alt text-text-muted">
            <tr>
              <th className="px-3 py-2">Numéro</th>
              <th className="px-3 py-2">Client</th>
              <th className="px-3 py-2">Dossier</th>
              <th className="px-3 py-2">Montant TTC</th>
              <th className="px-3 py-2">Statut</th>
              <th className="px-3 py-2">Date émission</th>
              <th className="px-3 py-2">Échéance</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(invoices ?? []).map((inv: any) => (
              <tr key={inv.id} className="border-t border-border-subtle">
                <td className="px-3 py-2">{inv.invoice_number}</td>
                <td className="px-3 py-2">{inv.client?.full_name ?? "-"}</td>
                <td className="px-3 py-2">{inv.dossier?.reference ?? "-"}</td>
                <td className="px-3 py-2">{fmtEur(Number(inv.amount_ttc))}</td>
                <td className="px-3 py-2">
                  {invoiceStatusLabel[computeDisplayStatus({ status: inv.status, due_at: inv.due_at })]}
                </td>
                <td className="px-3 py-2">{fmtDate(inv.issued_at)}</td>
                <td className="px-3 py-2">{fmtDate(inv.due_at)}</td>
                <td className="px-3 py-2">
                  <Link href={`/portail-avocat/facturation/${inv.id}`} className="text-bordeaux underline">
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}