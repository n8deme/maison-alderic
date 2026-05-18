"use server";

import { DEMO_TENANT_SLUG } from "@/lib/demo/credentials";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { logAuditEvent } from "@/lib/audit/log";
import { getOrCreateStripeCustomer } from "@/lib/stripe/customers";
import { stripe } from "@/lib/stripe/server";
import { redirect } from "next/navigation";

export async function deleteOrganization(
  orgId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { data: membership } = await supabase
    .from("organization_members")
    .select("role")
    .eq("user_id", user.id)
    .eq("organization_id", orgId)
    .single();

  if (!membership || membership.role !== "owner") {
    return { error: "Seul le propriétaire peut supprimer le cabinet" };
  }

  const service = createServiceClient();
  const { data: orgRow, error: orgFetchError } = await service
    .from("organizations")
    .select("slug")
    .eq("id", orgId)
    .single();

  if (orgFetchError || !orgRow) {
    return { error: "Erreur lors de la suppression. Réessayez." };
  }
  if (orgRow.slug === DEMO_TENANT_SLUG) {
    return {
      error:
        "Cette action n'est pas disponible sur le cabinet de démonstration.",
    };
  }

  const { error: updateError } = await service
    .from("organizations")
    .update({ is_active: false, deleted_at: new Date().toISOString() })
    .eq("id", orgId);

  if (updateError) return { error: "Erreur lors de la suppression. Réessayez." };

  await logAuditEvent(orgId, user.id, "organization_deleted", "organization", orgId);
  await supabase.auth.signOut();
  redirect("/connexion?deleted=1");
}

// ---------------------------------------------------------------------------
// Stripe Customer Portal
// ---------------------------------------------------------------------------
export async function createBillingPortalSession(
  orgId: string,
): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  // Vérifier que l'user est owner ou admin de l'org
  const { data: membership } = await supabase
    .from("organization_members")
    .select("role")
    .eq("user_id", user.id)
    .eq("organization_id", orgId)
    .single();

  if (!membership || !["owner", "admin"].includes(membership.role)) {
    return { error: "Accès refusé" };
  }

  const returnUrl = process.env.NODE_ENV === "production"
    ? `https://lawyeros.vercel.app/portail-avocat/settings`
    : `http://localhost:3000/portail-avocat/settings`;

  try {
    const customerId = await getOrCreateStripeCustomer(user.id);
    const session = await stripe.billingPortal.sessions.create({
      customer:   customerId,
      return_url: returnUrl,
    });
    return { url: session.url };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Stripe";
    return { error: message };
  }
}
