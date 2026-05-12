import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HomeExpertisesGrid } from "@/components/public/home-expertises-grid";
import { HomeDealsSticky } from "@/components/public/home-deals-sticky";
import { HomeAssociesReveal } from "@/components/public/home-associes-reveal";
import { HomeInsightsMagazine } from "@/components/public/home-insights-magazine";
import { Reveal } from "@/components/public/reveal";
import { RotatingWord } from "@/components/public/rotating-word";

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

const chiffres = [
  { value: "240M€", label: "Opération M&A emblématique 2025" },
  { value: "8", label: "Avocats et collaborateurs" },
  { value: "2003", label: "Année de création du cabinet" },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  // ✨ Intercepte le code OAuth/magic link et redirige vers /auth/callback
  const params = await searchParams;
  if (params.code) {
    redirect(`/auth/callback?code=${params.code}`);
  }

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
      .select("id, full_name, title, expertises, avatar_url, is_founding_partner, display_order")
      .eq("is_founding_partner", true)
      .order("display_order")
      .limit(6),
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
      <Reveal>
        <section
          className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-36"
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
                className="text-5xl md:text-6xl text-foreground"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                }}
              >
                Le droit comme architecture <RotatingWord />.
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
                className="inline-block px-6 py-3 text-sm font-medium transition-colors hover:opacity-90"
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
                className="inline-block px-6 py-3 text-sm font-medium transition-colors hover:text-bordeaux"
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
      </Reveal>

      {/* ── Expertises ───────────────────────────────────────── */}
      <HomeExpertisesGrid />

      {/* ── Deals notables ───────────────────────────────────── */}
      <Reveal>
        <HomeDealsSticky deals={deals ?? []} />
      </Reveal>

      {/* ── Associés fondateurs ──────────────────────────────── */}
      <Reveal delay={0.05}>
        <HomeAssociesReveal avocats={avocats ?? []} />
      </Reveal>

      {/* ── Insights récents ─────────────────────────────────── */}
      <Reveal delay={0.1}>
        <HomeInsightsMagazine insights={insights ?? []} />
      </Reveal>

      {/* ── CTA finale ───────────────────────────────────────── */}
      <Reveal>
        <section
          className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-36"
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
            className="inline-block px-8 py-3 text-sm font-medium transition-colors hover:bg-surface-alt"
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
      </Reveal>
    </>
  );
}