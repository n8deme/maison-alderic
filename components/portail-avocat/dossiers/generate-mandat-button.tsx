"use client";

import { useState, useTransition } from "react";
import { FileSignature, Loader2, Check, AlertCircle } from "lucide-react";
import { generateMandat } from "@/app/portail-avocat/dossiers/[reference]/mandat-actions";

type Feedback =
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export function GenerateMandatButton({ dossierId }: { dossierId: string }) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  function handleClick() {
    setFeedback(null);
    startTransition(async () => {
      const result = await generateMandat(dossierId);
      setFeedback(
        result.success
          ? { type: "success", message: result.message }
          : { type: "error", message: result.error }
      );
      setTimeout(() => setFeedback(null), 5000);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "var(--bordeaux)",
          color: "white",
          fontFamily: "var(--font-body)",
        }}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Génération en cours...
          </>
        ) : (
          <>
            <FileSignature className="h-4 w-4" />
            Générer mandat
          </>
        )}
      </button>

      {feedback && (
        <div
          className={`flex items-start gap-2 rounded-sm border px-3 py-2 text-xs ${
            feedback.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
          style={{ fontFamily: "var(--font-body)" }}
        >
          {feedback.type === "success" ? (
            <Check className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}
    </div>
  );
}
