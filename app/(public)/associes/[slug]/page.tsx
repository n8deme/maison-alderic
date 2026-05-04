import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { slugify } from "@/lib/slugify";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface Avocat {
  id: string;
  full_name: string;
  title: string;
  bio: string;
  specialties: string[];
  is_founding_partner: boolean;
  bar_year: number;
  email: string;
  linkedin_url: string | null;
}

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase.from("avocats").select("full_name");
  return (data ?? []).map((a: { full_name: string }) => ({ slug: slugify(a.full_name) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createStaticClient();
  const { data } = await supabase.from("avocats").select("full_name, title");
  const avocat = (data ?? []).find((a: { full_name: string }) => slugify(a.full_name) === slug) as
    | { full_name: string; title: string }
    | undefined;
  if (!avocat) return { title: "Associé introuvable" };
  return {
    title: `${avocat.full_name} — Maison Aldéric & Associés`,
    description: `${avocat.full_name}, ${avocat.title} — Maison Aldéric & Associés, Bruxelles.`,
  };
}

export default async function AssociePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("avocats")
    .select("id, full_name, title, bio, specialties, is_founding_partner, bar_year, email, linkedin_url");

  const avocat = ((data ?? []) as Avocat[]).find((a) => slugify(a.full_name) === slug);
  if (!avocat) notFound();

  return (
    <>
      {/* Hero */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: "var(--surface-alt)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <Link
            href="/associes"
            className="inline-flex items-center gap-2 mb-10 text-xs font-medium tracking-widest uppercase"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
          >
            ← Nos associés
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-14 lg:gap-20 items-start">
            {/* Photo */}
            <div
              style={{
                aspectRatio: "3/4",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            />
            {/* Info */}
            <div>
              {avocat.is_founding_partner && (
                <p
                  className="text-xs font-medium tracking-widest uppercase mb-5"
                  style={{ fontFamily: "var(--font-body)", color: "var(--bordeaux)" }}
                >
                  Associé fondateur
                </p>
              )}
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                }}
              >
                {avocat.full_name}
              </h1>
              <p
                className="mt-3"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1rem",
                  color: "var(--text-secondary)",
                }}
              >
                {avocat.title}
              </p>

              {/* Specialties */}
              {avocat.specialties?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {avocat.specialties.map((s) => (
                    <span
                      key={s}
                      className="text-xs px-3 py-1"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--text-muted)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Bio */}
              <p
                className="mt-10 max-w-2xl"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9375rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.8,
                }}
              >
                {avocat.bio}
              </p>

              {/* Meta */}
              <div
                className="mt-10 pt-8 flex flex-wrap gap-8"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <div>
                  <p
                    className="text-xs font-medium tracking-widest uppercase mb-1"
                    style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
                  >
                    Barreau
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9375rem",
                      color: "var(--text-primary)",
                    }}
                  >
                    Bruxelles, depuis {avocat.bar_year}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs font-medium tracking-widest uppercase mb-1"
                    style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
                  >
                    Contact
                  </p>
                  <a
                    href={`mailto:${avocat.email}`}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9375rem",
                      color: "var(--bordeaux)",
                    }}
                  >
                    {avocat.email}
                  </a>
                </div>
                {avocat.linkedin_url && (
                  <div>
                    <p
                      className="text-xs font-medium tracking-widest uppercase mb-1"
                      style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
                    >
                      LinkedIn
                    </p>
                    <a
                      href={avocat.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.9375rem",
                        color: "var(--bordeaux)",
                      }}
                    >
                      Profil LinkedIn
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ backgroundColor: "var(--surface)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontStyle: "italic",
              fontSize: "1.25rem",
              color: "var(--text-primary)",
            }}
          >
            Vous souhaitez prendre contact avec {avocat.full_name.split(" ")[0]} ?
          </p>
          <Link
            href="/contact"
            className="shrink-0 inline-block text-xs font-medium tracking-widest uppercase px-5 py-2.5"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--bordeaux)",
              border: "1px solid var(--bordeaux)",
            }}
          >
            Nous écrire
          </Link>
        </div>
      </section>
    </>
  );
}
