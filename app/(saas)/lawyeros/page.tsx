import type { Metadata } from "next";
import Link from "next/link";
import { PricingSection } from "./pricing-section";
import { LawyerosHero } from "./lawyeros-hero";
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

const FEATURES = [
  {
    title: "Portail client white-label",
    description: "Votre cabinet, votre marque. Chaque client accède à un portail personnalisé sous votre identité visuelle.",
    icon: "M3 6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6z M3 10h18",
  },
  {
    title: "Dossiers & timeline",
    description: "Suivez chaque affaire en temps réel. Timeline des événements, pièces jointes, statuts et équipe assignée.",
    icon: "M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z M8 7V5m8 2V5 M3 11h18",
  },
  {
    title: "Messagerie sécurisée",
    description: "Échanges chiffrés entre avocat et client directement dans le portail. Fini les emails sensibles perdus.",
    icon: "M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369.229.017.431.122.562.297l1.688 2.353 1.688-2.353a.75.75 0 01.562-.297 47.78 47.78 0 003.293-.37c1.584-.232 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z",
  },
  {
    title: "Facturation Stripe",
    description: "Émettez des factures professionnelles et encaissez en ligne. Stripe intégré, TVA belge et française incluse.",
    icon: "M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z",
  },
  {
    title: "Prise de notes IA",
    description: "Résumez une audience, dictez une note, générez un mémo. L'IA travaille pour vous, pas le contraire.",
    icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z",
  },
  {
    title: "Conflits d'intérêts",
    description: "Vérifiez chaque nouveau client en quelques secondes. Moteur de détection automatique sur toute votre base.",
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  },
];

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
        .los-feature-card { background-color: var(--surface); border: 1px solid var(--border); transition: box-shadow 200ms; }
        .los-feature-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
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
        <section id="fonctionnalites" className="py-32 md:py-40 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <p className="text-xs uppercase tracking-widest font-medium mb-4" style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}>
                Fonctionnalités
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-medium tracking-tight max-w-xl" style={{ color: "var(--foreground)" }}>
                Tout ce dont un cabinet moderne a besoin.
              </h2>
              <p className="mt-4 text-lg max-w-xl" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                Conçu par des juristes, pour des juristes. Chaque fonctionnalité répond à un vrai besoin terrain.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="los-feature-card rounded-sm p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-sm"
                    style={{ backgroundColor: "rgba(122,31,43,0.08)", color: "var(--accent)" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d={feature.icon} />
                    </svg>
                  </div>
                  <h3 className="text-base font-medium" style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}>
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
