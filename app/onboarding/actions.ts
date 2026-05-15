"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { sendWelcomeEmail } from "@/lib/resend";
import { stripe } from "@/lib/stripe/server";

// ---------------------------------------------------------------------------
// Price IDs par plan + billing
// ---------------------------------------------------------------------------
function getPriceId(plan: string, billing: "monthly" | "yearly"): string | null {
  const map: Record<string, Record<string, string | undefined>> = {
    solo: {
      monthly: process.env.STRIPE_PRICE_SOLO_MONTHLY,
      yearly:  process.env.STRIPE_PRICE_SOLO_YEARLY,
    },
    cabinet: {
      monthly: process.env.STRIPE_PRICE_CABINET_MONTHLY,
      yearly:  process.env.STRIPE_PRICE_CABINET_YEARLY,
    },
    premium: {
      monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
      yearly:  process.env.STRIPE_PRICE_PREMIUM_YEARLY,
    },
  };
  return map[plan]?.[billing] ?? null;
}

// ---------------------------------------------------------------------------
// Stripe Checkout Session
// ---------------------------------------------------------------------------
export async function createCheckoutSession(
  orgId: string,
  plan: string,
  billing: "monthly" | "yearly",
  tenant: string
): Promise<{ url: string } | { error: "STRIPE_NOT_CONFIGURED" | string }> {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "sk_test_placeholder") {
    return { error: "STRIPE_NOT_CONFIGURED" };
  }

  const priceId = getPriceId(plan, billing);
  if (!priceId) {
    return { error: "PRICE_NOT_FOUND" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://lawyeros.vercel.app";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 14,
        metadata: { org_id: orgId, plan },
      },
      metadata: { org_id: orgId, plan },
      success_url: `${baseUrl}/onboarding/success?__tenant=${tenant}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/onboarding?__tenant=${tenant}&step=5`,
    });

    return { url: session.url! };
  } catch (err) {
    console.error("[stripe] createCheckoutSession error:", err);
    return { error: "STRIPE_ERROR" };
  }
}

// ---------------------------------------------------------------------------
// Step 1 — Infos cabinet
// ---------------------------------------------------------------------------
const step1Schema = z.object({
  org_id:      z.string().uuid(),
  address:     z.string().optional(),
  phone:       z.string().optional(),
  website_url: z.string().url().optional().or(z.literal("")),
});

export async function saveStep1(formData: FormData): Promise<{ ok: boolean; error: string }> {
  const parsed = step1Schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Données invalides" };

  const { org_id, address, phone, website_url } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("organizations")
    .update({ address, phone, website_url: website_url || null })
    .eq("id", org_id);

  if (error) { console.error("[onboarding/step1]", error); return { ok: false, error: "Erreur serveur" }; }
  return { ok: true, error: "" };
}

// ---------------------------------------------------------------------------
// Step 2 — Branding
// ---------------------------------------------------------------------------
const step2Schema = z.object({
  org_id:        z.string().uuid(),
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  accent_color:  z.string().regex(/^#[0-9a-fA-F]{6}$/),
  logo_url:      z.string().optional(),
});

export async function saveStep2(formData: FormData): Promise<{ ok: boolean; error: string }> {
  const parsed = step2Schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Données invalides" };

  const { org_id, primary_color, accent_color, logo_url } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("organizations")
    .update({ primary_color, accent_color, logo_url: logo_url || null })
    .eq("id", org_id);

  if (error) { console.error("[onboarding/step2]", error); return { ok: false, error: "Erreur serveur" }; }
  return { ok: true, error: "" };
}

// ---------------------------------------------------------------------------
// Step 3 — Invitations équipe
// ---------------------------------------------------------------------------
type Invite = { email: string; role: "avocat" | "secretaire" | "admin" };

export async function sendTeamInvites(
  orgId: string,
  invites: Invite[]
): Promise<{ ok: boolean; error: string }> {
  // Pour l'instant : log les invitations, l'email sera géré par Resend + n8n
  console.log("[onboarding/step3] Invitations à envoyer:", invites.length, "pour org", orgId);
  return { ok: true, error: "" };
}

// ---------------------------------------------------------------------------
// Step 4 — Import clients
// ---------------------------------------------------------------------------
type ClientImport = { name: string; email: string };

export async function importClients(
  orgId: string,
  clients: ClientImport[]
): Promise<{ ok: boolean; error: string }> {
  if (!clients.length) return { ok: true, error: "" };

  const service = createServiceClient();

  for (const client of clients) {
    try {
      // Créer le user Auth
      const { data: authData } = await service.auth.admin.createUser({
        email: client.email,
        email_confirm: true,
        user_metadata: { full_name: client.name, role: "client" },
      });

      if (!authData.user) continue;

      // Rattacher à l'org
      await service.from("organization_members").insert({
        organization_id: orgId,
        user_id: authData.user.id,
        role: "client",
      });
    } catch (err) {
      console.error("[onboarding/step4] Erreur import client:", client.email, err);
    }
  }

  return { ok: true, error: "" };
}

// ---------------------------------------------------------------------------
// Step 5 — Finaliser l'onboarding (trial sans CB)
// ---------------------------------------------------------------------------
export async function finalizeOnboarding(
  orgId: string,
  tenant: string
): Promise<{ ok: boolean; error: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };

  // Marquer l'org comme active en trial
  const service = createServiceClient();
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);

  const { error } = await service
    .from("organizations")
    .update({
      is_active: true,
      plan: "trial",
      trial_ends_at: trialEndsAt.toISOString(),
    })
    .eq("id", orgId);

  if (error) { console.error("[onboarding/finalize]", error); return { ok: false, error: "Erreur serveur" }; }

  // Envoyer l'email de bienvenue
  try {
    const { data: org } = await service.from("organizations").select("name").eq("id", orgId).single();
    await sendWelcomeEmail(user.email!);
  } catch (err) {
    console.error("[onboarding] Email bienvenue échoué:", err);
    // Non bloquant
  }

  return { ok: true, error: "" };
}