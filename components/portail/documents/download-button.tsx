"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { getSignedUrl } from "@/app/portail/documents/actions";

interface DownloadButtonProps {
  documentId: string;
  fileName?: string;
}

export function DownloadButton({ documentId }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const url = await getSignedUrl(documentId);
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Impossible de télécharger ce document.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-sm transition-colors hover:bg-surface-alt disabled:opacity-50"
      style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Download className="w-3.5 h-3.5" />
      )}
      Télécharger
    </button>
  );
}
