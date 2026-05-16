import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import PortailShell from "@/components/portail/portail-shell";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Portail client | Maison Aldéric & Associés",
    template: "%s | Maison Aldéric",
  },
};

export default async function PortailLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const [profileResult, unreadResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, company")
      .eq("id", user.id)
      .single(),
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("sender_type", "avocat")
      .is("read_at", null),
  ]);

  const profile = {
    full_name: profileResult.data?.full_name ?? null,
    company:   profileResult.data?.company   ?? null,
    email:     user.email ?? "",
  };

  return (
    <PortailShell
      profile={profile}
      unreadCount={unreadResult.count ?? 0}
      signOutAction={signOut}
    >
      {children}
      <Toaster position="bottom-right" richColors />
    </PortailShell>
  );
}