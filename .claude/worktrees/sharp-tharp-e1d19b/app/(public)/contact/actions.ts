"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const demandTypes = [
  "m_a",
  "private_equity",
  "litigation",
  "tax",
  "corporate",
  "restructuring",
  "other",
] as const;

const schema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Adresse e-mail invalide"),
  phone: z.string().optional(),
  company: z.string().optional(),
  demand_type: z.enum(demandTypes),
  subject: z.string().min(2, "Sujet requis"),
  message: z.string().min(10, "Message trop court (10 caractères minimum)"),
});

export type ContactFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; errors: Record<string, string[]> }
  | { status: "server_error"; message: string };

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  console.log("[contact] Action called with:", Object.fromEntries(formData.entries()));

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    company: formData.get("company") || undefined,
    demand_type: formData.get("demand_type"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  console.log("[contact] Parsed data:", parsed.data);

  const supabase = await createClient();
  console.log("[contact] About to insert:", parsed.data);
  const { error } = await supabase.from("contact_messages").insert(parsed.data);

  if (error) {
    console.error("[contact] Supabase insert error:", error);
    return { status: "server_error", message: "Une erreur est survenue. Veuillez réessayer." };
  }

  console.log("[contact] Insert successful");
  return { status: "success" };
}
