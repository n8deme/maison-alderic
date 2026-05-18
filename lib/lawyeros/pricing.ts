/**
 * Source de vérité des offres LawyerOS (page publique + onboarding).
 * Les montants Stripe (STRIPE_PRICE_*_MONTHLY / YEARLY) doivent correspondre à ces prix.
 */

export type LawyerOsPlanId = "solo" | "cabinet" | "premium";

export type LawyerOsPlan = {
  id: LawyerOsPlanId;
  name: string;
  monthlyPrice: number;
  /** Équivalent mensuel si facturation annuelle (−20 % vs mensuel) */
  annualPrice: number;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  recommendedBadge: boolean;
};

export const PLANS: readonly LawyerOsPlan[] = [
  {
    id: "solo",
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
    recommendedBadge: false,
  },
  {
    id: "cabinet",
    name: "Cabinet",
    monthlyPrice: 199,
    annualPrice: 159,
    description: "La solution complète pour les cabinets en croissance.",
    features: [
      "Jusqu'à 5 avocats",
      "Tout Solo inclus",
      "Notes & résumés IA",
      "Détection de conflits",
      "Intake forms clients",
      "Signature électronique",
      "Support prioritaire",
    ],
    cta: "Commencer",
    highlighted: true,
    recommendedBadge: true,
  },
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: 399,
    annualPrice: 319,
    description: "Pour les structures qui veulent aller plus loin.",
    features: [
      "Avocats illimités",
      "Tout Cabinet inclus",
      "IA résumés dossiers approfondis",
      "Domaine personnalisé",
      "API & webhooks",
      "Account manager dédié",
    ],
    cta: "Commencer",
    highlighted: false,
    recommendedBadge: false,
  },
] as const;

export function annualTotalEuros(plan: LawyerOsPlan): number {
  return plan.annualPrice * 12;
}
