"use server";

import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";

const RESERVED_SUBDOMAINS = new Set([
  "www", "app", "admin", "demo", "api", "mail", "cdn",
  "lawyeros", "support", "help", "billing", "status",
]);

const signupSchema = z.object({
  full_name:    z.string().min(2, "Minimum 2 caractères"),
  email:        z.string().email("Email invalide"),
  password:     z.string().min(8, "Minimum 8 caractères"),
  cabinet_name: z.string().min(2, "Minimum 2 caractères"),
  subdomain:    z
    .string()
    .min(3, "Minimum 3 caractères")
    .max(30, "Maximum 30 caractères")
    .regex(/^[a-z0-9-]+$/, "Lettres minuscules, chiffres et tirets uniquement")
    .refine((v) => !v.startsWith("-") && !v.endsWith("-"), "Ne peut pas commencer ou finir par un tiret")
    .refine((v) => !RESERVED_SUBDOMAINS.has(v), "Ce sous-domaine est réservé"),
});

export type SignupState = {
  status: "idle" | "success" | "error";
  errors?: Partial<Record<keyof z.infer<typeof signupSchema> | "_", string>>;
  subdomain?: string;
  email?: string;
};

export async function signupAction(
  _prev: SignupState,
  formData: FormData
): Promise<SignupState> {
  const raw = {
    full_name:    formData.get("full_name"),
    email:        formData.get("email"),
    password:     formData.get("password"),
    cabinet_name: formData.get("cabinet_name"),
    subdomain:    formData.get("subdomain"),
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: SignupState["errors"] = {};
    parsed.error.issues.forEach((issue) => {
      const key = issue.path[0] as keyof typeof errors;
      if (!errors[key]) errors[key] = issue.message;
    });
    return { status: "error", errors };
  }

  const { full_name, email, password, cabinet_name, subdomain } = parsed.data;
  const service = createServiceClient();

  // Vérifier dispo sous-domaine
  const { data: existing } = await service
    .from("organizations")
    .select("id")
    .eq("subdomain", subdomain)
    .maybeSingle();

  if (existing) {
    return { status: "error", errors: { subdomain: "Ce sous-domaine est déjà pris" } };
  }

  // Créer l'utilisateur Auth (email confirmé directement pour onboarding fluide)
  const { data: authData, error: authError } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  });

  if (authError || !authData.user) {
    if (authError?.message.includes("already been registered")) {
      return { status: "error", errors: { email: "Un compte existe déjà avec cet email" } };
    }
    return { status: "error", errors: { _: "Erreur lors de la création du compte. Réessayez." } };
  }

  // Créer l'organisation via la fonction SQL sécurisée
  const { error: orgError } = await service.rpc("create_organization", {
    p_name:          cabinet_name,
    p_slug:          subdomain,
    p_subdomain:     subdomain,
    p_contact_email: email,
    p_user_id:       authData.user.id,
  });

  if (orgError) {
    // Rollback propre si l'org échoue
    await service.auth.admin.deleteUser(authData.user.id);
    if (
      orgError.message.includes("subdomain_already_taken") ||
      orgError.message.includes("slug_already_taken")
    ) {
      return { status: "error", errors: { subdomain: "Ce sous-domaine est déjà pris" } };
    }
    return { status: "error", errors: { _: "Erreur lors de la création du cabinet. Réessayez." } };
  }

  return { status: "success", subdomain, email };
}

export async function checkSubdomainAction(subdomain: string): Promise<boolean> {
  if (!subdomain || subdomain.length < 3) return false;
  if (RESERVED_SUBDOMAINS.has(subdomain)) return false;

  const service = createServiceClient();
  const { data } = await service
    .from("organizations")
    .select("id")
    .eq("subdomain", subdomain)
    .maybeSingle();

  return !data;
}
