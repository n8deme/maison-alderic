"use client";

import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/logo";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"password" | "magic" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fonction pour traduire les erreurs Supabase en français
  function translateError(errorMessage: string): string {
    const translations: Record<string, string> = {
      "Invalid login credentials": "Email ou mot de passe incorrect",
      "Email not confirmed": "Veuillez confirmer votre email avant de vous connecter",
      "User not found": "Aucun compte associé à cet email",
      "Invalid email or password": "Email ou mot de passe incorrect",
      "Email rate limit exceeded": "Trop de tentatives. Veuillez réessayer dans quelques minutes",
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

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

        const targetUrl = profile?.role === "avocat" ? "/portail-avocat" : "/portail";
        window.location.href = targetUrl;
      }
    } catch (err) {
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
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(translateError(error.message));
        setLoading(null);
        return;
      }

      setMessage("Un lien de connexion a été envoyé à votre adresse email");
      setLoading(null);
    } catch (err) {
      setError("Une erreur inattendue s'est produite");
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Logo variant="wordmark" className="h-14 w-auto mx-auto mb-10" />
          <h1 className="text-3xl font-serif font-semibold text-slate-900">
            Espace Client
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Connectez-vous pour accéder à vos dossiers
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {message && (
            <div className="mb-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-800">{message}</p>
            </div>
          )}

          <form onSubmit={signInWithPassword} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
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
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
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
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading === "password"}
              className="w-full py-3 px-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading === "password" ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Ou</span>
            </div>
          </div>

          <form onSubmit={signInWithMagicLink} className="mt-6">
            <button
              type="submit"
              disabled={loading === "magic"}
              className="w-full py-3 px-4 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading === "magic"
                ? "Envoi en cours..."
                : "Recevoir un lien de connexion"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-600">
          Besoin d'aide ?{" "}
          <a href="/contact" className="text-slate-900 hover:underline">
            Contactez-nous
          </a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>Chargement...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}