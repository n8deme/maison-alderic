import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { formatDateFr } from "@/lib/format-date";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface Insight {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  reading_time_min: number;
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

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("insights")
    .select("slug")
    .eq("is_published", true);
  return (data ?? []).map((i: { slug: string }) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("insights")
    .select("title, summary")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (!data) return { title: "Article introuvable" };
  return {
    title: `${data.title} — Maison Aldéric & Associés`,
    description: data.summary,
  };
}

export default async function InsightPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: insight } = await supabase
    .from("insights")
    .select(`
      id, title, slug, summary, content, category, reading_time_min, published_at,
      author:avocats ( full_name, title )
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!insight) notFound();

  const item = insight as unknown as Insight;

  const { data: related } = await supabase
    .from("insights")
    .select("id, title, slug, category, reading_time_min, published_at")
    .eq("is_published", true)
    .eq("category", item.category)
    .neq("slug", slug)
    .limit(3);

  return (
    <>
      {/* Hero */}
      <section
        className="py-16 md:py-24"
        style={{ backgroundColor: "var(--surface-alt)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 mb-10 text-xs font-medium tracking-widest uppercase"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
          >
            ← Insights
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span
              className="text-xs font-medium tracking-widest uppercase px-2 py-0.5"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--bordeaux)",
                border: "1px solid var(--bordeaux)",
              }}
            >
              {categoryLabels[item.category] ?? item.category}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                color: "var(--text-muted)",
              }}
            >
              {item.reading_time_min} min de lecture · {formatDateFr(item.published_at)}
            </span>
          </div>
          <h1
            className="max-w-3xl"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
            }}
          >
            {item.title}
          </h1>
          <p
            className="mt-6 max-w-2xl"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontStyle: "italic",
              fontSize: "1.0625rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}
          >
            {item.summary}
          </p>
          {item.author && (
            <div
              className="mt-10 pt-6 flex items-center gap-4"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <div
                className="w-10 h-10 shrink-0"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              />
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    color: "var(--text-primary)",
                    fontWeight: 500,
                  }}
                >
                  {item.author.full_name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    color: "var(--text-muted)",
                  }}
                >
                  {item.author.title}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Cover image placeholder */}
      <div
        className="w-full"
        style={{
          height: "clamp(200px, 35vw, 480px)",
          backgroundColor: "var(--surface)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      />

      {/* Article content */}
      <section className="py-16 md:py-24" style={{ backgroundColor: "var(--surface)" }}>
        <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="prose-alderic">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {item.content}
            </ReactMarkdown>
          </div>
        </div>
      </section>

      {/* Related */}
      {(related ?? []).length > 0 && (
        <section className="py-20 md:py-28" style={{ backgroundColor: "var(--surface-alt)" }}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <p
              className="text-xs font-medium tracking-widest uppercase mb-10"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
            >
              Dans la même catégorie
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(related as Array<{ id: string; title: string; slug: string; category: string; reading_time_min: number; published_at: string }>).map((r) => (
                <Link key={r.id} href={`/insights/${r.slug}`} className="group block">
                  <p
                    className="mb-2 text-xs font-medium tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
                  >
                    {categoryLabels[r.category] ?? r.category} · {r.reading_time_min} min
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      fontSize: "1.0625rem",
                      color: "var(--text-primary)",
                      lineHeight: 1.35,
                    }}
                  >
                    {r.title}
                  </p>
                  <p
                    className="mt-2 text-xs"
                    style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
                  >
                    {formatDateFr(r.published_at)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
