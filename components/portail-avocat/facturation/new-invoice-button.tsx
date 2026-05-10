"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export function NewInvoiceButton() {
  return (
    <Link
      href="/portail-avocat/facturation/nouvelle"
      className="inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
      style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
    >
      <Plus className="h-4 w-4" />
      Nouvelle facture
    </Link>
  );
}
