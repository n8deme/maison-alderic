"use client";

import { useState, useTransition } from "react";
import { createBillingPortalSession } from "./settings-actions";

export function BillingButton({ orgId }: { orgId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await createBillingPortalSession(orgId);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.url) {
        window.location.href = result.url;
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="rounded-sm px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
        style={{ backgroundColor: "var(--foreground)", color: "#ffffff", fontFamily: "var(--font-body)" }}
      >
        {isPending ? "Chargement…" : "Gérer mon abonnement →"}
      </button>
      {error && (
        <p className="text-xs" style={{ color: "#dc2626", fontFamily: "var(--font-body)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
