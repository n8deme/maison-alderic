"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

interface NewDossierButtonProps {
  clientId?: string;
}

export function NewDossierButton({ clientId }: NewDossierButtonProps) {
  const href = clientId
    ? `/portail-avocat/dossiers/nouveau?client_id=${clientId}`
    : "/portail-avocat/dossiers/nouveau";

  return (
    <Link
      href={href}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-accent bg-accent px-4 py-2.5 text-sm text-white transition hover:opacity-90"
    >
      <FileText className="h-4 w-4" />
      Nouveau dossier
    </Link>
  );
}
