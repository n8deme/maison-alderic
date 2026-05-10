"use server";

import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { InvoicePDF } from "@/components/pdf/invoice-pdf";

export async function generateInvoicePDF(invoiceId: string): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const { data: invoice, error } = await supabase
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
      invoice_lines(description, quantity, unit_price, total, display_order),
      client:profiles!client_id(full_name, email, company),
      dossier:dossiers(reference, title)
    `)
    .eq("id", invoiceId)
    .single();

  if (error || !invoice) throw new Error("Facture introuvable");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inv     = invoice as any;
  const client  = Array.isArray(inv.client)  ? inv.client[0]  : inv.client;
  const dossier = Array.isArray(inv.dossier) ? inv.dossier[0] : inv.dossier;
  const lines   = (Array.isArray(inv.invoice_lines) ? inv.invoice_lines : [])
    .sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order);

  const generatedAt = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  }).format(new Date());

  const buffer = await renderToBuffer(
    <InvoicePDF
      invoiceNumber={inv.invoice_number}
      status={inv.status}
      issuedAt={inv.issued_at ?? null}
      dueAt={inv.due_at ?? null}
      paidAt={inv.paid_at ?? null}
      amountHt={Number(inv.amount_ht)}
      vatAmount={Number(inv.vat_amount)}
      amountTtc={Number(inv.amount_ttc)}
      notes={inv.notes ?? null}
      clientName={client?.full_name ?? null}
      clientCompany={client?.company ?? null}
      clientEmail={client?.email ?? null}
      dossierReference={dossier?.reference ?? null}
      dossierTitle={dossier?.title ?? null}
      lines={lines}
      generatedAt={generatedAt}
    />
  );

  return buffer.toString("base64");
}
