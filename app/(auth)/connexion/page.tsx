"use client";

import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"password" | "magic" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function translateError(errorMessage: string): string {
    const translations: Record<string, string> = {
      "Invalid login credentials":                "Email ou mot de passe incorrect",
      "Email not confirmed":                      "Veuillez confirmer votre email avant de vous connecter",
      "User not found":                           "Aucun compte associé à cet email",
      "Invalid email or password":               "Email ou mot de passe incorrect",
      "Email rate limit exceeded":               "Trop de tentatives. Veuillez réessayer dans quelques minutes",
      "Password should be at least 6 characters": "Le mot de passe doit contenir au moins 6 caractères",
    };
    return translations[errorMessage] || errorMessage;
  }

  async function signInWithPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading("password");
    setError(null);
    setMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError(translateError(error.message));
        setLoading(null);
        return;
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .maybeSingle();

        window.location.href = profile?.role === "avocat" ? "/portail-avocat" : "/portail";
      }
    } catch {
      setError("Une erreur inattendue s'est produite");
      setLoading(null);
    }
  }

  async function signInWithMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading("magic");
    setError(null);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });

      if (error) {
        setError(translateError(error.message));
        setLoading(null);
        return;
      }

      setMessage("Un lien de connexion a été envoyé à votre adresse email");
      setLoading(null);
    } catch {
      setError("Une erreur inattendue s'est produite");
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--background)" }}>
      <header
        className="border-b px-6 py-4"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <span
          className="text-lg font-heading font-medium tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          Lawyer<span style={{ color: "var(--accent)" }}>OS</span>
        </span>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h1
              className="text-2xl font-heading font-medium tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              Connexion
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Accédez à votre espace client
            </p>
          </div>

          {error && (
            <div
              className="rounded-sm border p-4 text-sm"
              style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca", color: "#991b1b" }}
            >
              {error}
            </div>
          )}

          {message && (
            <div
              className="rounded-sm border p-4 text-sm"
              style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe", color: "#1e40af" }}
            >
              {message}
            </div>
          )}

          <div
            className="rounded-sm border p-6 space-y-5"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <form onSubmit={signInWithPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm text-sm outline-none transition-colors"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  placeholder="votre@email.com"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm text-sm outline-none transition-colors"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading === "password"}
                className="w-full py-2.5 px-4 rounded-sm text-sm font-medium transition-colors disabled:opacity-60"
                style={{ backgroundColor: "var(--foreground)", color: "#ffffff" }}
              >
                {loading === "password" ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: "var(--border)" }} />
              </div>
              <div className="relative flex justify-center text-xs">
                <span
                  className="px-2"
                  style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)" }}
                >
                  ou
                </span>
              </div>
            </div>

            <form onSubmit={signInWithMagicLink}>
              <button
                type="submit"
                disabled={loading === "magic"}
                className="w-full py-2.5 px-4 rounded-sm text-sm font-medium border transition-colors disabled:opacity-60"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-secondary)",
                  backgroundColor: "transparent",
                }}
              >
                {loading === "magic" ? "Envoi en cours..." : "Recevoir un lien de connexion"}
              </button>
            </form>
          </div>

          <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
            Besoin d&apos;aide ?{" "}
            <a
              href="mailto:support@lawyeros.app"
              className="underline underline-offset-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Contactez le support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: "var(--background)" }}
        >
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Chargement...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
