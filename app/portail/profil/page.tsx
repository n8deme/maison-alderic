import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { User, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProfile, updatePassword } from "./actions";

export const metadata: Metadata = { title: "Mon profil" };

const PWD_ERRORS: Record<string, string> = {
  short:    "Le mot de passe doit contenir au moins 8 caractères.",
  mismatch: "Les mots de passe ne correspondent pas.",
  server:   "Erreur lors du changement de mot de passe. Réessayez.",
};

export default async function ProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string; error?: string; pwd_updated?: string; pwd_error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, company, phone, role")
    .eq("id", user.id)
    .single();

  const isUpdated    = params.updated    === "1";
  const isPwdUpdated = params.pwd_updated === "1";
  const pwdError     = params.pwd_error ? (PWD_ERRORS[params.pwd_error] ?? "Erreur inconnue.") : null;
  const profileError = params.error === "validation" ? "Données invalides." : params.error === "save" ? "Erreur de sauvegarde." : null;

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-medium"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          Mon profil
        </h1>
        <p className="mt-1 text-sm text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
          Gérez vos informations personnelles.
        </p>
      </div>

      {/* Profile form */}
      <div className="bg-surface border border-border rounded-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4 h-4" style={{ color: "var(--bordeaux)" }} />
          <h2 className="text-xs font-medium uppercase tracking-wider text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
            Informations personnelles
          </h2>
        </div>

        {isUpdated && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-sm" style={{ backgroundColor: "rgba(22,163,74,0.08)" }}>
            <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#16a34a" }} />
            <p className="text-xs" style={{ color: "#16a34a", fontFamily: "var(--font-body)" }}>
              Profil mis à jour avec succès.
            </p>
          </div>
        )}

        {profileError && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-sm" style={{ backgroundColor: "rgba(122,31,43,0.08)" }}>
            <AlertCircle className="w-4 h-4 shrink-0" style={{ color: "var(--bordeaux)" }} />
            <p className="text-xs" style={{ color: "var(--bordeaux)", fontFamily: "var(--font-body)" }}>
              {profileError}
            </p>
          </div>
        )}

        <form action={updateProfile} className="space-y-4">
          {/* Email (read-only) */}
          <div>
            <label className="block text-[10px] text-text-muted uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-body)" }}>
              Adresse e-mail
            </label>
            <input
              type="email"
              value={user.email ?? ""}
              readOnly
              className="w-full text-sm border border-border rounded-sm px-3 py-2 bg-surface-alt text-text-muted cursor-not-allowed"
              style={{ fontFamily: "var(--font-body)" }}
            />
            <p className="text-[10px] text-text-muted mt-1" style={{ fontFamily: "var(--font-body)" }}>
              L&apos;e-mail ne peut pas être modifié ici.
            </p>
          </div>

          <div>
            <label className="block text-[10px] text-text-muted uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-body)" }}>
              Nom complet <span style={{ color: "var(--bordeaux)" }}>*</span>
            </label>
            <input
              name="full_name"
              type="text"
              defaultValue={profile?.full_name ?? ""}
              required
              minLength={2}
              className="w-full text-sm border border-border rounded-sm px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-[color:var(--bordeaux)]"
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>

          <div>
            <label className="block text-[10px] text-text-muted uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-body)" }}>
              Société
            </label>
            <input
              name="company"
              type="text"
              defaultValue={profile?.company ?? ""}
              className="w-full text-sm border border-border rounded-sm px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-[color:var(--bordeaux)]"
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>

          <div>
            <label className="block text-[10px] text-text-muted uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-body)" }}>
              Téléphone
            </label>
            <input
              name="phone"
              type="tel"
              defaultValue={profile?.phone ?? ""}
              className="w-full text-sm border border-border rounded-sm px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-[color:var(--bordeaux)]"
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>

          {profile?.role && (
            <div>
              <label className="block text-[10px] text-text-muted uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-body)" }}>
                Rôle
              </label>
              <p className="text-sm text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                {profile.role === "client" ? "Client" : profile.role === "avocat" ? "Avocat" : profile.role}
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium rounded-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--foreground)", color: "var(--background)", fontFamily: "var(--font-body)" }}
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>

      {/* Password form */}
      <div className="bg-surface border border-border rounded-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <Lock className="w-4 h-4" style={{ color: "var(--bordeaux)" }} />
          <h2 className="text-xs font-medium uppercase tracking-wider text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
            Changer le mot de passe
          </h2>
        </div>

        {isPwdUpdated && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-sm" style={{ backgroundColor: "rgba(22,163,74,0.08)" }}>
            <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#16a34a" }} />
            <p className="text-xs" style={{ color: "#16a34a", fontFamily: "var(--font-body)" }}>
              Mot de passe mis à jour.
            </p>
          </div>
        )}

        {pwdError && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-sm" style={{ backgroundColor: "rgba(122,31,43,0.08)" }}>
            <AlertCircle className="w-4 h-4 shrink-0" style={{ color: "var(--bordeaux)" }} />
            <p className="text-xs" style={{ color: "var(--bordeaux)", fontFamily: "var(--font-body)" }}>
              {pwdError}
            </p>
          </div>
        )}

        <form action={updatePassword} className="space-y-4">
          <div>
            <label className="block text-[10px] text-text-muted uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-body)" }}>
              Nouveau mot de passe
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="8 caractères minimum"
              className="w-full text-sm border border-border rounded-sm px-3 py-2 bg-background placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-[color:var(--bordeaux)]"
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>

          <div>
            <label className="block text-[10px] text-text-muted uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-body)" }}>
              Confirmer le mot de passe
            </label>
            <input
              name="confirm"
              type="password"
              required
              minLength={8}
              className="w-full text-sm border border-border rounded-sm px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-[color:var(--bordeaux)]"
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium rounded-sm border transition-colors hover:bg-surface-alt"
              style={{ borderColor: "var(--border)", color: "var(--foreground)", fontFamily: "var(--font-body)" }}
            >
              Changer le mot de passe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
