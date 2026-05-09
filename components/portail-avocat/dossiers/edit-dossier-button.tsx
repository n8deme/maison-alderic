"use client";

import { useState } from "react";

export function EditDossierButton() {
  const [show, setShow] = useState(false);

  function handleClick() {
    setShow(true);
    setTimeout(() => setShow(false), 3000);
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="ml-auto rounded-sm border px-3 py-1 text-sm transition-colors hover:bg-slate-50"
        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
      >
        Modifier
      </button>

      {show && (
        <div
          className="fixed bottom-4 right-4 z-50 rounded-sm px-4 py-2.5 text-sm text-white shadow-lg"
          style={{ backgroundColor: "var(--foreground)" }}
        >
          Édition de dossier à venir
        </div>
      )}
    </>
  );
}
