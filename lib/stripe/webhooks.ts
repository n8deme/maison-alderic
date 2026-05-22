import { createClient as createAdminClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

function adminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Paiement de factures (mode "payment") — NE PAS MODIFIER
// ─────────────────────────────────────────────────────────────────────────────

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const invoiceId = session.metadata?.invoice_id;
  if (!invoiceId) {
    console.warn("[stripe/webhook] checkout.session.completed sans invoice_id metadata");
    return;
  }

  const { error } = await adminClient()
    .from("invoices")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("id", invoiceId)
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

// ─────────────────────────────────────────────────────────────────────────────
// Abonnement SaaS (mode "subscription")
// Source de vérité : Stripe — l'état org est toujours écrasé sans condition
// ─────────────────────────────────────────────────────────────────────────────

function toPlanInterval(interval: string): "monthly" | "yearly" {
  return interval === "year" ? "yearly" : "monthly";
}

function isActiveFromStatus(status: Stripe.Subscription.Status): boolean {
  // past_due = période de grâce, Stripe réessaie — org reste active
  return ["trialing", "active", "past_due"].includes(status);
}

async function upsertSubscriptionState(subscription: Stripe.Subscription): Promise<void> {
  const orgId = subscription.metadata?.org_id;
  if (!orgId) {
    console.warn(`[stripe/webhook] subscription sans org_id metadata: ${subscription.id}`);
    return;
  }

  const plan = subscription.metadata?.plan ?? "solo";
  const interval = toPlanInterval(
    subscription.items.data[0]?.price?.recurring?.interval ?? "month",
  );
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const { error } = await adminClient()
    .from("organizations")
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      plan,
      plan_interval: interval,
      is_active: isActiveFromStatus(subscription.status),
      trial_ends_at: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
    })
    .eq("id", orgId);

  if (error) {
    console.error("[stripe/webhook] Échec mise à jour org:", error);
    throw error;
  }
}

export async function handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
  await upsertSubscriptionState(subscription);
}

export async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  await upsertSubscriptionState(subscription);
}

export async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const orgId = subscription.metadata?.org_id;
  if (!orgId) {
    console.warn(`[stripe/webhook] customer.subscription.deleted sans org_id metadata: ${subscription.id}`);
    return;
  }

  const { error } = await adminClient()
    .from("organizations")
    .update({ is_active: false })
    .eq("id", orgId);

  if (error) {
    console.error("[stripe/webhook] Échec mise à jour org (subscription.deleted):", error);
    throw error;
  }
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  // Log uniquement — pas de colonne dédiée dans le schéma actuel
  // Future Session 4 : trigger n8n pour notifier l'équipe
  console.warn("[stripe/webhook] invoice.payment_failed, invoice:", invoice.id);
}
