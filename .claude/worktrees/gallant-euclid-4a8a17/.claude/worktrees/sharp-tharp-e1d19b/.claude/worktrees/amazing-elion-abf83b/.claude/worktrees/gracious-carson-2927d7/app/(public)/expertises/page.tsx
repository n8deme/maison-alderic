import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Expertises — Maison Aldéric & Associés",
  description:
    "Fusions & Acquisitions, Private Equity, Contentieux des affaires, Droit fiscal international : quatre pôles d'excellence au service de vos opérations stratégiques.",
};

const expertises = [
  {
    id: "ma",
    label: "01",
    title: "Fusions & Acquisitions",
    tagline: "Structurer la complexité. Sécuriser la valeur.",
    description:
      "Nous accompagnons acquéreurs, cédants et cibles dans les opérations de M&A les plus exigeantes — du LBO transfrontalier à la cession de filiale, en passant par les joint-ventures stratégiques. Notre équipe maîtrise l'intégralité du cycle transactionnel : due diligence juridique, structuration, négociation, documentation et closing.",
    services: [
      "Due diligence juridique & fiscale",
      "Structuration d'acquisitions et de cessions",
      "Négociation et rédaction des SPA, SHA et ancillary agreements",
      "Opérations transfrontalières (BE, FR, LU, NL)",
      "Carve-outs, spin-offs et scissions",
      "Garanties de passif et mécanismes d'earn-out",
      "Post-closing & intégration juridique",
    ],
    bg: "var(--surface)",
  },
  {
    id: "pe",
    label: "02",
    title: "Private Equity",
    tagline: "La rigueur du fond. La vitesse du marché.",
    description:
      "Nous conseillons fonds d'investissement, family offices et co-investisseurs à chaque étape du cycle de vie d'un investissement — de la structuration du fonds à l'exit. Notre pratique couvre l'ensemble des stratégies : buyout, growth, venture et secondaires. Nous connaissons les contraintes des GPs comme celles des LPs.",
    services: [
      "Structuration de fonds et de véhicules d'investissement",
      "Négociation des term sheets et investment agreements",
      "Management packages et ESOP",
      "Gouvernance et pactes d'actionnaires",
      "Transactions secondaires",
      "Exits : IPO, trade sale, secondary buyout",
      "Réglementaire AIFMD & compliance",
    ],
    bg: "var(--surface-alt)",
  },
  {
    id: "contentieux",
    label: "03",
    title: "Contentieux des affaires",
    tagline: "Défendre. Arbitrer. Résoudre.",
    description:
      "Notre pôle contentieux intervient dans les litiges commerciaux, sociétaires et contractuels à fort enjeu. Nous plaidons devant les juridictions belges et représentons nos clients dans les procédures arbitrales internationales (ICC, CEPANI, SCC). La stratégie contentieuse fait partie intégrante de notre conseil transactionnel.",
    services: [
      "Litiges commerciaux et contractuels",
      "Contentieux sociétaires (actionnaires, dirigeants)",
      "Arbitrage international (ICC, CEPANI, ad hoc)",
      "Procédures de réorganisation judiciaire",
      "Responsabilité des dirigeants (D&O)",
      "Mesures conservatoires et procédures d'urgence",
      "Médiation et modes alternatifs de résolution",
    ],
    bg: "var(--surface)",
  },
  {
    id: "tax",
    label: "04",
    title: "Droit fiscal international",
    tagline: "Optimiser dans les règles. Anticiper les risques.",
    description:
      "Notre pratique fiscale accompagne entreprises multinationales et investisseurs dans la structuration de leurs flux transfrontaliers, l'optimisation de leurs holdings et la gestion de leurs risques fiscaux. Nous intervenons en conseil comme en contentieux fiscal, en étroite coordination avec nos partenaires fiscalistes locaux en Europe.",
    services: [
      "Structuration fiscale des acquisitions et holdings",
      "Prix de transfert et documentation OCDE",
      "TVA internationale et douanes",
      "Fiscalité des fonds d'investissement",
      "Ruling fiscal (SDA Belgique)",
      "Contentieux fiscal et procédures d'imposition",
      "Planification successorale internationale",
    ],
    bg: "var(--surface-alt)",
  },
];

export default function ExpertisesPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="pt-28 pb-20 md:pt-36 md:pb-28"
        style={{ backgroundColor: "var(--surface-alt)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <p
            className="text-xs font-medium tracking-widest uppercase mb-6"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
          >
            Nos expertises
          </p>
          <h1
            className="max-w-3xl"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
            }}
          >
            Quatre pôles d&apos;excellence.<br />
            <span style={{ fontStyle: "italic" }}>Une exigence commune.</span>
          </h1>
          <p
            className="mt-8 max-w-2xl"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.0625rem",
              color: "var(--text-secondary)",
              lineHeight: 1.75,
            }}
          >
            Maison Aldéric & Associés concentre son activité sur des domaines où
            la technicité juridique et la maîtrise stratégique font la
            différence. Nos équipes interviennent en conseil et en contentieux,
            en Belgique et à l&apos;international.
          </p>
        </div>
      </section>

      {/* Expertise sections */}
      {expertises.map((exp) => (
        <section
          key={exp.id}
          id={exp.id}
          className="py-16 md:py-24 scroll-mt-20"
          style={{ backgroundColor: exp.bg }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
              {/* Left — description */}
              <div>
                <p
                  className="text-xs font-medium tracking-widest uppercase mb-6"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--text-muted)",
                  }}
                >
                  {exp.label}
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    color: "var(--text-primary)",
                  }}
                >
                  {exp.title}
                </h2>
                <p
                  className="mt-4"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontStyle: "italic",
                    fontSize: "1.0625rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {exp.tagline}
                </p>
                <p
                  className="mt-6"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.8,
                  }}
                >
                  {exp.description}
                </p>
                <Link
                  href="/contact"
                  className="inline-block mt-10 text-xs font-medium tracking-widest uppercase px-5 py-2.5 transition-colors"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--bordeaux)",
                    border: "1px solid var(--bordeaux)",
                  }}
                >
                  Nous consulter
                </Link>
              </div>

              {/* Right — services */}
              <div
                className="pt-2 lg:pt-14"
                style={{
                  borderLeft: "1px solid var(--border)",
                  paddingLeft: "clamp(1.5rem, 3vw, 3rem)",
                }}
              >
                <p
                  className="text-xs font-medium tracking-widest uppercase mb-6"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--text-muted)",
                  }}
                >
                  Domaines d&apos;intervention
                </p>
                <ul className="space-y-4">
                  {exp.services.map((service) => (
                    <li
                      key={service}
                      className="flex items-start gap-3"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.9375rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                      }}
                    >
                      <span
                        className="mt-2 shrink-0 w-1 h-1 rounded-full"
                        style={{ backgroundColor: "var(--bordeaux)" }}
                      />
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA finale */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: "var(--text-primary)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center">
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontStyle: "italic",
              fontSize: "clamp(1.25rem, 2.5vw, 1.875rem)",
              color: "rgba(248,247,244,0.9)",
              lineHeight: 1.4,
            }}
          >
            Une opération complexe. Des enjeux élevés.
          </p>
          <p
            className="mt-3"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "rgba(248,247,244,0.55)",
            }}
          >
            Nos associés sont disponibles pour une première consultation confidentielle.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-10 text-xs font-medium tracking-widest uppercase px-6 py-3 transition-colors"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--background)",
              border: "1px solid rgba(248,247,244,0.4)",
            }}
          >
            Prendre contact
          </Link>
        </div>
      </section>
    </>
  );
}
