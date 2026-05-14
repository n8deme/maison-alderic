"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  full_name: z.string().min(2, "Nom requis (2 caractères minimum)"),
  phone:     z.string().optional(),
});

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const parsed = profileSchema.safeParse({
    full_name: formData.get("full_name"),
    phone:     (formData.get("phone") as string | null)?.trim() || undefined,
  });

  if (!parsed.success) redirect("/portail-avocat/profil?error=validation");

  const { error } = await supabase.from("profiles").update(parsed.data).eq("id", user.id);
  if (error) redirect("/portail-avocat/profil?error=save");

  redirect("/portail-avocat/profil?updated=1");
}

export async function updatePassword(formData: FormData) {
  const password = (formData.get("password") as string | null)?.trim() ?? "";
  const confirm  = (formData.get("confirm")  as string | null)?.trim() ?? "";

  if (password.length < 8) redirect("/portail-avocat/profil?pwd_error=short");
  if (password !== confirm) redirect("/portail-avocat/profil?pwd_error=mismatch");

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect("/portail-avocat/profil?pwd_error=server");

  redirect("/portail-avocat/profil?pwd_updated=1");
}
