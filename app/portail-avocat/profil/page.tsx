import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Mon profil" };

const ROLE_LABELS: Record<string, string> = {
  client: "Client",
  avocat: "Avocat",
  admin: "Administrateur",
};

export default async function AvocatProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone, role")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="max-w-3xl p-6 md:p-8">
      <h1 className="text-3xl" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>Mon profil</h1>
      <div className="mt-6 rounded-sm border border-border bg-surface p-5">
        <p className="text-xs text-text-muted">Nom</p>
        <p className="text-sm text-foreground">{profile?.full_name ?? "-"}</p>
        <p className="mt-3 text-xs text-text-muted">Email</p>
        <p className="text-sm text-foreground">{user.email ?? profile?.email ?? "-"}</p>
        <p className="mt-3 text-xs text-text-muted">Téléphone</p>
        <p className="text-sm text-foreground">{profile?.phone ?? "-"}</p>
        <p className="mt-3 text-xs text-text-muted">Rôle</p>
        <p className="text-sm text-foreground">
          {profile?.role ? ROLE_LABELS[profile.role] ?? `${profile.role.charAt(0).toUpperCase()}${profile.role.slice(1)}` : "Avocat"}
        </p>
      </div>
    </div>
  );
}
