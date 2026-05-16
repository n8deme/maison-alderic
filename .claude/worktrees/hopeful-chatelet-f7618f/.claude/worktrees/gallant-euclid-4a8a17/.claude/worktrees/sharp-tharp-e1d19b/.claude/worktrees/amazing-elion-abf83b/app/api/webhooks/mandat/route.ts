import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { triggerN8nWebhook } from "@/lib/n8n/client";

const schema = z.object({
  dossier_id: z.string().uuid(),
  client_id:  z.string().uuid().optional(),
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

  const { dossier_id, client_id = user.id } = parsed.data;

  // Vérifier que le dossier appartient au client (ou que l'utilisateur est interne)
  const { data: dossier } = await supabase
    .from("dossiers")
    .select("id, client_id, reference, title")
    .eq("id", dossier_id)
    .maybeSingle();

  if (!dossier) {
    return NextResponse.json({ error: "Dossier introuvable" }, { status: 404 });
  }

  try {
    const result = await triggerN8nWebhook("mandat-pdf", {
      client_id,
      dossier_id,
      dossier_reference: dossier.reference,
      dossier_title:     dossier.title,
      triggered_by:      user.id,
      triggered_at:      new Date().toISOString(),
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[webhook/mandat] n8n call failed:", err);
    return NextResponse.json({ error: "Erreur lors du déclenchement du workflow" }, { status: 502 });
  }
}
