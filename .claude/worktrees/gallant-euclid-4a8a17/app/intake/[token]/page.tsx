import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { IntakeForm } from "./intake-form";

type PageProps = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("intake_forms")
    .select("title")
    .eq("id", token)
    .eq("is_active", true)
    .single();
  return { title: data?.title ?? "Questionnaire" };
}

export type IntakeFieldDef = {
  id: string;
  type: "text" | "boolean" | "date";
  label: string;
  required: boolean;
};

export default async function IntakePublicPage({ params }: PageProps) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: form } = await supabase
    .from("intake_forms")
    .select("id, title, description, fields, organization_id")
    .eq("id", token)
    .eq("is_active", true)
    .single();

  if (!form) notFound();

  const fields = (Array.isArray(form.fields) ? form.fields : []) as IntakeFieldDef[];

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-start justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <p
            className="text-xs uppercase tracking-widest text-[#8B887F] mb-3"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Questionnaire confidentiel
          </p>
          <h1
            className="text-3xl font-medium text-[#1A1A1A] tracking-tight"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            {form.title}
          </h1>
          {form.description && (
            <p
              className="mt-3 text-sm text-[#5C5A55] max-w-lg mx-auto leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {form.description}
            </p>
          )}
        </div>

        <IntakeForm
          formId={form.id as string}
          orgId={form.organization_id as string}
          fields={fields}
        />

        <p
          className="mt-6 text-center text-xs text-[#8B887F]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Vos réponses sont transmises de manière sécurisée et confidentielle.
        </p>
      </div>
    </div>
  );
}
