import type { Metadata } from "next";
import Link from "next/link";
import { PricingSection } from "@/components/lawyeros/pricing-section";

export const metadata: Metadata = {
  title: { absolute: "Tarifs | LawyerOS" },
  description:
    "Découvrez les formules LawyerOS : Solo, Cabinet, Premium. 14 jours d'essai gratuit · annulation à tout moment.",
};

export default function PricingPage() {
  return (
    <div style={{ backgroundColor: "var(--background)" }}>
      <header
        className="border-b px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <Link
          href="/"
          className="text-lg font-heading font-medium tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          Lawyer<span style={{ color: "var(--accent)" }}>OS</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/connexion"
            className="text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Connexion
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium px-4 py-2 rounded-sm transition-colors"
            style={{ backgroundColor: "var(--foreground)", color: "#ffffff" }}
          >
            Essai gratuit
          </Link>
        </div>
      </header>
      <PricingSection />
    </div>
  );
}
