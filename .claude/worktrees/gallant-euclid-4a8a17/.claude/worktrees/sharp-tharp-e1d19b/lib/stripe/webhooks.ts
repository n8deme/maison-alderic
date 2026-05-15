import { createClient as createAdminClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

function adminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { invoice_id, org_id, plan } = session.metadata ?? {};

  // Flux onboarding : activation abonnement cabinet
  if (org_id) {
    const db = adminClient();
    const { error } = await db.from("organizations").update({
      plan:                   plan || null,
      stripe_customer_id:     typeof session.customer     === "string" ? session.customer     : null,
      stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : null,
    }).eq("id", org_id);

    if (error) {
      console.error("[stripe/webhook] Échec mise à jour org subscription:", error);
      throw error;
    }
    return;
  }

  // Flux facture one-time
  if (!invoice_id) {
    console.warn("[stripe/webhook] checkout.session.completed sans invoice_id ni org_id metadata");
    return;
  }

  const { error } = await adminClient()
    .from("invoices")
    .update({
      status:  "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("id", invoice_id)
    .neq("status", "paid"); // idempotence — no-op si déjà payé

  if (error) {
    console.error("[stripe/webhook] Échec mise à jour facture paid:", error);
    throw error; // 500 → Stripe réessaie
  }
}

export async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  // Nettoyer la session expirée pour permettre la re-création propre
  await adminClient()
    .from("invoices")
    .update({
      stripe_checkout_session_id: null,
      stripe_checkout_expires_at: null,
    })
    .eq("stripe_checkout_session_id", session.id);
}

export async function handleAsyncPaymentSucceeded(session: Stripe.Checkout.Session) {
  // Même comportement que completed — cas SEPA / virement asynchrone
  await handleCheckoutCompleted(session);
}

export async function handleAsyncPaymentFailed(session: Stripe.Checkout.Session) {
  console.warn("[stripe/webhook] Paiement asynchrone échoué, session:", session.id);
  // Future Session 4 : trigger n8n pour notifier l'avocat
}
