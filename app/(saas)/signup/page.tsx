"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signupAction, checkSubdomainAction, type SignupState } from "./actions";

const SLUG_RE = /^[a-z0-9-]+$/;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const initial: SignupState = { status: "idle" };

export default function SignupPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(signupAction, initial);

  const [fullName,    setFullName]    = useState("");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPwd,     setShowPwd]     = useState(false);
  const [cabinetName, setCabinetName] = useState("");
  const [subdomain,   setSubdomain]   = useState("");
  const [subStatus,   setSubStatus]   = useState<"idle" | "checking" | "available" | "taken">("idle");

  const checkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Suggestion automatique du sous-domaine depuis le nom du cabinet
  function handleCabinetNameChange(v: string) {
    setCabinetName(v);
    if (!subdomain) {
      setSubdomain(slugify(v));
    }
  }

  // Vérification dispo sous-domaine (debounce 500ms)
  function handleSubdomainChange(v: string) {
    const slug = slugify(v);
    setSubdomain(slug);
    setSubStatus("idle");

    if (checkTimer.current) clearTimeout(checkTimer.current);
    if (slug.length < 3) return;

    setSubStatus("checking");
    checkTimer.current = setTimeout(async () => {
      const available = await checkSubdomainAction(slug);
      setSubStatus(available ? "available" : "taken");
    }, 500);
  }

  // Après succès du server action, on connecte le user côté client
  useEffect(() => {
    console.log("[signup] state changed:", state.status, state.subdomain);
    if (state.status !== "success" || !state.email || !state.subdomain) return;
    if (!password) {
      router.push(`/onboarding?__tenant=${state.subdomain}`);
      return;
    }

    const supabase = createClient();
    supabase.auth
      .signInWithPassword({ email: state.email, password })
      .then(({ error }) => {
        if (error) console.error("[signup] sign-in error:", error.message);
        router.push(`/onboarding?__tenant=${state.subdomain}`);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const subdomainHint =
    subStatus === "checking"   ? "Vérification..." :
    subStatus === "available"  ? "Disponible" :
    subStatus === "taken"      ? "Déjà pris" : null;

  const subdomainHintColor =
    subStatus === "available"  ? "text-emerald-600" :
    subStatus === "taken"      ? "text-red-600" :
    "text-text-muted";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Header */}
      <div className="w-full max-w-md mb-10 text-center">
        <Link href="/lawyeros" className="inline-block mb-8">
          <span className="text-2xl font-heading font-medium" style={{ color: "var(--foreground)" }}>
            Lawyer<span style={{ color: "var(--accent)" }}>OS</span>
          </span>
        </Link>
        <h1
          className="text-3xl font-heading font-medium tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          Créez votre cabinet en ligne
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          14 jours d&apos;essai gratuit — aucune carte bancaire requise.
        </p>
      </div>

      {/* Carte formulaire */}
      <div
        className="w-full max-w-md rounded-sm border shadow-sm px-8 py-10 space-y-6"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
        }}
      >
        {/* Erreur globale */}
        {state.status === "error" && state.errors?._ && (
          <div
            className="rounded-sm p-4 text-sm border"
            style={{
              backgroundColor: "#fef2f2",
              borderColor: "#fecaca",
              color: "#991b1b",
            }}
          >
            {state.errors._}
          </div>
        )}

        <form action={formAction} className="space-y-5">
          {/* Nom complet */}
          <Field
            id="full_name"
            label="Votre nom complet"
            type="text"
            name="full_name"
            autoComplete="name"
            placeholder="Marie Dupont"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={state.errors?.full_name}
            required
          />

          {/* Email */}
          <Field
            id="email"
            label="Email professionnel"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="marie@cabinet-dupont.be"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={state.errors?.email}
            required
          />

          {/* Mot de passe */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                placeholder="8 caractères minimum"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-sm border px-3.5 py-2.5 text-sm pr-10 outline-none transition-colors"
                style={{
                  borderColor: state.errors?.password ? "#ef4444" : "var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--foreground)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--foreground)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = state.errors?.password
                    ? "#ef4444"
                    : "var(--border)")
                }
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: "var(--text-muted)" }}
                tabIndex={-1}
              >
                {showPwd ? "Masquer" : "Voir"}
              </button>
            </div>
            {state.errors?.password && (
              <p className="text-xs text-red-600">{state.errors.password}</p>
            )}
          </div>

          {/* Séparateur visuel */}
          <div
            className="border-t pt-5"
            style={{ borderColor: "var(--border-subtle)" }}
          />

          {/* Nom du cabinet */}
          <Field
            id="cabinet_name"
            label="Nom du cabinet"
            type="text"
            name="cabinet_name"
            autoComplete="organization"
            placeholder="Cabinet Dupont & Associés"
            value={cabinetName}
            onChange={(e) => handleCabinetNameChange(e.target.value)}
            error={state.errors?.cabinet_name}
            required
          />

          {/* Sous-domaine */}
          <div className="space-y-1.5">
            <label
              htmlFor="subdomain"
              className="block text-sm font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Sous-domaine de votre portail
            </label>
            <div className="flex items-stretch">
              <input
                id="subdomain"
                name="subdomain"
                type="text"
                placeholder="cabinet-dupont"
                value={subdomain}
                onChange={(e) => handleSubdomainChange(e.target.value)}
                required
                className="flex-1 rounded-sm rounded-r-none border-r-0 border px-3.5 py-2.5 text-sm outline-none transition-colors font-mono"
                style={{
                  borderColor:
                    subStatus === "taken" || state.errors?.subdomain
                      ? "#ef4444"
                      : subStatus === "available"
                      ? "#10b981"
                      : "var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--foreground)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--foreground)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor =
                    subStatus === "taken" || state.errors?.subdomain
                      ? "#ef4444"
                      : subStatus === "available"
                      ? "#10b981"
                      : "var(--border)")
                }
              />
              <span
                className="flex items-center rounded-sm rounded-l-none border px-3 text-xs whitespace-nowrap select-none"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                .lawyeros.app
              </span>
            </div>

            <div className="flex items-center justify-between">
              {state.errors?.subdomain ? (
                <p className="text-xs text-red-600">{state.errors.subdomain}</p>
              ) : subdomainHint ? (
                <p className={`text-xs ${subdomainHintColor}`}>{subdomainHint}</p>
              ) : (
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Uniquement lettres, chiffres et tirets
                </p>
              )}
            </div>
          </div>

          {/* CTA */}
          <button
            type="submit"
            disabled={isPending || subStatus === "taken"}
            className="w-full py-3 px-4 rounded-sm text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            style={{
              backgroundColor: "var(--accent)",
              color: "#ffffff",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor =
                "var(--bordeaux-hover)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor =
                "var(--accent)")
            }
          >
            {isPending
              ? "Création en cours..."
              : "Créer mon compte gratuit — 14 jours sans CB"}
          </button>
        </form>
      </div>

      {/* Lien connexion */}
      <p className="mt-8 text-sm" style={{ color: "var(--text-secondary)" }}>
        Déjà un compte ?{" "}
        <Link
          href="/connexion"
          className="font-medium hover:underline"
          style={{ color: "var(--foreground)" }}
        >
          Se connecter
        </Link>
      </p>

      {/* RGPD */}
      <p
        className="mt-4 text-xs text-center max-w-sm"
        style={{ color: "var(--text-muted)" }}
      >
        En créant votre compte, vous acceptez nos{" "}
        <Link href="/mentions-legales" className="underline">
          conditions d&apos;utilisation
        </Link>{" "}
        et notre{" "}
        <Link href="/confidentialite" className="underline">
          politique de confidentialité
        </Link>
        .
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Composant champ réutilisable (scope local)
// ---------------------------------------------------------------------------
function Field({
  id,
  label,
  error,
  ...props
}: {
  id: string;
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium"
        style={{ color: "var(--foreground)" }}
      >
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full rounded-sm border px-3.5 py-2.5 text-sm outline-none transition-colors"
        style={{
          borderColor: error ? "#ef4444" : "var(--border)",
          backgroundColor: "var(--surface)",
          color: "var(--foreground)",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--foreground)")}
        onBlur={(e) =>
          (e.target.style.borderColor = error ? "#ef4444" : "var(--border)")
        }
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
