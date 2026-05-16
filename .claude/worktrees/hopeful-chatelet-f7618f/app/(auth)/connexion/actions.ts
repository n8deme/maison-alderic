"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

export type SignInState = {
  status: "idle" | "error";
  error?: string;
};

function translateError(msg: string): string {
  const map: Record<string, string> = {
    "Invalid login credentials": "Email ou mot de passe incorrect",
    "Email not confirmed": "Veuillez confirmer votre email avant de vous connecter",
    "User not found": "Aucun compte associé à cet email",
    "Invalid email or password": "Email ou mot de passe incorrect",
    "Email rate limit exceeded": "Trop de tentatives. Veuillez réessayer dans quelques minutes",
    "Password should be at least 6 characters": "Le mot de passe doit contenir au moins 6 caractères",
  };
  return map[msg] ?? msg;
}

export async function signInAction(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (!checkRateLimit(`connexion:${ip}`, 10, 60 * 60 * 1000)) {
    return { status: "error", error: "Trop de tentatives de connexion. Réessayez dans une heure." };
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { status: "error", error: translateError(error.message) };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  redirect(profile?.role === "avocat" ? "/portail-avocat" : "/portail");
}
