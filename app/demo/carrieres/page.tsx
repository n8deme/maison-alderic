import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/public/reveal";

export const metadata: Metadata = {
  title: "Carrières — Maison Aldéric & Associés",
  description:
    "Rejoignez Maison Aldéric & Associés. Nous recrutons des juristes d'affaires de talent prêts à intervenir sur les opérations qui définissent une trajectoire.",
};

export default function CarriersPage() {
  return (
    <>
      {/* Hero */}
      <Reveal>
        <section
          className="py-24 md:py-32"
          style={{ backgroundColor: "var(--surface-alt)" }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <p
              className="text-xs font-medium tracking-widest uppercase mb-6"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
            >
              Rejoindre la maison
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
              Construire votre carrière dans un cabinet d&apos;exception.
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
              Maison Aldéric recrute des juristes d&apos;affaires de talent, prêts à intervenir sur les opérations qui définissent une trajectoire. Nous croyons en l&apos;excellence technique, la progression individualisée, et l&apos;équilibre professionnel.
            </p>
          </div>
        </section>
      </Reveal>

      {/* Ce que nous offrons */}
      <Reveal>
        <section className="py-32 md:py-40" style={{ backgroundColor: "var(--surface)" }}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <p
              className="text-xs font-medium tracking-widest uppercase mb-14"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
            >
              Ce que nous offrons
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                {
                  title: "Excellence technique",
                  description:
                    "Des dossiers stratégiques au cœur de vos spécialités. Des équipes seniors qui forment. Des standards exigeants qui développent l'expertise.",
                },
                {
                  title: "Trajectoire individualisée",
                  description:
                    "Un plan de progression personnalisé, du Senior Associate à l'Associé. Des responsabilités croissantes alignées sur vos objectifs.",
                },
                {
                  title: "International",
                  description:
                    "Bruxelles est notre base, mais nos dossiers se traitent à Paris, Londres, Luxembourg, New York. Une plateforme pour opérer à l'échelle de vos ambitions.",
                },
                {
                  title: "Équilibre",
                  description:
                    "La rigueur n'exclut pas la qualité de vie. Nos équipes gèrent des dossiers exigeants sans compromettre leur bien-être et leurs projets personnels.",
                },
              ].map((item) => (
                <div key={item.title} className="space-y-3">
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      fontSize: "1.25rem",
                      letterSpacing: "-0.01em",
                      color: "var(--text-primary)",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "1rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Profils recherchés */}
      <Reveal>
        <section className="py-32 md:py-40" style={{ backgroundColor: "var(--surface-alt)" }}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <p
              className="text-xs font-medium tracking-widest uppercase mb-14"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
            >
              Profils recherchés
            </p>
            <div className="max-w-3xl space-y-6">
              {[
                {
                  title: "Associate (3–5 ans)",
                  description:
                    "Spécialisé en M&A, Private Equity, Fiscalité ou Contentieux. Formation juridique solide, première expérience en cabinet reconnu ou in-house. Anglais courant.",
                },
                {
                  title: "Senior Associate (5–8 ans)",
                  description:
                    "Spécialisation marquée. Capacité à manager des juniors et piloter des workstreams. Vision à long terme sur une practice area.",
                },
                {
                  title: "Counsel (8+ ans)",
                  description:
                    "Profil senior prêt à structurer une practice. Réseau client, expertise reconnue, et appétit pour le développement d'une équipe.",
                },
                {
                  title: "Stagiaires & LLM",
                  description:
                    "Étudiants en Master 2 ou LLM. Curiosité intellectuelle, sérieux méthodologique, et envie de découvrir le droit des affaires en vrai.",
                },
              ].map((profile) => (
                <div
                  key={profile.title}
                  className="rounded-sm border border-border bg-surface p-6"
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      fontSize: "1.125rem",
                      letterSpacing: "-0.01em",
                      color: "var(--text-primary)",
                    }}
                  >
                    {profile.title}
                  </h3>
                  <p
                    className="mt-2"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "1rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {profile.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Candidature spontanée */}
      <Reveal>
        <section className="py-32 md:py-40" style={{ backgroundColor: "var(--surface)" }}>
          <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20">
            <div className="rounded-sm border border-border bg-surface-alt p-8 md:p-12 space-y-6">
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontSize: "1.875rem",
                    letterSpacing: "-0.02em",
                    color: "var(--text-primary)",
                  }}
                >
                  Candidature spontanée
                </h2>
                <p
                  className="mt-4"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "1.0625rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.75,
                  }}
                >
                  Nous étudions toutes les candidatures spontanées avec attention. Si vous sentez que votre profil et vos ambitions correspondent à nos valeurs et nos besoins, envoyez-nous votre CV et une lettre de motivation à{" "}
                  <a
                    href="mailto:carrieres@maison-alderic.be"
                    className="text-bordeaux underline underline-offset-2 hover:text-bordeaux/80 transition-colors"
                  >
                    carrieres@maison-alderic.be
                  </a>{" "}
                  ou utilisez le formulaire ci-dessous.
                </p>
              </div>
              <div className="pt-4">
                <Link
                  href="/demo/contact?subject=Candidature spontanée Maison Aldéric"
                  className="inline-flex rounded-sm bg-bordeaux px-6 py-3 text-sm font-medium text-white transition-colors hover:opacity-90"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Nous écrire
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
