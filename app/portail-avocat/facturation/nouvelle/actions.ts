"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const invoiceLineSchema = z.object({
  description: z.string().min(1, "Description requise"),
  quantity: z.coerce.number().min(0.01, "Quantité invalide"),
  unit_price: z.coerce.number().min(0, "Prix invalide"),
});

const invoiceSchema = z.object({
  client_id: z.string().uuid("Client requis"),
  dossier_id: z.string().uuid().optional().nullable(),
  issued_at: z.string().min(1, "Date d'émission requise"),
  due_at: z.string().min(1, "Date d'échéance requise"),
  lines: z.array(invoiceLineSchema).min(1, "Au moins une ligne requise"),
  send: z.boolean().optional().default(false),
});

export type InvoiceFormInput = z.infer<typeof invoiceSchema>;

export async function createInvoice(
  data: InvoiceFormInput,
): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "avocat") return { error: "Accès refusé" };

  const parsed = invoiceSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  // Générer numéro facture
  const year = new Date().getFullYear();
  const { data: last } = await supabase
    .from("invoices")
    .select("invoice_number")
    .like("invoice_number", `F${year}-%`)
    .order("invoice_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  let nextNum = 1;
  if (last?.invoice_number) {
    const lastNum = parseInt(last.invoice_number.split("-").pop() ?? "0");
    if (!isNaN(lastNum)) nextNum = lastNum + 1;
  }
  const invoice_number = `F${year}-${String(nextNum).padStart(4, "0")}`;

  // Calculer les totaux
  const amount_ht = parsed.data.lines.reduce(
    (sum, l) => sum + l.quantity * l.unit_price,
    0,
  );
  const vat_amount = Math.round(amount_ht * 0.21 * 100) / 100;
  const amount_ttc = Math.round((amount_ht + vat_amount) * 100) / 100;

  const { data: invoice, error: insertError } = await supabase
    .from("invoices")
    .insert({
      invoice_number,
      client_id: parsed.data.client_id,
      dossier_id: parsed.data.dossier_id || null,
      amount_ht,
      vat_amount,
      amount_ttc,
      status: parsed.data.send ? "sent" : "draft",
      issued_at: new Date(parsed.data.issued_at).toISOString(),
      due_at: new Date(parsed.data.due_at).toISOString(),
    })
    .select("id")
    .single();

  if (insertError || !invoice) {
    return { error: insertError?.message ?? "Erreur lors de la création" };
  }

  const lineRows = parsed.data.lines.map((l, idx) => ({
    invoice_id: invoice.id,
    description: l.description,
    quantity: l.quantity,
    unit_price: l.unit_price,
    total: Math.round(l.quantity * l.unit_price * 100) / 100,
    display_order: idx,
  }));

  const { error: linesError } = await supabase.from("invoice_lines").insert(lineRows);
  if (linesError) {
    await supabase.from("invoices").delete().eq("id", invoice.id);
    return { error: "Erreur lors de l'ajout des lignes" };
  }

  return { id: invoice.id };
}

// Récupérer les dossiers d'un client (pour le select dynamique)
export async function getDossiersByClient(
  clientId: string,
): Promise<{ id: string; reference: string; title: string }[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("dossiers")
    .select("id, reference, title")
    .eq("client_id", clientId)
    .eq("status", "active")
    .order("opened_at", { ascending: false });
  return data ?? [];
}
