import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "Tableau de bord | Portail client",
};

export default async function PortailDashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Le middleware a déjà redirigé vers /portail/login si pas de user.
  // Cette guard est défensive.
  if (!user) {
    return null;
  }

  // Profile pour le full_name
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, company")
    .eq("id", user.id)
    .single();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="max-w-2xl w-full space-y-6">
        <span
          className="inline-block text-xs font-medium tracking-widest uppercase px-3 py-1 border"
          style={{
            color: "var(--text-muted)",
            borderColor: "var(--border)",
            fontFamily: "var(--font-body)",
          }}
        >
          Portail client
        </span>

        <h1
          className="text-4xl md:text-5xl"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
          }}
        >
          Tableau de bord
        </h1>

        <div
          className="border p-6 space-y-2"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
            fontFamily: "var(--font-body)",
          }}
        >
          <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Connecté en tant que
          </p>
          <p className="text-lg" style={{ color: "var(--text-primary)" }}>
            {profile?.full_name ?? user.email}
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {user.email}
            {profile?.company && <> · {profile.company}</>}
            {profile?.role && (
              <> · <span className="uppercase tracking-wider text-xs">{profile.role}</span></>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--bordeaux)" }} />
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--text-secondary)",
              fontSize: "0.9375rem",
            }}
          >
            Page en construction — Session 3 (UI portail complet)
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {[
            { href: "/portail/dossiers", label: "Mes dossiers" },
            { href: "/portail/documents", label: "Documents" },
            { href: "/portail/messages", label: "Messages" },
            { href: "/portail/facturation", label: "Facturation" },
            { href: "/portail/rdv", label: "Rendez-vous" },
            { href: "/portail/profil", label: "Mon profil" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs px-3 py-1.5 border transition-colors hover:bg-[var(--surface-alt)]"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--text-secondary)",
                borderColor: "var(--border)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <form action={signOut} className="pt-6">
          <button
            type="submit"
            className="text-sm transition-colors"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--bordeaux)",
            }}
          >
            ← Se déconnecter
          </button>
        </form>
      </div>
    </main>
  );
}
