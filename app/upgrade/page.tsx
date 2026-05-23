import { cookies } from "next/headers";
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

  const cookieStore = await cookies();
  const tenant = cookieStore.get("x-tenant-slug")?.value;

  if (!tenant) redirect("/connexion");

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("subdomain", tenant)
    .single();

  if (!org) redirect("/connexion");

  return <UpgradeForm orgId={org.id} orgName={org.name} tenant={tenant} />;
}
