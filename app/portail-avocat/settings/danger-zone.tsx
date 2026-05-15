"use client";

import { useState, useTransition } from "react";
import { deleteOrganization } from "./settings-actions";

export default function DangerZone({
  orgId,
  orgName,
}: {
  orgId: string;
  orgName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmValue, setConfirmValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isConfirmed = confirmValue === orgName;

  function handleDelete() {
    if (!isConfirmed) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteOrganization(orgId);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <section
      className="rounded-sm border"
      style={{ borderColor: "#fca5a5" }}
    >
      <div className="px-6 py-5" style={{ backgroundColor: "#fff5f5", borderRadius: "inherit" }}>
        <h2
          className="text-base font-medium"
          style={{ color: "#991b1b", fontFamily: "var(--font-body)" }}
        >
          Zone de danger
        </h2>
        <p className="mt-1 text-sm" style={{ color: "#b91c1c", fontFamily: "var(--font-body)" }}>
          Ces actions sont irréversibles. Procédez avec la plus grande prudence.
        </p>
      </div>

      <div
        className="px-6 py-5 flex items-center justify-between gap-4"
        style={{ borderTop: "1px solid #fca5a5" }}
      >
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}>
            Supprimer ce cabinet
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            Désactive définitivement le cabinet et déconnecte tous les utilisateurs.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="shrink-0 rounded-sm px-4 py-2 text-sm font-medium transition-colors"
          style={{
            backgroundColor: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fca5a5",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#fee2e2")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#fef2f2")}
        >
          Supprimer mon cabinet
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(26,26,26,0.5)" }}>
          <div
            className="w-full max-w-md rounded-sm border shadow-md p-6 space-y-4"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <div>
              <h3 className="text-base font-medium" style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}>
                Supprimer le cabinet
              </h3>
              <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                Cette action est irréversible. Pour confirmer, saisissez le nom exact de votre cabinet&nbsp;:
              </p>
              <p
                className="mt-1.5 text-sm font-medium px-3 py-1.5 rounded-sm"
                style={{
                  color: "var(--foreground)",
                  backgroundColor: "var(--surface-alt)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {orgName}
              </p>
            </div>

            <input
              type="text"
              value={confirmValue}
              onChange={(e) => setConfirmValue(e.target.value)}
              placeholder={orgName}
              className="w-full rounded-sm border px-3.5 py-2.5 text-sm outline-none"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--foreground)",
                fontFamily: "var(--font-body)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--foreground)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              autoFocus
            />

            {error && (
              <p className="text-xs" style={{ color: "#dc2626", fontFamily: "var(--font-body)" }}>
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => { setIsOpen(false); setConfirmValue(""); setError(null); }}
                disabled={isPending}
                className="flex-1 rounded-sm border px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!isConfirmed || isPending}
                className="flex-1 rounded-sm px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: isConfirmed ? "#dc2626" : "#fca5a5",
                  color: "#ffffff",
                  fontFamily: "var(--font-body)",
                }}
              >
                {isPending ? "Suppression..." : "Supprimer définitivement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
