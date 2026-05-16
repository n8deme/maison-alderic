"use client";

import { Suspense, useState, useActionState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/brand/logo";
import { signInAction, type SignInState } from "./actions";

const initial: SignInState = { status: "idle" };

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicMessage, setMagicMessage] = useState<string | null>(null);
  const [magicError, setMagicError] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState(signInAction, initial);

  async function signInWithMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMagicLoading(true);
    setMagicError(null);
    setMagicMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });

      if (error) {
        setMagicError(error.message);
      } else {
        setMagicMessage("Un lien de connexion a été envoyé à votre adresse email");
      }
    } catch {
      setMagicError("Une erreur inattendue s'est produite");
    } finally {
      setMagicLoading(false);
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
          {state.status === "error" && state.error && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-800">{state.error}</p>
            </div>
          )}

          {magicMessage && (
            <div className="mb-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-800">{magicMessage}</p>
            </div>
          )}

          {magicError && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-800">{magicError}</p>
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
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
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
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
              disabled={isPending}
              className="w-full py-3 px-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? "Connexion..." : "Se connecter"}
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
              disabled={magicLoading}
              className="w-full py-3 px-4 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {magicLoading ? "Envoi en cours..." : "Recevoir un lien de connexion"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-600">
          Besoin d&apos;aide ?{" "}
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
