"use server";

import { createClient } from "@/lib/supabase/server";
import { createOrReuseCheckoutSession } from "@/lib/stripe/checkout";

export async function payInvoice(invoiceId: string): Promise<{ url: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Non authentifié");

  // La RLS invoices_select_client garantit qu'on ne peut voir que sa propre facture
  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("id, status, client_id")
    .eq("id", invoiceId)
    .single();

  if (error || !invoice) throw new Error("Facture introuvable");

  if (!["sent", "overdue"].includes(invoice.status)) {
    throw new Error("Cette facture n'est pas payable.");
  }

  const { url } = await createOrReuseCheckoutSession(invoiceId);
  return { url };
}
