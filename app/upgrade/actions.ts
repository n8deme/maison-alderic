"use server";

import { stripe } from "@/lib/stripe/server";

function getPriceId(plan: string, billing: "monthly" | "yearly"): string | null {
  const map: Record<string, Record<string, string | undefined>> = {
    solo:    { monthly: process.env.STRIPE_PRICE_SOLO_MONTHLY,    yearly: process.env.STRIPE_PRICE_SOLO_YEARLY },
    cabinet: { monthly: process.env.STRIPE_PRICE_CABINET_MONTHLY, yearly: process.env.STRIPE_PRICE_CABINET_YEARLY },
    premium: { monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY, yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY },
  };
  return map[plan]?.[billing] ?? null;
}

export async function createUpgradeCheckoutSession(
  orgId: string,
  plan: string,
  billing: "monthly" | "yearly",
  tenant: string
): Promise<{ url: string } | { error: "STRIPE_NOT_CONFIGURED" | string }> {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "sk_test_placeholder") {
    return { error: "STRIPE_NOT_CONFIGURED" };
  }

  const priceId = getPriceId(plan, billing);
  if (!priceId) return { error: "PRICE_NOT_FOUND" };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://lawyeros.vercel.app";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: { org_id: orgId, plan },
      },
      metadata: { org_id: orgId, plan },
      success_url: `${baseUrl}/portail-avocat?__tenant=${tenant}`,
      cancel_url:  `${baseUrl}/upgrade?__tenant=${tenant}`,
    });
    return { url: session.url! };
  } catch (err) {
    console.error("[stripe] createUpgradeCheckoutSession error:", err);
    return { error: "STRIPE_ERROR" };
  }
}
