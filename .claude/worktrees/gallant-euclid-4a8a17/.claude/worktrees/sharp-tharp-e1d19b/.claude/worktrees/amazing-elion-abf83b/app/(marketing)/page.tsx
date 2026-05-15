"use client";

import { useState } from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const FEATURES = [
  {
    title: "Portail client white-label",
    description:
      "Vos clients accèdent à un espace sécurisé à votre image — votre logo, vos couleurs, votre domaine. Zéro branding LawyerOS visible côté client.",
    icon: "◈",
  },
  {
    title: "Gestion des dossiers",
    description:
      "Timeline interactive, statuts en temps réel, documents liés. Vos clients suivent l'avancement de leur dossier sans vous appeler.",
    icon: "◉",
  },
  {
    title: "Messagerie sécurisée",
    description:
      "Échanges chiffrés par dossier, notifications email automatiques, historique complet. Fini les fils de mails éparpillés.",
    icon: "◎",
  },
  {
    title: "Facturation intégrée",
    description:
      "Devis, factures, paiement en ligne par carte. Relances automatiques à J+7, J+14 et J+21 avec mise en demeure. Votre trésorerie se pilote seule.",
    icon: "◇",
  },
  {
    title: "Prise de rendez-vous",
    description:
      "Calendrier en ligne, rappels SMS automatiques J-2 et J-1, synchronisation Google Calendar. Plus de no-shows.",
    icon: "◐",
  },
  {
    title: "Automatisations n8n",
    description:
      "Génération de mandats PDF, onboarding client automatisé, workflows sur mesure. Ce qui prend 2h devient 2 secondes.",
    icon: "◑",
  },
] as const;

const PLANS_MONTHLY = [
  {
    id: "solo",
    name: "Solo",
    price: 79,
    period: "/mois",
    description: "Pour l'avocat indépendant.",
    features: [
      "1 avocat",
      "10 dossiers actifs",
      "Portail client",
      "Messagerie sécurisée",
      "Facturation de base",
      "Support email",
    ],
    cta: "Démarrer",
    highlight: false,
  },
  {
    id: "cabinet",
    name: "Cabinet",
    price: 199,
    period: "/mois",
    description: "Pour les cabinets en croissance.",
    features: [
      "Jusqu'à 5 avocats",
      "Dossiers illimités",
      "Signature électronique",
      "Formulaires intake",
      "Rappels SMS automatiques",
      "Support prioritaire",
    ],
    cta: "Choisir Cabinet",
    highlight: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 399,
    period: "/mois",
    description: "Pour les structures ambitieuses.",
    features: [
      "Avocats illimités",
      "IA résumés de dossiers",
      "Domaine personnalisé",
      "Automatisations avancées",
      "Intégration Stripe complète",
      "Support dédié 24/7",
    ],
    cta: "Choisir Premium",
    highlight: false,
  },
] as const;

const FAQ = [
  {
    q: "Mes données et celles de mes clients sont-elles en sécurité ?",
    a: "Oui. Toutes les données sont hébergées en Union européenne (Frankfurt, Allemagne) sur des serveurs certifiés ISO 27001. Les échanges sont chiffrés TLS 1.3. Chaque cabinet est isolé — il est techniquement impossible pour un cabinet d'accéder aux données d'un autre.",
  },
  {
    q: "LawyerOS est-il conforme au RGPD ?",
    a: "Absolument. Nous sommes sous-traitant au sens de l'article 28 du RGPD. Nous signons un DPA (Data Processing Agreement) avec chaque cabinet. Vos clients peuvent exercer leurs droits directement depuis leur portail. Nos CGV et politique de confidentialité sont rédigées en droit belge.",
  },
  {
    q: "Puis-je utiliser mon propre nom de domaine pour le portail client ?",
    a: "Oui, dès le plan Premium. Vos clients accèdent à portail.votre-cabinet.be — zéro trace LawyerOS. Sur les plans Solo et Cabinet, le portail est accessible via votre-cabinet.lawyeros.be.",
  },
  {
    q: "Comment fonctionne la période d'essai ?",
    a: "14 jours gratuits, sans carte bancaire, sans engagement. Vous avez accès à toutes les fonctionnalités du plan Cabinet. À l'issue de l'essai, vous choisissez votre plan ou vous résiliez — sans aucune démarche.",
  },
  {
    q: "Puis-je migrer depuis un autre logiciel ?",
    a: "Oui. Notre outil d'import CSV permet de créer vos clients et dossiers en masse en quelques minutes. Notre équipe accompagne gratuitement les migrations depuis Clio, MyCase ou tout autre outil sur demande (plans Cabinet et Premium).",
  },
] as const;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function MarketingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <SocialProofSection />
      <FaqSection />
      <CtaFooterSection />
    </>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function HeroSection() {
  return (
    <section className="py-32 md:py-40 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <p
            className="text-xs font-medium uppercase tracking-widest mb-6"
            style={{ color: "var(--accent)" }}
          >
            Pour les cabinets d'avocats
          </p>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-heading font-medium tracking-tight leading-[1.05] mb-8"
            style={{ color: "var(--foreground)" }}
          >
            Le portail client
            <br />
            que vos clients{" "}
            <em
              className="not-italic"
              style={{ color: "var(--accent)" }}
            >
              méritent.
            </em>
          </h1>
          <p
            className="text-lg md:text-xl leading-relaxed mb-10 max-w-2xl"
            style={{ color: "var(--text-secondary)" }}
          >
            Dossiers, messagerie sécurisée, facturation, rendez-vous et
            automatisations — dans un portail white-label à l'image de votre
            cabinet. Vos clients ont enfin l'expérience qu'ils attendent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-medium rounded-sm transition-colors"
              style={{ backgroundColor: "var(--accent)", color: "#ffffff" }}
            >
              Essayer 14 jours gratuit
            </Link>
            <Link
              href="/#features"
              className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-medium rounded-sm border transition-colors"
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
                backgroundColor: "transparent",
              }}
            >
              Voir les fonctionnalités
            </Link>
          </div>
          <p className="mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
            Sans carte bancaire · Sans engagement · Résiliation en un clic
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Features
// ---------------------------------------------------------------------------

