import { Reveal } from "./reveal";

const PILIERS = [
  {
    kicker: "01",
    title: "Stratégie d'abord",
    description:
      "Avant tout conseil juridique, une analyse stratégique. Comprendre l'opération, son contexte, ses enjeux, et structurer le droit pour servir l'objectif.",
    size: "large" as const,
  },
  {
    kicker: "02",
    title: "Une équipe restreinte, jamais sous-traitée",
    description:
      "Les associés sont en première ligne sur chaque dossier. Pas de pyramide juridique anonyme. Le partenaire que vous rencontrez est celui qui pilote.",
    size: "small" as const,
  },
  {
    kicker: "03",
    title: "Coordination internationale",
    description:
      "Membre du réseau Lex Mundi. Coordination directe avec les meilleurs cabinets indépendants à Paris, Londres, Amsterdam, Genève, New York.",
    size: "small" as const,
  },
];

export function HomeNotreApproche() {
  return (
    <Reveal>
      <section
        className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-32"
        style={{ backgroundColor: "var(--surface-alt)" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16 md:mb-20">
            <span
              className="block text-xs font-medium tracking-widest uppercase mb-4"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
            >
              Notre approche
            </span>
            <h2
              className="text-4xl md:text-5xl max-w-3xl"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
                lineHeight: 1.1,
              }}
            >
              Trois principes qui définissent notre manière d'exercer.
            </h2>
          </div>

          {/* Bento asymétrique : large (2/3) + 2 petits empilés (1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Pilier 1 — large, col-span-2 en desktop */}
            <div
              className="lg:col-span-2 lg:row-span-2 p-8 md:p-12 flex flex-col justify-between min-h-[400px]"
              style={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
              }}
            >
              <span
                className="text-xs font-medium tracking-widest"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--bordeaux)",
                }}
              >
                {PILIERS[0].kicker}
              </span>
              <div>
                <h3
                  className="text-3xl md:text-4xl mb-6"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    color: "var(--text-primary)",
                    lineHeight: 1.15,
                  }}
                >
                  {PILIERS[0].title}
                </h3>
                <p
                  className="text-base md:text-lg max-w-lg"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  {PILIERS[0].description}
                </p>
              </div>
            </div>

            {/* Pilier 2 — petit, en haut à droite */}
            <div
              className="p-8 flex flex-col justify-between min-h-[190px]"
              style={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
              }}
            >
              <span
                className="text-xs font-medium tracking-widest"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--bordeaux)",
                }}
              >
                {PILIERS[1].kicker}
              </span>
              <div>
                <h3
                  className="text-xl md:text-2xl mb-3"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    color: "var(--text-primary)",
                    lineHeight: 1.2,
                  }}
                >
                  {PILIERS[1].title}
                </h3>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {PILIERS[1].description}
                </p>
              </div>
            </div>

            {/* Pilier 3 — petit, en bas à droite */}
            <div
              className="p-8 flex flex-col justify-between min-h-[190px]"
              style={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
              }}
            >
              <span
                className="text-xs font-medium tracking-widest"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--bordeaux)",
                }}
              >
                {PILIERS[2].kicker}
              </span>
              <div>
                <h3
                  className="text-xl md:text-2xl mb-3"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    color: "var(--text-primary)",
                    lineHeight: 1.2,
                  }}
                >
                  {PILIERS[2].title}
                </h3>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {PILIERS[2].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}