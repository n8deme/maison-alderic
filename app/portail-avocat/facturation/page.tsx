import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganization } from "@/lib/get-organization";
import { NewInvoiceButton } from "@/components/portail-avocat/facturation/new-invoice-button";
import { DataTableClickableRow } from "@/components/portail-avocat/ui/data-table-clickable-row";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableEmptyState,
  DataTableHead,
  DataTableHeadCell,
  DataTableHeadRow,
  DataTableTable,
  dataTableActionLinkClass,
} from "@/components/portail-avocat/ui/data-table";
import {
  computeDisplayStatus,
  invoiceStatusLabel,
  type InvoiceStatusKey,
} from "@/lib/invoice-status";

export const metadata: Metadata = { title: "Facturation" };

const INVOICE_BADGE_CLASS: Record<InvoiceStatusKey, string> = {
  draft:     "bg-surface-alt text-text-secondary",
  sent:      "bg-yellow-100 text-yellow-800",
  paid:      "bg-green-100 text-green-800",
  overdue:   "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

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

  const org = await getOrganization();
  const yearStart = new Date(new Date().getFullYear(), 0, 1).toISOString();

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, invoice_number, amount_ttc, status, issued_at, due_at, paid_at, dossier:dossiers(reference, title), client:profiles!client_id(full_name)")
    .eq("organization_id", org.id)
    .order("issued_at", { ascending: false });

  const caYtd = (invoices ?? [])
    .filter(
      (i) => i.status === "paid" && i.paid_at != null && i.paid_at >= yearStart
    )
    .reduce((sum, i) => sum + Number(i.amount_ttc), 0);

  const overdue = (invoices ?? []).filter((i) => computeDisplayStatus({ status: i.status, due_at: i.due_at }) === "overdue");
  const overdueAmount = overdue.reduce((sum, i) => sum + Number(i.amount_ttc), 0);

  return (
    <div className="max-w-7xl p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>Facturation</h1>
        <NewInvoiceButton />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-sm border border-border bg-surface p-4">
          <p className="text-xs text-text-muted">CA encaissé · YTD 2026</p>
          <p className="mt-1 text-2xl text-foreground">{fmtEur(caYtd)}</p>
        </div>
        <div className="rounded-sm border border-border bg-surface p-4">
          <p className="text-xs text-text-muted">Factures en retard</p>
          <p className="mt-1 text-2xl text-foreground">{overdue.length}</p>
          <p className="text-sm text-bordeaux">{fmtEur(overdueAmount)}</p>
        </div>
      </div>

      <DataTable>
        <DataTableTable>
          <DataTableHead>
            <DataTableHeadRow>
              <DataTableHeadCell>Numéro</DataTableHeadCell>
              <DataTableHeadCell>Client</DataTableHeadCell>
              <DataTableHeadCell>Dossier</DataTableHeadCell>
              <DataTableHeadCell align="right">Montant TTC</DataTableHeadCell>
              <DataTableHeadCell>Statut</DataTableHeadCell>
              <DataTableHeadCell>Date émission</DataTableHeadCell>
              <DataTableHeadCell>Échéance</DataTableHeadCell>
              <DataTableHeadCell>Actions</DataTableHeadCell>
            </DataTableHeadRow>
          </DataTableHead>
          <DataTableBody>
            {(invoices ?? []).length === 0 ? (
              <DataTableEmptyState colSpan={8} />
            ) : (
              (invoices ?? []).map((inv: any) => {
                const displayStatus = computeDisplayStatus({ status: inv.status, due_at: inv.due_at });
                const href = `/portail-avocat/facturation/${inv.id}`;
                return (
                  <DataTableClickableRow
                    key={inv.id}
                    href={href}
                    ariaLabel={`Ouvrir la facture ${inv.invoice_number}`}
                  >
                    <DataTableCell mono>{inv.invoice_number}</DataTableCell>
                    <DataTableCell>{inv.client?.full_name ?? "-"}</DataTableCell>
                    <DataTableCell mono>{inv.dossier?.reference ?? "-"}</DataTableCell>
                    <DataTableCell amount>{fmtEur(Number(inv.amount_ttc))}</DataTableCell>
                    <DataTableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${INVOICE_BADGE_CLASS[displayStatus] ?? "bg-gray-100 text-gray-800"}`}
                      >
                        {invoiceStatusLabel[displayStatus]}
                      </span>
                    </DataTableCell>
                    <DataTableCell>{fmtDate(inv.issued_at)}</DataTableCell>
                    <DataTableCell>{fmtDate(inv.due_at)}</DataTableCell>
                    <DataTableCell>
                      <span className={dataTableActionLinkClass()}>Voir</span>
                    </DataTableCell>
                  </DataTableClickableRow>
                );
              })
            )}
          </DataTableBody>
        </DataTableTable>
      </DataTable>
    </div>
  );
}
