import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";
import { formatDateFr } from "@/lib/format-date";

export const metadata: Metadata = {
  title: "Maison Aldéric & Associés — Cabinet d'avocats d'affaires, Bruxelles",
  description:
    "Conseil juridique pour M&A, private equity, contentieux complexe et droit fiscal international. Avenue Louise, Bruxelles.",
  openGraph: {
    title: "Maison Aldéric & Associés",
    description: "Le droit comme architecture stratégique.",
    locale: "fr_BE",
    type: "website",
  },
};

const expertises = [
  {
    id: "ma",
    title: "Fusions & Acquisitions",
    desc: "Conseil buy-side et sell-side sur les transactions de toute taille, de la lettre d'intention au closing.",
  },
  {
    id: "pe",
    title: "Private Equity",
    desc: "LBO, growth equity, continuation funds et structuration de véhicules d'investissement.",
  },
  {
    id: "contentieux",
    title: "Contentieux",
    desc: "Arbitrage international CEPANI, ICC et LCIA. Contentieux commercial et droit pénal des affaires.",
  },
  {
    id: "tax",
    title: "Droit fiscal international",
    desc: "Structuration transfrontalière, Pilier 2 OCDE, prix de transfert et optimisation belgo-luxembourgeoise.",
  },
];

const chiffres = [
  { value: "240M€", label: "Opération M&A emblématique 2025" },
  { value: "8", label: "Avocats et collaborateurs" },
  { value: "2003", label: "Année de création du cabinet" },
];

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: deals }, { data: avocats }, { data: insights }] = await Promise.all([
    supabase
      .from("deals")
      .select("id, title, client_name, category, year, amount_label, is_featured, display_order")
      .eq("is_featured", true)
      .order("display_order")
      .limit(4),
    supabase
      .from("avocats")
      .select("id, full_name, title, expertises, is_founding_partner, display_order")
      .eq("is_founding_partner", true)
      .order("display_order")
      .limit(4),
    supabase
      .from("insights")
      .select("id, slug, title, excerpt, category, published_at, reading_time_minutes")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(3),
  ]);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="py-32 md:py-40 px-6 md:px-12 lg:px-20"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left */}
            <div className="space-y-8">
              <span
                className="text-xs font-medium tracking-widest uppercase"
                style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
              >
                Cabinet d'avocats d'affaires — Bruxelles
              </span>
              <h1
                className="text-5xl md:text-6xl"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                  lineHeight: 1.05,
                }}
              >
                Le droit comme architecture stratégique.
              </h1>
              <p
                className="text-lg max-w-lg"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                Conseil pour M&amp;A, private equity, contentieux complexe et droit fiscal
                international. Nous intervenons là où les enjeux définissent une trajectoire.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/contact"
                  className="inline-block px-6 py-3 text-sm font-medium transition-colors"
                  style={{
                    fontFamily: "var(--font-body)",
                    backgroundColor: "var(--text-primary)",
                    color: "var(--background)",
                  }}
                >
                  Prendre rendez-vous
                </Link>
                <Link
                  href="/expertises"
                  className="inline-block px-6 py-3 text-sm font-medium transition-colors"
                  style={{
                    fontFamily: "var(--font-body)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  Découvrir nos expertises
                </Link>
              </div>
            </div>

            {/* Right — chiffres */}
            <div className="space-y-0 border-l" style={{ borderColor: "var(--border)" }}>
              {chiffres.map((c, i) => (
                <div
                  key={i}
                  className="pl-10 py-8 border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <p
                    className="text-4xl mb-1"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      color: "var(--bordeaux)",
                    }}
                  >
                    {c.value}
                  </p>
                  <p
                    className="text-sm"
                    style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
                  >
                    {c.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Expertises ───────────────────────────────────────── */}
      <section
        className="py-32 md:py-40 px-6 md:px-12 lg:px-20"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-4">
            <span
              className="text-xs font-medium tracking-widest uppercase"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
            >
              Domaines d'intervention
            </span>
            <h2
              className="text-4xl"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
              }}
            >
              Nos expertises
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ backgroundColor: "var(--border)" }}>
            {expertises.map((e) => (
              <Link
                key={e.id}
                href={`/expertises#${e.id}`}
                className="block p-10 space-y-4 transition-colors group"
                style={{ backgroundColor: "var(--surface)" }}
              >
                <h3
                  className="text-xl group-hover:text-bordeaux transition-colors"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    color: "var(--text-primary)",
                  }}
                >
                  {e.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
                >
                  {e.desc}
                </p>
                <span
                  className="text-xs font-medium"
                  style={{ fontFamily: "var(--font-body)", color: "var(--bordeaux)" }}
                >
                  En savoir plus →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Deals notables ───────────────────────────────────── */}
      {deals && deals.length > 0 && (
        <section
          className="py-32 md:py-40 px-6 md:px-12 lg:px-20"
          style={{ backgroundColor: "var(--surface-alt)" }}
        >
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="flex items-end justify-between">
              <div className="space-y-4">
                <span
                  className="text-xs font-medium tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
                >
                  Transactions récentes
                </span>
                <h2
                  className="text-4xl"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    color: "var(--text-primary)",
                  }}
                >
                  Deals notables
                </h2>
              </div>
              <Link
                href="/deals"
                className="hidden md:inline text-sm"
                style={{ fontFamily: "var(--font-body)", color: "var(--bordeaux)" }}
              >
                Voir tous →
              </Link>
            </div>

            <div className="space-y-px" style={{ backgroundColor: "var(--border)" }}>
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-8"
                  style={{ backgroundColor: "var(--surface)" }}
                >
                  <div className="flex items-center gap-3 md:w-24 shrink-0">
                    <span
                      className="text-xs px-2 py-0.5"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--bordeaux)",
                        border: "1px solid var(--bordeaux)",
                      }}
                    >
                      {deal.category}
                    </span>
                    <span
                      className="text-xs"
                      style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
                    >
                      {deal.year}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-xs mb-1"
                      style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
                    >
                      {deal.client_name}
                    </p>
                    <p
                      className="text-base"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                      }}
                    >
                      {deal.title}
                    </p>
                  </div>
                  {deal.amount_label && (
                    <p
                      className="text-xl shrink-0"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 500,
                        color: "var(--bordeaux)",
                      }}
                    >
                      {deal.amount_label}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Associés fondateurs ──────────────────────────────── */}
      {avocats && avocats.length > 0 && (
        <section
          className="py-32 md:py-40 px-6 md:px-12 lg:px-20"
          style={{ backgroundColor: "var(--surface)" }}
        >
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="flex items-end justify-between">
              <div className="space-y-4">
                <span
                  className="text-xs font-medium tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
                >
                  Notre équipe
                </span>
                <h2
                  className="text-4xl"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    color: "var(--text-primary)",
                  }}
                >
                  Les associés fondateurs
                </h2>
              </div>
              <Link
                href="/associes"
                className="hidden md:inline text-sm"
                style={{ fontFamily: "var(--font-body)", color: "var(--bordeaux)" }}
              >
                Voir l'équipe →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {avocats.map((a) => (
                <Link
                  key={a.id}
                  href={`/associes/${slugify(a.full_name)}`}
                  className="group space-y-4"
                >
                  {/* Photo placeholder */}
                  <div
                    className="w-full aspect-square"
                    style={{ backgroundColor: "var(--surface-alt)" }}
                  />
                  <div>
                    <p
                      className="text-base"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                      }}
                    >
                      {a.full_name}
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
                    >
                      {a.title}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {(a.expertises as string[]).slice(0, 2).map((ex: string) => (
                        <span
                          key={ex}
                          className="text-xs px-2 py-0.5"
                          style={{
                            fontFamily: "var(--font-body)",
                            color: "var(--bordeaux)",
                            border: "1px solid var(--bordeaux)",
                          }}
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Insights récents ─────────────────────────────────── */}
      {insights && insights.length > 0 && (
        <section
          className="py-32 md:py-40 px-6 md:px-12 lg:px-20"
          style={{ backgroundColor: "var(--surface-alt)" }}
        >
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="flex items-end justify-between">
              <div className="space-y-4">
                <span
                  className="text-xs font-medium tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
                >
                  Analyses & perspectives
                </span>
                <h2
                  className="text-4xl"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    color: "var(--text-primary)",
                  }}
                >
                  Insights récents
                </h2>
              </div>
              <Link
                href="/insights"
                className="hidden md:inline text-sm"
                style={{ fontFamily: "var(--font-body)", color: "var(--bordeaux)" }}
              >
                Voir tous →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {insights.map((art) => (
                <Link
                  key={art.id}
                  href={`/insights/${art.slug}`}
                  className="group space-y-4 border p-8"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--surface)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs px-2 py-0.5"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--bordeaux)",
                        border: "1px solid var(--bordeaux)",
                      }}
                    >
                      {art.category}
                    </span>
                    {art.published_at && (
                      <span
                        className="text-xs"
                        style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
                      >
                        {formatDateFr(art.published_at)}
                      </span>
                    )}
                  </div>
                  <h3
                    className="text-lg leading-snug"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                    }}
                  >
                    {art.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed line-clamp-3"
                    style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
                  >
                    {art.excerpt}
                  </p>
                  <span
                    className="text-xs font-medium"
                    style={{ fontFamily: "var(--font-body)", color: "var(--bordeaux)" }}
                  >
                    Lire l'article →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA finale ───────────────────────────────────────── */}
      <section
        className="py-32 md:py-40 px-6 md:px-12 lg:px-20"
        style={{ backgroundColor: "var(--text-primary)" }}
      >
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2
            className="text-4xl md:text-5xl"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontStyle: "italic",
              color: "var(--background)",
              letterSpacing: "-0.02em",
            }}
          >
            Vous accompagner dans votre prochaine opération.
          </h2>
          <p
            className="text-lg"
            style={{ fontFamily: "var(--font-body)", color: "rgba(248,247,244,0.7)" }}
          >
            Conseil pour les opérations qui définissent une trajectoire.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 text-sm font-medium transition-colors"
            style={{
              fontFamily: "var(--font-body)",
              backgroundColor: "var(--background)",
              color: "var(--text-primary)",
            }}
          >
            Prendre contact
          </Link>
        </div>
      </section>
    </>
  );
}