function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-32 md:py-40 px-6 md:px-12 lg:px-20"
      style={{ backgroundColor: "var(--surface-alt)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <p
            className="text-xs font-medium uppercase tracking-widest mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            Fonctionnalités
          </p>
          <h2
            className="text-4xl md:text-5xl font-heading font-medium tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Tout ce dont votre cabinet a besoin. Rien de plus.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-sm border p-8"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <span
                className="text-2xl block mb-5"
                style={{ color: "var(--accent)" }}
              >
                {feature.icon}
              </span>
              <h3
                className="text-lg font-heading font-medium tracking-tight mb-3"
                style={{ color: "var(--foreground)" }}
              >
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const discount = 0.8;

  return (
    <section
      id="pricing"
      className="py-32 md:py-40 px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-4">
          <p
            className="text-xs font-medium uppercase tracking-widest mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            Tarifs
          </p>
          <h2
            className="text-4xl md:text-5xl font-heading font-medium tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Transparent. Sans surprise.
          </h2>
        </div>

        {/* Toggle mensuel/annuel */}
        <div className="flex items-center gap-4 mb-12">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className="text-sm font-medium transition-colors"
            style={{ color: !annual ? "var(--foreground)" : "var(--text-muted)" }}
          >
            Mensuel
          </button>
          <button
            type="button"
            onClick={() => setAnnual(!annual)}
            className="relative h-6 w-11 rounded-full transition-colors"
            style={{ backgroundColor: annual ? "var(--foreground)" : "var(--border)" }}
          >
            <span
              className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200"
              style={{ left: annual ? "calc(100% - 22px)" : "2px" }}
            />
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className="text-sm font-medium flex items-center gap-2 transition-colors"
            style={{ color: annual ? "var(--foreground)" : "var(--text-muted)" }}
          >
            Annuel
            <span
              className="text-xs px-2 py-0.5 rounded-sm font-medium"
              style={{ backgroundColor: "var(--surface-alt)", color: "var(--accent)" }}
            >
              -20%
            </span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS_MONTHLY.map((plan) => {
            const price = annual
              ? Math.round(plan.price * discount)
              : plan.price;

            return (
              <div
                key={plan.id}
                className="rounded-sm border p-8 flex flex-col"
                style={{
                  backgroundColor: plan.highlight ? "var(--foreground)" : "var(--surface)",
                  borderColor: plan.highlight ? "var(--foreground)" : "var(--border)",
                }}
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className="text-lg font-heading font-medium tracking-tight"
                      style={{ color: plan.highlight ? "#ffffff" : "var(--foreground)" }}
                    >
                      {plan.name}
                    </h3>
                    {plan.highlight && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-sm font-medium"
                        style={{ backgroundColor: "var(--accent)", color: "#ffffff" }}
                      >
                        Recommandé
                      </span>
                    )}
                  </div>
                  <p
                    className="text-sm mb-4"
                    style={{ color: plan.highlight ? "rgba(255,255,255,0.65)" : "var(--text-secondary)" }}
                  >
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-4xl font-heading font-medium tracking-tight"
                      style={{ color: plan.highlight ? "#ffffff" : "var(--foreground)" }}
                    >
                      {price} €
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: plan.highlight ? "rgba(255,255,255,0.65)" : "var(--text-muted)" }}
                    >
                      /mois{annual ? " · facturé annuellement" : ""}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-sm"
                      style={{ color: plan.highlight ? "rgba(255,255,255,0.85)" : "var(--text-secondary)" }}
                    >
                      <span style={{ color: plan.highlight ? "rgba(255,255,255,0.5)" : "var(--accent)" }}>
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className="w-full text-center py-3 text-sm font-medium rounded-sm transition-colors"
                  style={
                    plan.highlight
                      ? { backgroundColor: "var(--accent)", color: "#ffffff" }
                      : { backgroundColor: "var(--foreground)", color: "#ffffff" }
                  }
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-sm text-center" style={{ color: "var(--text-muted)" }}>
          Tous les plans incluent 14 jours d'essai gratuit. Aucune carte requise.
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Social proof
// ---------------------------------------------------------------------------

function SocialProofSection() {
  return (
    <section
      className="py-32 md:py-40 px-6 md:px-12 lg:px-20"
      style={{ backgroundColor: "var(--surface-alt)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p
            className="text-xs font-medium uppercase tracking-widest mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            Ils font confiance à LawyerOS
          </p>
          <h2
            className="text-4xl md:text-5xl font-heading font-medium tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Des cabinets qui ont exigence pour leurs clients.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div
            className="rounded-sm border p-8"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <blockquote
              className="text-lg font-heading font-medium italic leading-relaxed mb-6"
              style={{ color: "var(--foreground)" }}
            >
              « Nos clients ont arrêté d'appeler pour "savoir où ça en est". Ils voient tout en temps réel dans leur portail. »
            </blockquote>
            <div className="flex items-center gap-4">
              <div
                className="h-10 w-10 rounded-sm flex items-center justify-center text-sm font-medium text-white"
                style={{ backgroundColor: "var(--foreground)" }}
              >
                AV
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                  Aldéric Vermeulen
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Associé fondateur · Maison Aldéric & Associés
                </p>
              </div>
            </div>
          </div>

          <div
            className="rounded-sm border p-8"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <blockquote
              className="text-lg font-heading font-medium italic leading-relaxed mb-6"
              style={{ color: "var(--foreground)" }}
            >
              « La facturation automatisée nous fait gagner 3h par semaine. Les relances se font toutes seules. »
            </blockquote>
            <div className="flex items-center gap-4">
              <div
                className="h-10 w-10 rounded-sm flex items-center justify-center text-sm font-medium text-white"
                style={{ backgroundColor: "var(--foreground)" }}
              >
                SB
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                  Sophie de Borchgrave
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Associée fondatrice · Maison Aldéric & Associés
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-12 max-w-4xl mx-auto rounded-sm border p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div>
            <p
              className="text-sm font-medium uppercase tracking-widest mb-1"
              style={{ color: "var(--text-muted)" }}
            >
              Client de référence
            </p>
            <p
              className="text-xl font-heading font-medium tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              Maison Aldéric & Associés
            </p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Cabinet d'avocats d'affaires · Avenue Louise 480, Bruxelles · Depuis 2026
            </p>
          </div>
          <div className="flex gap-8">
            {[
              { value: "5", label: "avocats" },
              { value: "47", label: "clients actifs" },
              { value: "100%", label: "portail adopté" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p
                  className="text-2xl font-heading font-medium tracking-tight"
                  style={{ color: "var(--accent)" }}
                >
                  {value}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="py-32 md:py-40 px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <p
            className="text-xs font-medium uppercase tracking-widest mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            Questions fréquentes
          </p>
          <h2
            className="text-4xl md:text-5xl font-heading font-medium tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Vous avez des questions. Voici les réponses.
          </h2>
        </div>

        <div className="max-w-3xl divide-y" style={{ borderColor: "var(--border)" }}>
          {FAQ.map((item, i) => (
            <div key={i} className="py-6">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 text-left"
              >
                <span
                  className="text-base font-medium leading-snug"
                  style={{ color: "var(--foreground)" }}
                >
                  {item.q}
                </span>
                <span
                  className="shrink-0 text-lg transition-transform duration-200"
                  style={{
                    color: "var(--text-muted)",
                    transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  +
                </span>
              </button>
              {open === i && (
                <p
                  className="mt-4 text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CTA final
// ---------------------------------------------------------------------------

function CtaFooterSection() {
  return (
    <section
      className="py-32 md:py-40 px-6 md:px-12 lg:px-20"
      style={{ backgroundColor: "var(--foreground)" }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-heading font-medium tracking-tight mb-6 text-white"
        >
          Votre portail est prêt en 10 minutes.
        </h2>
        <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
          Créez votre compte, configurez votre cabinet, invitez vos premiers clients. Aucune carte bancaire requise.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium rounded-sm transition-colors"
          style={{ backgroundColor: "var(--accent)", color: "#ffffff" }}
        >
          Commencer l'essai gratuit
        </Link>
        <p className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          14 jours gratuits · Sans engagement · RGPD conforme
        </p>
      </div>
    </section>
  );
}
