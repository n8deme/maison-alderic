"use client";

import { useState } from "react";
import Link from "next/link";

type Plan = {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Solo",
    monthlyPrice: 79,
    annualPrice: 63,
    description: "Pour l'avocat indépendant qui veut se professionnaliser.",
    features: [
      "1 avocat",
      "Portail client inclus",
      "Dossiers illimités",
      "Messagerie sécurisée",
      "Facturation de base",
      "Support email",
    ],
    cta: "Commencer",
    highlighted: false,
  },
  {
    name: "Cabinet",
    monthlyPrice: 199,
    annualPrice: 159,
    description: "La solution complète pour les cabinets en croissance.",
    features: [
      "Jusqu'à 10 avocats",
      "Tout Solo inclus",
      "Notes & résumés IA",
      "Détection de conflits",
      "Intake forms clients",
      "Support prioritaire",
    ],
    cta: "Commencer",
    highlighted: true,
  },
  {
    name: "Premium",
    monthlyPrice: 399,
    annualPrice: 319,
    description: "Pour les structures qui veulent aller plus loin.",
    features: [
      "Avocats illimités",
      "Tout Cabinet inclus",
      "E-signature intégrée",
      "API & webhooks",
      "Domaine personnalisé",
      "Account manager dédié",
    ],
    cta: "Commencer",
    highlighted: false,
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="tarifs" className="py-32 md:py-40 px-6 md:px-12 lg:px-20" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p
            className="text-xs uppercase tracking-widest font-medium mb-4"
            style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}
          >
            Tarifs
          </p>
          <h2
            className="text-3xl md:text-4xl font-heading font-medium tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Simple, transparent, sans surprise.
          </h2>
          <p
            className="mt-4 text-lg max-w-xl mx-auto"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
          >
            14 jours d&apos;essai gratuit sur tous les plans. Aucune carte bancaire requise.
          </p>

          {/* Toggle mensuel / annuel */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-sm border p-1" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className="rounded-sm px-4 py-2 text-sm font-medium transition-colors"
              style={{
                fontFamily: "var(--font-body)",
                backgroundColor: !annual ? "var(--foreground)" : "transparent",
                color: !annual ? "#ffffff" : "var(--text-secondary)",
              }}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className="flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-colors"
              style={{
                fontFamily: "var(--font-body)",
                backgroundColor: annual ? "var(--foreground)" : "transparent",
                color: annual ? "#ffffff" : "var(--text-secondary)",
              }}
            >
              Annuel
              <span
                className="rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                style={{ backgroundColor: annual ? "rgba(122,31,43,0.15)" : "rgba(122,31,43,0.1)", color: annual ? "#ffffff" : "var(--accent)" }}
              >
                −20%
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-sm border flex flex-col${plan.highlighted ? " mt-4" : ""}`}
              style={{
                borderColor: plan.highlighted ? "var(--accent)" : "var(--border)",
                backgroundColor: plan.highlighted ? "var(--foreground)" : "var(--surface)",
                boxShadow: plan.highlighted ? "0 8px 32px rgba(122,31,43,0.15)" : "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ backgroundColor: "var(--accent)", color: "#ffffff", fontFamily: "var(--font-body)" }}
                >
                  Recommandé
                </div>
              )}

              <div className="px-7 pt-8 pb-6">
                <p
                  className="text-sm font-medium uppercase tracking-widest"
                  style={{ color: plan.highlighted ? "rgba(255,255,255,0.6)" : "var(--text-muted)", fontFamily: "var(--font-body)" }}
                >
                  {plan.name}
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span
                    className="text-4xl font-heading font-medium"
                    style={{ color: plan.highlighted ? "#ffffff" : "var(--foreground)" }}
                  >
                    {annual ? plan.annualPrice : plan.monthlyPrice}€
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: plan.highlighted ? "rgba(255,255,255,0.5)" : "var(--text-muted)", fontFamily: "var(--font-body)" }}
                  >
                    /mois
                  </span>
                </div>
                {annual && (
                  <p
                    className="mt-1 text-xs"
                    style={{ color: plan.highlighted ? "rgba(255,255,255,0.5)" : "var(--text-muted)", fontFamily: "var(--font-body)" }}
                  >
                    Facturé annuellement ({plan.annualPrice * 12}€/an)
                  </p>
                )}
                <p
                  className="mt-3 text-sm"
                  style={{ color: plan.highlighted ? "rgba(255,255,255,0.7)" : "var(--text-secondary)", fontFamily: "var(--font-body)" }}
                >
                  {plan.description}
                </p>
              </div>

              <div className="px-7 pb-6 flex-1">
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0"
                        viewBox="0 0 16 16"
                        fill="none"
                        style={{ color: plan.highlighted ? "#a3e6c5" : "var(--accent)" }}
                      >
                        <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span
                        className="text-sm"
                        style={{ color: plan.highlighted ? "rgba(255,255,255,0.85)" : "var(--text-secondary)", fontFamily: "var(--font-body)" }}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-7 pb-8">
                <Link
                  href="/signup"
                  className="block w-full rounded-sm py-3 text-center text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: plan.highlighted ? "var(--accent)" : "var(--foreground)",
                    color: "#ffffff",
                    fontFamily: "var(--font-body)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = plan.highlighted ? "var(--bordeaux-hover)" : "rgba(26,26,26,0.85)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = plan.highlighted ? "var(--accent)" : "var(--foreground)";
                  }}
                >
                  {plan.cta} — 14 jours gratuits
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p
          className="mt-8 text-center text-sm"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          Pas de carte bancaire. Pas d&apos;engagement. Annulation en 1 clic.
        </p>
      </div>
    </section>
  );
}
