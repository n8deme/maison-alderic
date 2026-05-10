"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

type Props = {
  /** Server action qui retourne le PDF en base64 */
  action: () => Promise<string>;
  fileName: string;
  label?: string;
  variant?: "primary" | "outline";
};

export function DownloadPdfButton({ action, fileName, label = "Télécharger PDF", variant = "primary" }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (loading) return;
    setLoading(true);
    try {
      const base64 = await action();

      const byteChars = atob(base64);
      const bytes = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        bytes[i] = byteChars.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[DownloadPdfButton]", err);
      alert("Impossible de générer le PDF. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  const baseClass = "inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50";
  const variantClass =
    variant === "primary"
      ? "bg-foreground text-background hover:bg-foreground/90"
      : "border border-border text-foreground hover:bg-surface-alt";

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className={`${baseClass} ${variantClass}`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {loading ? "Génération…" : label}
    </button>
  );
}
