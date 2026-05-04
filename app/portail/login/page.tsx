"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/portail";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"password" | "magic" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function signInWithPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading("password");
    setError(null);
    setMessage(null);

    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (err) {
      setError(err.message);
      setLoading(null);
    } else {
      // Reload pour laisser le middleware rafraîchir la session
      window.location.href = next;
    }
  }

  async function signInWithMagicLink() {
    setLoading("magic");
    setError(null);
    setMessage(null);

    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (err) {
      setError(err.message);
    } else {
      setMessage(
        "Lien envoyé. Vérifiez votre boîte mail et cliquez sur le lien reçu.",
      );
    }
    setLoading(null);
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <span
            className="inline-block text-xs tracking-widest uppercase"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Portail client
          </span>
          <h1
            className="text-3xl"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
            }}
          >
            Maison Aldéric & Associés
          </h1>
          <p
            className="text-sm"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
          >
            Connectez-vous pour accéder à vos dossiers.
          </p>
        </div>

        {/* Password form */}
        <form onSubmit={signInWithPassword} className="space-y-3">
          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-wider mb-1.5"
              style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border outline-none focus:border-[#1A1A1A] transition-colors"
              style={{
                fontFamily: "var(--font-body)",
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--text-primary)",
              }}
              placeholder="vous@exemple.be"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-wider mb-1.5"
              style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border outline-none focus:border-[#1A1A1A] transition-colors"
              style={{
                fontFamily: "var(--font-body)",
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading !== null || !email || !password}
            className="w-full py-3 text-sm transition-opacity disabled:opacity-40"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              backgroundColor: "var(--text-primary)",
              color: "var(--background)",
            }}
          >
            {loading === "password" ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
          <span
            className="text-xs uppercase tracking-wider"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            ou
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
        </div>

        {/* Magic link */}
        <button
          type="button"
          onClick={signInWithMagicLink}
          disabled={loading !== null || !email}
          className="w-full py-3 text-sm border transition-colors disabled:opacity-40"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            borderColor: "var(--border)",
            color: "var(--text-primary)",
            backgroundColor: "var(--surface)",
          }}
        >
          {loading === "magic" ? "Envoi…" : "Recevoir un lien magique"}
        </button>

        {/* Messages */}
        {message && (
          <p
            className="text-sm text-center"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
          >
            {message}
          </p>
        )}
        {error && (
          <p
            className="text-sm text-center"
            style={{ fontFamily: "var(--font-body)", color: "var(--bordeaux)" }}
          >
            {error}
          </p>
        )}
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: "var(--background)" }}
        />
      }
    >
      <LoginForm />
    </Suspense>
  );
}
