"use client";

import { useState, useTransition } from "react";
import { PLANS, annualTotalEuros } from "@/lib/lawyeros/pricing";
import { createUpgradeCheckoutSession } from "./actions";

export function UpgradeForm({
  orgId,
  orgName,
  tenant,
}: {
  orgId: string;
  orgName: string;
  tenant: string;
}) {
  const [selectedPlan, setSelectedPlan] = useState("cabinet");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleCheckout() {
    setError("");
    startTransition(async () => {
      const result = await createUpgradeCheckoutSession(orgId, selectedPlan, billing, tenant);
      if ("error" in result) {
        setError(
          result.error === "STRIPE_NOT_CONFIGURED"
            ? "Le paiement en ligne n'est pas encore disponible. Contactez-nous : support@lawyeros.app"
            : "Erreur lors de la redirection vers le paiement. Réessayez."
        );
        return;
      }
      window.location.href = result.url;
    });
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <header
        className="border-b px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <span
          className="text-lg font-heading font-medium tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          Lawyer<span style={{ color: "var(--accent)" }}>OS</span>
        </span>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
          {orgName}
        </span>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="space-y-6">
          <div
            className="rounded-sm border px-6 py-5"
            style={{ backgroundColor: "#fefce8", borderColor: "#fde68a" }}
          >
            <p className="text-sm font-medium" style={{ color: "#92400e" }}>
              Votre période d&apos;essai a expiré
            </p>
            <p className="mt-1 text-sm" style={{ color: "#a16207" }}>
              Vos données sont conservées. Souscrivez à une formule pour retrouver l&apos;accès à {orgName}.
            </p>
          </div>

          <div className="space-y-2">
            <h1
              className="text-2xl font-heading font-medium tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              Choisissez votre formule
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Annulation possible à tout moment depuis les paramètres.
            </p>
          </div>

          {error && (
            <div
              className="rounded-sm border p-4 text-sm"
              style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca", color: "#991b1b" }}
            >
              {error}
            </div>
          )}

          {/* Toggle mensuel / annuel */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className="text-sm px-4 py-1.5 rounded-sm border transition-colors"
              style={{
                backgroundColor: billing === "monthly" ? "var(--foreground)" : "transparent",
                borderColor: "var(--border)",
                color: billing === "monthly" ? "#fff" : "var(--text-secondary)",
              }}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className="text-sm px-4 py-1.5 rounded-sm border transition-colors"
              style={{
                backgroundColor: billing === "yearly" ? "var(--foreground)" : "transparent",
                borderColor: "var(--border)",
                color: billing === "yearly" ? "#fff" : "var(--text-secondary)",
              }}
            >
              Annuel{" "}
              <span
                className="text-xs font-medium"
                style={{ color: billing === "yearly" ? "#86efac" : "var(--accent)" }}
              >
                −20%
              </span>
            </button>
          </div>

          {/* Plans */}
          <div className="grid gap-4">
            {PLANS.map((plan) => {
              const price = billing === "monthly" ? plan.monthlyPrice : plan.annualPrice;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className="w-full text-left rounded-sm border p-5 transition-all"
                  style={{
                    borderColor:     selectedPlan === plan.id ? "var(--foreground)" : "var(--border)",
                    backgroundColor: plan.highlighted && selectedPlan !== plan.id ? "var(--surface-alt)" : "var(--surface)",
                    boxShadow:       selectedPlan === plan.id ? "0 0 0 1px var(--foreground)" : "none",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-4 w-4 rounded-full border-2 flex items-center justify-center"
                        style={{ borderColor: selectedPlan === plan.id ? "var(--foreground)" : "var(--border)" }}
                      >
                        {selectedPlan === plan.id && (
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: "var(--foreground)" }}
                          />
                        )}
                      </div>
                      <span className="font-medium" style={{ color: "var(--foreground)" }}>
                        {plan.name}
                      </span>
                      {plan.recommendedBadge && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-sm font-medium"
                          style={{ backgroundColor: "var(--accent)", color: "#fff" }}
                        >
                          Recommandé
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                        {price} €/mois
                      </span>
                      {billing === "yearly" && (
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                          facturé {annualTotalEuros(plan)} €/an
                        </p>
                      )}
                    </div>
                  </div>
                  <ul className="space-y-1 ml-7">
                    {plan.features.map((f) => (
                      <li key={f} className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isPending}
            className="w-full py-3 px-4 rounded-sm text-sm font-medium transition-colors disabled:opacity-60"
            style={{ backgroundColor: "var(--accent)", color: "#ffffff" }}
          >
            {isPending
              ? "Redirection..."
              : `Souscrire — ${PLANS.find((p) => p.id === selectedPlan)?.name}`}
          </button>

          <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
            Annulation possible à tout moment · facturation mensuelle ou annuelle
          </p>
        </div>
      </main>
    </div>
  );
}
