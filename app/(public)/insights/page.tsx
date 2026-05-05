import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDateFr } from "@/lib/format-date";

export const metadata: Metadata = {
  title: "Insights — Maison Aldéric & Associés",
  description:
    "Analyses juridiques, perspectives réglementaires et éclairages stratégiques par les associés de Maison Aldéric & Associés.",
};

interface Insight {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  reading_time_minutes: number | null;
  published_at: string;
  author: {
    full_name: string;
    title: string;
  } | null;
}

const categoryLabels: Record<string, string> = {
  ma: "M&A",
  pe: "Private Equity",
  contentieux: "Contentieux",
  tax: "Fiscalité",
  regulatory: "Réglementaire",
  market: "Marché",
};

export default async function InsightsPage() {
  const supabase = await createClient();

  const { data: insights } = await supabase
    .from("insights")
    .select(`
      id, title, slug, excerpt, category, reading_time_minutes, published_at,
      author:avocats ( full_name, title )
    `)
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const items = (insights ?? []) as unknown as Insight[];
  const featured = items.slice(0, 1);
  const grid = items.slice(1);

  return (
    <>
      {/* Hero */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: "var(--surface-alt)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <p
            className="text-xs font-medium tracking-widest uppercase mb-6"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
          >
            Insights
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
            }}
          >
            Perspectives juridiques.<br />
            <span style={{ fontStyle: "italic" }}>Points de vue d&apos;associés.</span>
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
            Nos associés partagent leurs analyses sur les évolutions législatives,
            les tendances de marché et les questions juridiques qui façonnent
            l&apos;environnement des affaires en Belgique et en Europe.
          </p>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="py-16 md:py-24" style={{ backgroundColor: "var(--surface)" }}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <Link href={`/insights/${featured[0].slug}`} className="group block">
              <div
                className="grid grid-cols-1 lg:grid-cols-2 gap-0"
                style={{ border: "1px solid var(--border)" }}
              >
                <div
                  className="hidden lg:block"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    minHeight: "360px",
                    borderRight: "1px solid var(--border)",
                  }}
                />
                <div className="p-10 md:p-14">
                  <div className="flex items-center gap-3 mb-6">
                    <span
                      className="text-xs font-medium tracking-widest uppercase px-2 py-0.5"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--bordeaux)",
                        border: "1px solid var(--bordeaux)",
                      }}
                    >
                      {categoryLabels[featured[0].category] ?? featured[0].category}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8125rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {featured[0].reading_time_minutes ?? 8} min
                    </span>
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      fontSize: "clamp(1.375rem, 2vw, 1.875rem)",
                      lineHeight: 1.2,
                      letterSpacing: "-0.02em",
                      color: "var(--text-primary)",
                    }}
                  >
                    {featured[0].title}
                  </h2>
                  <p
                    className="mt-5"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9375rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.75,
                    }}
                  >
                    {featured[0].excerpt}
                  </p>
                  <div className="mt-8 flex items-center justify-between">
                    {featured[0].author && (
                      <div>
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.875rem",
                            color: "var(--text-primary)",
                            fontWeight: 500,
                          }}
                        >
                          {featured[0].author.full_name}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.8125rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {formatDateFr(featured[0].published_at)}
                        </p>
                      </div>
                    )}
                    <span
                      className="text-xs font-medium tracking-widest uppercase"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--bordeaux)",
                      }}
                    >
                      Lire →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Grid */}
      {grid.length > 0 && (
        <section className="py-16 md:py-24" style={{ backgroundColor: "var(--surface-alt)" }}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {grid.map((insight: Insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  return (
    <Link href={`/insights/${insight.slug}`} className="group flex flex-col">
      <div
        className="w-full mb-6"
        style={{
          aspectRatio: "16/9",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      />
      <div className="flex items-center gap-3 mb-4">
        <span
          className="text-xs font-medium tracking-widest uppercase px-2 py-0.5"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--bordeaux)",
            border: "1px solid var(--bordeaux)",
          }}
        >
          {categoryLabels[insight.category] ?? insight.category}
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: "var(--text-muted)",
          }}
        >
          {insight.reading_time_minutes ?? 8} min
        </span>
      </div>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "1.125rem",
          color: "var(--text-primary)",
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
        }}
      >
        {insight.title}
      </p>
      <p
        className="mt-3 flex-1"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--text-secondary)",
          lineHeight: 1.7,
        }}
      >
        {insight.excerpt}
      </p>
      <div className="mt-5 flex items-center justify-between">
        {insight.author && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
            }}
          >
            {insight.author.full_name} · {formatDateFr(insight.published_at)}
          </p>
        )}
        <span
          className="text-xs font-medium"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--bordeaux)",
          }}
        >
          Lire →
        </span>
      </div>
    </Link>
  );
}
