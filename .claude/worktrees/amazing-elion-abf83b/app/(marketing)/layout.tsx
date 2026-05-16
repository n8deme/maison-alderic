import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "LawyerOS — Le portail client que vos clients méritent",
    template: "%s | LawyerOS",
  },
  description:
    "LawyerOS offre aux cabinets d'avocats un portail client white-label : dossiers, messagerie sécurisée, facturation, RDV et automatisations. Essai 14 jours gratuit.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooterMinimal />
    </div>
  );
}

function MarketingNav() {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "rgba(248, 247, 244, 0.92)",
        backdropFilter: "blur(12px)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between h-16">
        <Link
          href="/"
          className="font-heading font-medium text-lg tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          LawyerOS
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: "/#features", label: "Fonctionnalités" },
            { href: "/#pricing", label: "Tarifs" },
            { href: "/#faq", label: "FAQ" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/connexion"
            className="text-sm font-medium transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            Connexion
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium px-4 py-2 rounded-sm transition-colors"
            style={{ backgroundColor: "var(--accent)", color: "#ffffff" }}
          >
            Essai gratuit
          </Link>
        </div>
      </div>
    </header>
  );
}

function MarketingFooterMinimal() {
  return (
    <footer
      className="border-t py-6"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-sm font-heading font-medium" style={{ color: "var(--foreground)" }}>
          LawyerOS
        </span>
        <div className="flex items-center gap-6">
          {[
            { href: "/mentions-legales", label: "Mentions légales" },
            { href: "/confidentialite", label: "Confidentialité" },
            { href: "/cgv", label: "CGV" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              {label}
            </Link>
          ))}
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          © 2026 LawyerOS. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
