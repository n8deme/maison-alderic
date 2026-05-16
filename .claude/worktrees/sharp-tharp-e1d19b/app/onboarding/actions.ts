"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { sendWelcomeEmail } from "@/lib/resend";
import { stripe } from "@/lib/stripe/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type CheckoutResult = { ok: true; url: string } | { ok: false; error: string };

export type OnboardingData = {
  step1?: {
    address:     string;
    phone:       string;
    website_url: string;
  };
  step2?: {
    primary_color: string;
    accent_color:  string;
    logo_url:      string;
  };
  step3?: Array<{ email: string; role: string }>;
  step4?: Array<{ name: string; email: string; reference?: string }>;
};

export type ActionResult = { ok: true } | { ok: false; error: string };

// ---------------------------------------------------------------------------
// Étape 1 : Infos cabinet
// ---------------------------------------------------------------------------
const step1Schema = z.object({
  address:     z.string().optional(),
  phone:       z.string().optional(),
  website_url: z.string().url("URL invalide").optional().or(z.literal("")),
  org_id:      z.string().uuid(),
});

export async function saveStep1(formData: FormData): Promise<ActionResult> {
  const parsed = step1Schema.safeParse({
    address:     formData.get("address")     || "",
    phone:       formData.get("phone")       || "",
    website_url: formData.get("website_url") || "",
    org_id:      formData.get("org_id"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };

  const service = createServiceClient();
  const { error } = await service
    .from("organizations")
    .update({
      address:     parsed.data.address     || null,
      phone:       parsed.data.phone       || null,
      website_url: parsed.data.website_url || null,
    })
    .eq("id", parsed.data.org_id);

  if (error) return { ok: false, error: "Erreur lors de la sauvegarde" };
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Étape 2 : Branding
// ---------------------------------------------------------------------------
const step2Schema = z.object({
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Couleur invalide"),
  accent_color:  z.string().regex(/^#[0-9a-fA-F]{6}$/, "Couleur invalide"),
  logo_url:      z.string().optional(),
  org_id:        z.string().uuid(),
});

export async function saveStep2(formData: FormData): Promise<ActionResult> {
  const parsed = step2Schema.safeParse({
    primary_color: formData.get("primary_color") || "#1A1A1A",
    accent_color:  formData.get("accent_color")  || "#7A1F2B",
    logo_url:      formData.get("logo_url")       || "",
    org_id:        formData.get("org_id"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };

  const service = createServiceClient();
  const { error } = await service
    .from("organizations")
    .update({
      primary_color: parsed.data.primary_color,
      accent_color:  parsed.data.accent_color,
      logo_url:      parsed.data.logo_url || null,
    })
    .eq("id", parsed.data.org_id);

  if (error) return { ok: false, error: "Erreur lors de la sauvegarde" };
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Étape 3 : Invitations équipe
// ---------------------------------------------------------------------------
const inviteSchema = z.array(
  z.object({
    email: z.string().email(),
    role:  z.enum(["avocat", "secretaire", "admin"]),
  })
).max(10);

export async function sendTeamInvites(
  orgId: string,
  invites: Array<{ email: string; role: string }>
): Promise<ActionResult> {
  const parsed = inviteSchema.safeParse(invites);
  if (!parsed.success) {
    return { ok: false, error: "Invitations invalides" };
  }
  if (parsed.data.length === 0) return { ok: true };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };

  const service = createServiceClient();

  // Invite les collaborateurs via Supabase Auth (crée le compte + envoie l'email d'invitation)
  const results = await Promise.allSettled(
    parsed.data.map(async ({ email, role }) => {
      const { data: invited, error: authErr } = await service.auth.admin.inviteUserByEmail(
        email,
        {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
          data: { invited_by: user.id, org_id: orgId, role },
        }
      );
      if (authErr || !invited.user) throw new Error(authErr?.message);

      await service.from("organization_members").insert({
        organization_id: orgId,
        user_id:         invited.user.id,
        role,
        invited_by:      user.id,
      });
    })
  );

  const failed = results.filter((r) => r.status === "rejected").length;
  if (failed === results.length) {
    return { ok: false, error: "Toutes les invitations ont échoué" };
  }

  return { ok: true };
}

// ---------------------------------------------------------------------------
// Étape 4 : Import clients
// ---------------------------------------------------------------------------
const clientSchema = z.array(
  z.object({
    name:      z.string().min(2),
    email:     z.string().email(),
    reference: z.string().optional(),
  })
).max(50);

export async function importClients(
  orgId: string,
  clients: Array<{ name: string; email: string; reference?: string }>
): Promise<ActionResult> {
  const parsed = clientSchema.safeParse(clients);
  if (!parsed.success) {
    return { ok: false, error: "Données clients invalides" };
  }
  if (parsed.data.length === 0) return { ok: true };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };

  const service = createServiceClient();

  await Promise.allSettled(
    parsed.data.map(async ({ name, email }) => {
      // Créer un user Auth pour le client
      const { data: clientUser } = await service.auth.admin.createUser({
        email,
        email_confirm: false,
        user_metadata: { full_name: name, org_id: orgId, role: "client" },
      });
      if (!clientUser.user) return;

      // Profil client
      await service.from("profiles").upsert({
        id:         clientUser.user.id,
        full_name:  name,
        email,
        role:       "client",
      });

      // Membership
      await service.from("organization_members").insert({
        organization_id: orgId,
        user_id:         clientUser.user.id,
        role:            "client",
        invited_by:      user.id,
      });
    })
  );

  return { ok: true };
}

// ---------------------------------------------------------------------------
// Étape 5 : Stripe Checkout
// ---------------------------------------------------------------------------
const PRICE_IDS: Record<string, Partial<Record<"monthly" | "yearly", string>>> = {
  solo:    { monthly: process.env.STRIPE_PRICE_SOLO_MONTHLY,    yearly: process.env.STRIPE_PRICE_SOLO_YEARLY },
  cabinet: { monthly: process.env.STRIPE_PRICE_CABINET_MONTHLY, yearly: process.env.STRIPE_PRICE_CABINET_YEARLY },
  premium: { monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY, yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY },
};

export async function createCheckoutSession(
  orgId: string,
  planId: string,
  billing: "monthly" | "yearly",
  tenant: string,
): Promise<CheckoutResult> {
  if (!process.env.STRIPE_SECRET_KEY) {
    return { ok: false, error: "STRIPE_NOT_CONFIGURED" };
  }

  const priceId = PRICE_IDS[planId]?.[billing];
  if (!priceId) {
    return { ok: false, error: "Plan ou cycle de facturation invalide" };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 14,
        metadata: { org_id: orgId, plan: planId },
      },
      success_url: `${appUrl}/onboarding/success?__tenant=${tenant}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${appUrl}/onboarding?__tenant=${tenant}&step=5`,
      metadata: { org_id: orgId, plan: planId },
    });

    if (!session.url) return { ok: false, error: "URL de paiement indisponible" };
    return { ok: true, url: session.url };
  } catch (e) {
    console.error("[stripe] createCheckoutSession error:", e);
    return { ok: false, error: "Erreur lors de la création de la session de paiement" };
  }
}

// ---------------------------------------------------------------------------
// Finaliser l'onboarding → email de bienvenue + succès
// ---------------------------------------------------------------------------
export async function finalizeOnboarding(
  orgId: string,
  subdomain: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };

  // Récupérer les infos org pour l'email
  const service = createServiceClient();
  const { data: org } = await service
    .from("organizations")
    .select("name, contact_email")
    .eq("id", orgId)
    .single();

  if (!org) return { ok: false, error: "Organisation introuvable" };

  // Email de bienvenue
  try {
    await sendWelcomeEmail({
      to:          org.contact_email || user.email!,
      cabinetName: org.name,
      subdomain,
      ownerName:   user.user_metadata?.full_name || "Cher utilisateur",
    });
  } catch (e) {
    // Non-bloquant : l'onboarding continue même si l'email échoue
    console.error("[onboarding] email bienvenue failed:", e);
  }

  return { ok: true };
}
