"use client";

import { useState } from "react";

export function PayButton({ invoiceNumber }: { invoiceNumber: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-2.5 text-xs font-medium rounded-sm transition-opacity hover:opacity-90"
        style={{ backgroundColor: "var(--bordeaux)", color: "#fff", fontFamily: "var(--font-body)" }}
      >
        Régler cette facture
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        >
          <div className="w-full max-w-sm rounded-sm border border-border bg-background p-6 shadow-xl space-y-4">
            <div>
              <p
                className="text-[10px] font-medium uppercase tracking-wider text-text-muted mb-1"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {invoiceNumber}
              </p>
              <h2
                className="text-xl font-medium"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
              >
                Paiement en ligne
              </h2>
              <p className="mt-1 text-xs text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                Démo — aucun paiement réel ne sera traité.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-text-muted uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-body)" }}>
                  Numéro de carte
                </label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  disabled
                  className="w-full text-sm border border-border rounded-sm px-3 py-2 bg-surface-alt text-text-muted cursor-not-allowed"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-text-muted uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-body)" }}>
                    Expiration
                  </label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    disabled
                    className="w-full text-sm border border-border rounded-sm px-3 py-2 bg-surface-alt text-text-muted cursor-not-allowed"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-text-muted uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-body)" }}>
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    disabled
                    className="w-full text-sm border border-border rounded-sm px-3 py-2 bg-surface-alt text-text-muted cursor-not-allowed"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </div>
              </div>
            </div>

            <div
              className="rounded-sm px-3 py-2 text-xs"
              style={{ backgroundColor: "rgba(122,31,43,0.06)", color: "var(--bordeaux)", fontFamily: "var(--font-body)" }}
            >
              Intégration Stripe à venir. Le paiement en ligne sera disponible prochainement.
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2 text-xs font-medium rounded-sm border transition-colors hover:bg-surface-alt"
                style={{ borderColor: "var(--border)", color: "var(--foreground)", fontFamily: "var(--font-body)" }}
              >
                Fermer
              </button>
              <button
                disabled
                className="flex-1 py-2 text-xs font-medium rounded-sm opacity-40 cursor-not-allowed"
                style={{ backgroundColor: "var(--bordeaux)", color: "#fff", fontFamily: "var(--font-body)" }}
              >
                Payer (bientôt)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
