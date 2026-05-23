import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UpgradeForm } from "./upgrade-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Choisissez votre formule | LawyerOS" },
};

export default async function UpgradePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  // Le middleware pose x-org-id sur la réponse de chaque requête vers /upgrade
  // (pas de return anticipé pour cette route — contrairement à /suspended).
  // Next.js App Router expose ces headers middleware via headers() dans les server components.
  const hdrs = await headers();
  const orgId = hdrs.get("x-org-id");

  if (!orgId) redirect("/connexion");

  // On requête le subdomain explicitement : x-org-slug (org.slug) peut différer
  // du subdomain utilisé par le middleware et attendu dans ?__tenant= par Stripe.
  const { data: org } = await supabase
    .from("organizations")
    .select("id, name, subdomain")
    .eq("id", orgId)
    .single();

  if (!org) redirect("/connexion");

  return <UpgradeForm orgId={org.id} orgName={org.name} tenant={org.subdomain} />;
}
