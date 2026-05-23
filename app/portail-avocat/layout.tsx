import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import PortailAvocatShell from "@/components/portail/portail-avocat-shell";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Portail avocat",
    template: "%s | LawyerOS",
  },
};

export default async function PortailAvocatLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const hdrs = await headers();
  const orgLogo = hdrs.get("x-org-logo") || null;
  const orgName = decodeURIComponent(hdrs.get("x-org-name") || "");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "avocat") redirect("/portail");

  return (
    <PortailAvocatShell
      profile={{ full_name: profile?.full_name ?? null, email: user.email ?? "" }}
      signOutAction={signOut}
      orgLogo={orgLogo}
      orgName={orgName}
    >
      {children}
      <Toaster position="bottom-right" richColors />
    </PortailAvocatShell>
  );
}
