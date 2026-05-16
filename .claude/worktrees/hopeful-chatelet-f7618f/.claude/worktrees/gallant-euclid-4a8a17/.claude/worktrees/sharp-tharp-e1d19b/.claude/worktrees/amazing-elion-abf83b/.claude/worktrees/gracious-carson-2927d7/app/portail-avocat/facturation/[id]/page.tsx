import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { generateInvoicePDF } from "./pdf-actions";
import { DownloadPdfButton } from "@/components/pdf/download-pdf-button";

export const metadata: Metadata = { title: "Détail facture" };

function fmtDate(iso: string | null) {
  if (!iso) return "-";
  return new Intl.DateTimeFormat("fr-BE", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

function fmtEur(value: number) {
  return new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR" }).format(value);
}

function getStatusBadge(status: string) {
  const styles = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-600",
  };
  const labels = {
    draft: "Brouillon",
    sent: "Envoyée",
    paid: "Payée",
    overdue: "En retard",
    cancelled: "Annulée",
  };
  return { style: styles[status as keyof typeof styles] || styles.draft, label: labels[status as keyof typeof labels] || status };
}

export default async function FactureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: invoice } = await supabase
    .from("invoices")
    .select(`
      id,
      invoice_number,
      amount_ht,
      vat_amount,
      amount_ttc,
      status,
      issued_at,
      due_at,
      paid_at,
      notes,
      client:profiles!client_id(full_name, email, company),
      dossier:dossiers(reference, title)
    `)
    .eq("id", id)
    .single();

  if (!invoice) notFound();

  const badge = getStatusBadge(invoice.status);
  const dossier = Array.isArray(invoice.dossier) ? invoice.dossier[0] : invoice.dossier;
  const client = Array.isArray(invoice.client) ? invoice.client[0] : invoice.client;

  return (
    <div className="max-w-4xl p-6 md:p-8">
      <Link href="/portail-avocat/facturation" className="mb-4 inline-flex items-center gap-2 text-sm text-text-muted hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Retour à la facturation
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
            Facture {invoice.invoice_number}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Dossier {dossier?.reference} — {dossier?.title}
          </p>
        </div>
        <span className={`rounded-sm px-3 py-1 text-xs font-medium ${badge.style}`}>
          {badge.label}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-sm border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm font-medium text-text-muted">Client</h2>
          <p className="text-foreground">{client?.full_name}</p>
          {client?.company && <p className="text-sm text-text-muted">{client.company}</p>}
          <p className="mt-2 text-sm text-text-muted">{client?.email}</p>
        </div>

        <div className="rounded-sm border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm font-medium text-text-muted">Informations</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Date émission :</span>
              <span className="text-foreground">{fmtDate(invoice.issued_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Date échéance :</span>
              <span className="text-foreground">{fmtDate(invoice.due_at)}</span>
            </div>
            {invoice.paid_at && (
              <div className="flex justify-between">
                <span className="text-text-muted">Date paiement :</span>
                <span className="text-foreground">{fmtDate(invoice.paid_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-sm border border-border bg-surface p-4">
        <h2 className="mb-4 text-sm font-medium text-text-muted">Montants</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Montant HT :</span>
            <span className="text-foreground">{fmtEur(Number(invoice.amount_ht))}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">TVA (21%) :</span>
            <span className="text-foreground">{fmtEur(Number(invoice.vat_amount))}</span>
          </div>
          <div className="flex justify-between border-t border-border-subtle pt-2 text-base font-medium">
            <span>Total TTC :</span>
            <span>{fmtEur(Number(invoice.amount_ttc))}</span>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="mt-6 rounded-sm border border-border bg-surface p-4">
          <h2 className="mb-2 text-sm font-medium text-text-muted">Notes</h2>
          <p className="text-sm text-foreground">{invoice.notes}</p>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <DownloadPdfButton
          action={generateInvoicePDF.bind(null, id)}
          fileName={`facture-${invoice.invoice_number}.pdf`}
          label="Télécharger PDF"
        />
      </div>
    </div>
  );
}