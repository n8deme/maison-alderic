"use client";

import { useState, useTransition } from "react";
import { submitIntakeResponse } from "./submit-actions";
import type { IntakeFieldDef } from "./page";
import { CheckCircle2 } from "lucide-react";

type Props = {
  formId: string;
  orgId: string;
  fields: IntakeFieldDef[];
};

export function IntakeForm({ formId, orgId, fields }: Props) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.id, ""]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function setValue(fieldId: string, value: string) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validation des champs obligatoires
    for (const field of fields) {
      if (field.required && !values[field.id]?.trim()) {
        setError(`Le champ « ${field.label} » est obligatoire.`);
        return;
      }
    }

    startTransition(async () => {
      const result = await submitIntakeResponse(formId, orgId, values);
      if (result.error) { setError(result.error); return; }
      setSubmitted(true);
    });
  }

  if (submitted) {
    return (
      <div className="rounded-sm border border-[#E5E2DB] bg-white px-8 py-12 text-center space-y-4">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="h-7 w-7 text-green-600" />
        </div>
        <h2
          className="text-xl font-medium text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Merci pour vos réponses
        </h2>
        <p
          className="text-sm text-[#5C5A55] max-w-sm mx-auto leading-relaxed"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Votre questionnaire a bien été transmis. Notre équipe prendra contact avec vous prochainement.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-sm border border-[#E5E2DB] bg-white px-6 py-8 space-y-6"
    >
      {fields.map((field, idx) => (
        <div key={field.id} className="space-y-1.5">
          <label
            className="block text-sm font-medium text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {idx + 1}. {field.label}
            {field.required && <span className="ml-1 text-[#7A1F2B]">*</span>}
          </label>

          {field.type === "text" && (
            <textarea
              value={values[field.id] ?? ""}
              onChange={(e) => setValue(field.id, e.target.value)}
              rows={3}
              className="w-full resize-none rounded-sm border border-[#E5E2DB] px-3 py-2 text-sm text-[#1A1A1A] placeholder:text-[#8B887F] focus:outline-none focus:border-[#1A1A1A] transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            />
          )}

          {field.type === "boolean" && (
            <div className="flex gap-4">
              {["Oui", "Non"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={field.id}
                    value={opt}
                    checked={values[field.id] === opt}
                    onChange={() => setValue(field.id, opt)}
                    className="accent-[#7A1F2B]"
                  />
                  <span
                    className="text-sm text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          )}

          {field.type === "date" && (
            <input
              type="date"
              value={values[field.id] ?? ""}
              onChange={(e) => setValue(field.id, e.target.value)}
              className="rounded-sm border border-[#E5E2DB] px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            />
          )}
        </div>
      ))}

      {error && (
        <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700" style={{ fontFamily: "var(--font-body)" }}>
            {error}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-sm bg-[#1A1A1A] py-3 text-sm font-medium text-white hover:bg-[#2a2a2a] disabled:opacity-50 transition-colors"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {isPending ? "Envoi en cours…" : "Envoyer mes réponses"}
      </button>
    </form>
  );
}
