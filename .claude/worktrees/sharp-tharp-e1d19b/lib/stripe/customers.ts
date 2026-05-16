import { createClient as createAdminClient } from "@supabase/supabase-js";
import { stripe } from "./server";

/**
 * Récupère le stripe_customer_id pour un profile, ou en crée un (lazy).
 * Utilise le service role pour bypass RLS sur l'update profiles.
 */
export async function getOrCreateStripeCustomer(profileId: string): Promise<string> {
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: profile, error } = await admin
    .from("profiles")
    .select("id, email, full_name, company, stripe_customer_id")
    .eq("id", profileId)
    .single();

  if (error || !profile) throw new Error("Profile introuvable");

  if (profile.stripe_customer_id) {
    return profile.stripe_customer_id as string;
  }

  if (!profile.email || !String(profile.email).includes("@")) {
    throw new Error("Email client invalide");
  }

  const customer = await stripe.customers.create({
    email: String(profile.email),
    name: profile.full_name || undefined,
    metadata: {
      profile_id: profile.id,
      company: profile.company || "",
    },
  });

  const { error: updateError } = await admin
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", profileId);

  if (updateError) {
    console.error("[stripe] Failed to save stripe_customer_id:", updateError);
  }

  return customer.id;
}
