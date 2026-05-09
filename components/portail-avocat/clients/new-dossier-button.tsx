"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

export function NewDossierButton() {
  const [show, setShow] = useState(false);

  function handleClick() {
    setShow(true);
    setTimeout(() => setShow(false), 3000);
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-bordeaux bg-bordeaux px-4 py-2.5 text-sm text-white transition hover:bg-bordeaux/90"
      >
        <FileText className="h-4 w-4" />
        Nouveau dossier
      </button>

      {show && (
        <div
          className="fixed bottom-4 right-4 z-50 rounded-sm px-4 py-2.5 text-sm text-white shadow-lg"
          style={{ backgroundColor: "var(--foreground)" }}
        >
          Création de dossier à venir
        </div>
      )}
    </>
  );
}
