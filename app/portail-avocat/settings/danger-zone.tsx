"use client";

import { useState, useTransition } from "react";
import { Lock, Trash2 } from "lucide-react";
import { DEMO_TENANT_SLUG } from "@/lib/demo/credentials";
import { deleteOrganization } from "./settings-actions";

export default function DangerZone({
  orgId,
  orgName,
  orgSlug,
}: {
  orgId: string;
  orgName: string;
  orgSlug: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmValue, setConfirmValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isDemoCabinet = orgSlug === DEMO_TENANT_SLUG;
  const isConfirmed = confirmValue === orgName;

  function handleOpenClick() {
    if (isDemoCabinet) return;
    setIsOpen(true);
  }

  function handleDelete() {
    if (!isConfirmed) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteOrganization(orgId);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <section className="rounded-md border border-[#FCA5A5] bg-[#FEF2F2] p-6">
      <h2 className="text-base font-bold text-[#991B1B]" style={{ fontFamily: "var(--font-body)" }}>
        Zone de danger
      </h2>
      <p className="mt-1 text-sm text-[#b91c1c]" style={{ fontFamily: "var(--font-body)" }}>
        Ces actions sont irréversibles. Procédez avec la plus grande prudence.
      </p>

      <div className="mt-6 flex flex-col gap-4 border-t border-[#FCA5A5] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-[#1A1A1A]" style={{ fontFamily: "var(--font-body)" }}>
            <Trash2 className="size-4 shrink-0 text-[#DC2626]" aria-hidden />
            Supprimer ce cabinet
          </p>
          <p className="mt-0.5 text-xs text-[#5C5A55]" style={{ fontFamily: "var(--font-body)" }}>
            Désactive définitivement le cabinet et déconnecte tous les utilisateurs.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenClick}
          disabled={isDemoCabinet}
          aria-disabled={isDemoCabinet}
          title={isDemoCabinet ? "Action désactivée en mode démo" : undefined}
          className={`shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            isDemoCabinet ? "cursor-not-allowed opacity-50" : ""
          }`}
          style={{
            backgroundColor: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fca5a5",
          }}
          onMouseEnter={(e) => {
            if (isDemoCabinet) return;
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#fee2e2";
          }}
          onMouseLeave={(e) => {
            if (isDemoCabinet) return;
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#fef2f2";
          }}
        >
          Supprimer mon cabinet
        </button>
      </div>

      {isDemoCabinet && (
        <p
          className="mt-4 flex items-center gap-2 text-sm text-[#5C5A55]"
          style={{ fontFamily: "var(--font-body)" }}
          role="note"
        >
          <Lock className="h-4 w-4 shrink-0" aria-hidden />
          <span>
            Action désactivée en mode démo. Les données sont réinitialisées chaque nuit à 3h.
          </span>
        </p>
      )}

      {isOpen && !isDemoCabinet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(26,26,26,0.5)" }}>
          <div
            className="w-full max-w-md space-y-4 rounded-md border border-[#E5E2DB] bg-white p-6 shadow-md"
          >
            <div>
              <h3 className="text-base font-medium text-[#1A1A1A]" style={{ fontFamily: "var(--font-body)" }}>
                Supprimer le cabinet
              </h3>
              <p className="mt-2 text-sm text-[#5C5A55]" style={{ fontFamily: "var(--font-body)" }}>
                Cette action est irréversible. Pour confirmer, saisissez le nom exact de votre cabinet&nbsp;:
              </p>
              <p
                className="mt-1.5 rounded-sm px-3 py-1.5 text-sm font-medium text-[#1A1A1A]"
                style={{
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
              className="w-full rounded-md border border-[#E5E2DB] bg-white px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none"
              style={{ fontFamily: "var(--font-body)" }}
              onFocus={(e) => (e.target.style.borderColor = "#1A1A1A")}
              onBlur={(e) => (e.target.style.borderColor = "#E5E2DB")}
              autoFocus
            />

            {error && (
              <p className="text-xs text-[#dc2626]" style={{ fontFamily: "var(--font-body)" }}>
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => { setIsOpen(false); setConfirmValue(""); setError(null); }}
                disabled={isPending}
                className="flex-1 rounded-md border border-[#E5E2DB] bg-transparent px-4 py-2.5 text-sm font-medium text-[#5C5A55] transition-colors disabled:opacity-50"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!isConfirmed || isPending}
                className="flex-1 rounded-md px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  backgroundColor: isConfirmed ? "#dc2626" : "#fca5a5",
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
