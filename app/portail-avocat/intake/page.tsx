import { createClient } from "@/lib/supabase/server";
import { getOrganization } from "@/lib/get-organization";
import type { Metadata } from "next";
import { IntakeManager } from "./intake-manager";

export const metadata: Metadata = { title: "Intake" };

export default async function IntakePage() {
  const supabase = await createClient();
  const org = await getOrganization();

  const { data: forms } = await supabase
    .from("intake_forms")
    .select("id, title, description, is_active, created_at, fields")
    .eq("organization_id", org.id)
    .order("created_at", { ascending: false });

  // Nombre de réponses par formulaire
  const formIds = (forms ?? []).map((f) => f.id);
  const { data: responseCounts } = formIds.length
    ? await supabase
        .from("intake_responses")
        .select("intake_form_id")
        .in("intake_form_id", formIds)
    : { data: [] };

  const countByForm = (responseCounts ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.intake_form_id] = (acc[r.intake_form_id] ?? 0) + 1;
    return acc;
  }, {});

  const formsWithCount = (forms ?? []).map((f) => ({
    id: f.id as string,
    title: f.title as string,
    description: (f.description ?? null) as string | null,
    is_active: f.is_active as boolean,
    created_at: f.created_at as string,
    field_count: Array.isArray(f.fields) ? f.fields.length : 0,
    response_count: countByForm[f.id] ?? 0,
  }));

  return (
    <div className="space-y-6 p-6 md:p-8 max-w-4xl">
      <div>
        <h1
          className="text-2xl font-medium text-slate-900"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          Formulaires intake
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Créez des questionnaires à envoyer à vos clients avant l&apos;ouverture d&apos;un dossier.
        </p>
      </div>

      <IntakeManager orgId={org.id} initialForms={formsWithCount} />
    </div>
  );
}
