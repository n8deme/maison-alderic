"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export function NewInvoiceButton() {
  const [show, setShow] = useState(false);

  function handleClick() {
    setShow(true);
    setTimeout(() => setShow(false), 3000);
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
        style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
      >
        <Plus className="h-4 w-4" />
        Nouvelle facture
      </button>

      {show && (
        <div
          className="fixed bottom-4 right-4 z-50 rounded-sm px-4 py-2.5 text-sm text-white shadow-lg"
          style={{ backgroundColor: "var(--foreground)" }}
        >
          Création de facture à venir
        </div>
      )}
    </>
  );
}
