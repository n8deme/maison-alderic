import type { Metadata } from "next";
import Link from "next/link";
import { PricingSection } from "./pricing-section";
import { LawyerosHero } from "./lawyeros-hero";
import { FeaturesSection } from "@/components/lawyeros/features-section";
import { StatsSection } from "@/components/lawyeros/stats-section";

export const metadata: Metadata = {
  title: "LawyerOS — Le portail client que vos clients méritent",
  description:
    "LawyerOS donne à votre cabinet un portail professionnel en 10 minutes. Dossiers, messagerie, facturation Stripe, notes IA. 14 jours gratuits, sans carte.",
  openGraph: {
    title: "LawyerOS — Portail client pour avocats",
    description: "Portail client white-label pour cabinets d'avocats belges et français. Setup en 10 minutes.",
    locale: "fr_BE",
    type: "website",
  },
};

export default function LawyerOSPage() {
  return (
    <>
      <style>{`
        .los-btn-accent { background-color: var(--accent); color: #fff; transition: background-color 200ms; }
        .los-btn-accent:hover { background-color: var(--bordeaux-hover); }
        .los-btn-outline { border: 1px solid var(--border); background-color: var(--surface); color: var(--foreground); transition: background-color 200ms; }
        .los-btn-outline:hover { background-color: var(--surface-alt); }
        .los-btn-ghost-dark { border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.8); transition: border-color 200ms; }
        .los-btn-ghost-dark:hover { border-color: rgba(255,255,255,0.45); }
        .los-nav-link { color: var(--text-secondary); transition: color 200ms; }
        .los-nav-link:hover { color: var(--foreground); }
        .los-footer-link { color: var(--text-muted); transition: color 200ms; }
        .los-footer-link:hover { color: var(--text-secondary); }
        .los-connexion-link { color: var(--text-secondary); transition: color 200ms; }
        .los-connexion-link:hover { color: var(--foreground); }
        .los-hero-cta-primary {
          display: inline-block;
          background-color: var(--accent);
          transition: background-color 200ms ease, transform 200ms ease, box-shadow 200ms ease;
          box-shadow: 0 1px 2px rgba(26, 26, 26, 0.06);
        }
        .los-hero-cta-primary:hover {
          background-color: #5C1820;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(92, 24, 32, 0.16);
        }
      `}</style>

      <div style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>

        {/* ─────────────── NAVBAR ─────────────── */}
        <header
          className="sticky top-0 z-40 border-b"
          style={{ backgroundColor: "rgba(248,247,244,0.95)", borderColor: "var(--border)", backdropFilter: "blur(8px)" }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex h-14 items-center justify-between">
            <Link href="/lawyeros" className="flex items-center gap-2">
              <span className="text-lg font-heading font-medium" style={{ color: "var(--foreground)" }}>
                Lawyer<span style={{ color: "var(--accent)" }}>OS</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {[
                { href: "#fonctionnalites", label: "Fonctionnalités" },
                { href: "#tarifs", label: "Tarifs" },
                { href: "#demo", label: "Démo" },
                { href: "/lawyeros/docs", label: "Documentation" },
              ].map((item) => (
                <a key={item.href} href={item.href} className="los-nav-link text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/connexion" className="los-connexion-link hidden md:block text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>
                Connexion
              </Link>
              <Link href="/signup" className="los-btn-accent rounded-sm px-4 py-2 text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>
                Essai gratuit
              </Link>
            </div>
          </div>
        </header>

        {/* ─────────────── HERO ─────────────── */}
        <LawyerosHero />

        <StatsSection />

        {/* ─────────────── FEATURES ─────────────── */}
        <FeaturesSection />

        {/* ─────────────── PRICING ─────────────── */}
        <PricingSection />

        {/* ─────────────── DEMO ─────────────── */}
        <section id="demo" className="py-32 md:py-40 px-6 md:px-12 lg:px-20" style={{ backgroundColor: "var(--surface)" }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-widest font-medium mb-4" style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}>
                Démo live
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-medium tracking-tight" style={{ color: "var(--foreground)" }}>
                Testez le portail en live.
              </h2>
              <p className="mt-4 text-lg" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                Explorez un cabinet démo entièrement configuré — dossiers réels, messagerie, facturation.
              </p>
            </div>

            {/* Browser chrome mockup */}
            <div
              className="rounded-sm border overflow-hidden max-w-4xl mx-auto"
              style={{ borderColor: "var(--border)", boxShadow: "0 8px 40px rgba(0,0,0,0.10)" }}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ backgroundColor: "var(--surface-alt)", borderColor: "var(--border)" }}>
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#fca5a5" }} />
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#fde68a" }} />
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#a7f3d0" }} />
                </div>
                <div
                  className="flex-1 rounded-sm px-3 py-1.5 text-xs text-center"
                  style={{ backgroundColor: "var(--background)", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                >
                  lawyeros.vercel.app/portail-avocat?__tenant=maison-alderic
                </div>
              </div>

              <div
                className="relative flex flex-col items-center justify-center py-20 gap-6"
                style={{ backgroundColor: "var(--background)", minHeight: "320px" }}
              >
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 31px, var(--foreground) 31px, var(--foreground) 32px), repeating-linear-gradient(90deg, transparent, transparent 31px, var(--foreground) 31px, var(--foreground) 32px)",
                  }}
                />
                <div className="relative text-center px-4">
                  <p className="text-4xl md:text-5xl font-heading font-medium italic mb-2" style={{ color: "var(--foreground)" }}>
                    Maison Aldéric{" "}
                    <span style={{ color: "var(--accent)" }}>&amp; Associés</span>
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                    Cabinet d&apos;avocats d&apos;affaires — Cabinet démo LawyerOS
                  </p>
                </div>
                <Link
                  href="/portail-avocat?__tenant=maison-alderic"
                  className="los-btn-accent relative rounded-sm px-6 py-3 text-sm font-medium"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Ouvrir le portail démo →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── CTA FINAL ─────────────── */}
        <section className="py-24 px-6 md:px-12 lg:px-20 text-center" style={{ backgroundColor: "var(--foreground)" }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-medium tracking-tight" style={{ color: "#ffffff" }}>
              Votre cabinet mérite mieux qu&apos;un email.
            </h2>
            <p className="mt-4 text-lg" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-body)" }}>
              Rejoignez les cabinets qui ont choisi de professionnaliser leur relation client.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link href="/signup" className="los-btn-accent rounded-sm px-6 py-3.5 text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>
                Commencer — 14 jours gratuits
              </Link>
              <Link href="/connexion" className="los-btn-ghost-dark rounded-sm px-6 py-3.5 text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>
                J&apos;ai déjà un compte
              </Link>
            </div>
          </div>
        </section>

        {/* ─────────────── FOOTER ─────────────── */}
        <footer className="border-t px-6 md:px-12 lg:px-20 py-12" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-base font-heading font-medium" style={{ color: "var(--foreground)" }}>
                Lawyer<span style={{ color: "var(--accent)" }}>OS</span>
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                by Kayo Agency
              </span>
            </div>

            <nav className="flex flex-wrap gap-5 justify-center">
              {[
                { href: "/cgv", label: "CGV" },
                { href: "/mentions-legales", label: "Mentions légales" },
                { href: "/confidentialite", label: "Confidentialité" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="los-footer-link text-xs" style={{ fontFamily: "var(--font-body)" }}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <p className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              © 2026 LawyerOS by Kayo Agency
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}
