import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import PortailAvocatShell from "@/components/portail/portail-avocat-shell";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Portail avocat",
    template: "%s — Maison Aldéric & Associés",
  },
};

export default async function PortailAvocatLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

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
    >
      {children}
      <Toaster position="bottom-right" richColors />
    </PortailAvocatShell>
  );
}
