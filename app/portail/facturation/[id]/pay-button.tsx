"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { payInvoice } from "./actions";

export function PayButton({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const { url } = await payInvoice(invoiceId);
      window.location.href = url;
    } catch (err) {
      console.error("[PayButton]", err);
      toast.error("Impossible de démarrer le paiement. Réessayez ou contactez le cabinet.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-sm px-6 py-3 text-sm font-medium transition-colors disabled:opacity-50"
      style={{
        backgroundColor: "var(--accent)",
        color: "#ffffff",
        fontFamily: "var(--font-body)",
      }}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="h-4 w-4" />
      )}
      {loading ? "Redirection vers Stripe…" : "Payer en ligne"}
    </button>
  );
}
