import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { triggerN8nWebhook } from "@/lib/n8n/client";

const schema = z.object({
  profile_id: z.string().uuid(),
  avocat_id:  z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Payload invalide", details: parsed.error.flatten() }, { status: 400 });
  }

  const { profile_id, avocat_id } = parsed.data;

  // Vérifier que le profil existe
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, company")
    .eq("id", profile_id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
  }

  try {
    const result = await triggerN8nWebhook("onboarding-client", {
      profile_id,
      avocat_id:    avocat_id ?? null,
      client_name:  profile.full_name,
      client_email: profile.email,
      client_company: profile.company,
      triggered_by: user.id,
      triggered_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[webhook/onboarding] n8n call failed:", err);
    return NextResponse.json({ error: "Erreur lors du déclenchement du workflow" }, { status: 502 });
  }
}
