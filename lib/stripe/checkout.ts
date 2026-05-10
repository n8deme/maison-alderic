import { createClient as createAdminClient } from "@supabase/supabase-js";
import { stripe } from "./server";
import { getOrCreateStripeCustomer } from "./customers";

interface CheckoutResult {
  url: string;
  sessionId: string;
}

function adminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/**
 * Crée ou réutilise une Checkout Session Stripe pour une facture.
 * Si une session existante est encore ouverte, la réutilise pour éviter
 * de créer plusieurs sessions pour la même facture.
 */
export async function createOrReuseCheckoutSession(
  invoiceId: string,
): Promise<CheckoutResult> {
  const admin = adminClient();

  const { data: invoice, error } = await admin
    .from("invoices")
    .select(
      `
      id, invoice_number, client_id, amount_ttc, status,
      stripe_checkout_session_id, stripe_checkout_expires_at,
      dossier:dossiers(reference, title)
    `,
    )
    .eq("id", invoiceId)
    .single();

  if (error || !invoice) throw new Error("Facture introuvable");

  if (!["sent", "overdue"].includes(invoice.status)) {
    throw new Error(`Facture non payable (statut : ${invoice.status})`);
  }

  // Réutiliser la session existante si elle n'est pas expirée
  if (invoice.stripe_checkout_session_id && invoice.stripe_checkout_expires_at) {
    const expiresAt = new Date(invoice.stripe_checkout_expires_at as string);
    if (expiresAt > new Date()) {
      try {
        const session = await stripe.checkout.sessions.retrieve(
          invoice.stripe_checkout_session_id as string,
        );
        if (session.status === "open" && session.url) {
          return { url: session.url, sessionId: session.id };
        }
      } catch {
        // Session invalide ou expirée côté Stripe — on en crée une nouvelle
      }
    }
  }

  // Créer un Customer Stripe si besoin
  const customerId = await getOrCreateStripeCustomer(invoice.client_id);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Normaliser dossier (Supabase peut retourner objet ou tableau selon la jointure)
  const dossier = Array.isArray(invoice.dossier)
    ? invoice.dossier[0]
    : invoice.dossier;

  // 23h30 : rester sous la limite de 24h imposée par Stripe
  const expiresAtUnix = Math.floor(Date.now() / 1000) + 23 * 3600 + 30 * 60;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Facture ${invoice.invoice_number}`,
            description: dossier
              ? `Honoraires — Dossier ${dossier.reference}`
              : "Honoraires Maison Aldéric & Associés",
          },
          unit_amount: Math.round(Number(invoice.amount_ttc) * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/portail/facturation/${invoiceId}/paiement-reussi?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/portail/facturation/${invoiceId}`,
    metadata: {
      invoice_id: invoiceId,
      invoice_number: invoice.invoice_number,
    },
    expires_at: expiresAtUnix,
  });

  if (!session.url) throw new Error("Stripe n'a pas retourné d'URL pour la session");

  await admin
    .from("invoices")
    .update({
      stripe_checkout_session_id: session.id,
      stripe_checkout_expires_at: new Date(expiresAtUnix * 1000).toISOString(),
    })
    .eq("id", invoiceId);

  return { url: session.url, sessionId: session.id };
}
