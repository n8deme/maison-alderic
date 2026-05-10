"use client";

import { useState } from "react";
import { EditDossierModal } from "./edit-dossier-modal";

type Avocat = { id: string; full_name: string; title: string };

interface EditDossierButtonProps {
  dossierId: string;
  reference: string;
  defaultValues: {
    title: string;
    description?: string;
    status: "active" | "pending" | "archived" | "won" | "lost";
    type: "M&A" | "Litigation" | "Tax" | "Corporate" | "PE" | "Restructuring";
    lead_avocat_id: string;
    team_avocat_ids: string[];
    budget_estimated?: number | null;
  };
  avocats: Avocat[];
}

export function EditDossierButton({
  dossierId,
  reference,
  defaultValues,
  avocats,
}: EditDossierButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ml-auto rounded-sm border px-3 py-1 text-sm transition-colors hover:bg-surface-alt"
        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
      >
        Modifier
      </button>

      {open && (
        <EditDossierModal
          dossierId={dossierId}
          reference={reference}
          defaultValues={defaultValues}
          avocats={avocats}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
