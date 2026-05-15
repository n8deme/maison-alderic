import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getAvocatPhoto } from "@/lib/avocats-photos";
import { slugify } from "@/lib/slugify";

export const metadata: Metadata = {
  title: "Nos associés — Maison Aldéric & Associés",
  description:
    "Rencontrez les associés de Maison Aldéric — juristes d'affaires reconnus, conseillers de confiance des acteurs du capital et de l'entreprise.",
};

interface Avocat {
  id: string;
  slug: string | null;
  full_name: string;
  title: string;
  bio: string;
  expertises: string[];
  is_founding_partner: boolean;
  bar_admission: string | null;
}

export default async function AssociesPage() {
  const supabase = await createClient();

  const { data: avocats, error } = await supabase
    .from("avocats")
    .select("id, slug, full_name, title, bio, expertises, is_founding_partner, bar_admission")
    .order("is_founding_partner", { ascending: false })
    .order("full_name");

  const fondateurs = (avocats ?? []).filter((a: Avocat) => a.is_founding_partner);
  const counsels = (avocats ?? []).filter((a: Avocat) => !a.is_founding_partner);

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
            L&apos;équipe
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
            Des juristes d&apos;affaires.<br />
            <span style={{ fontStyle: "italic" }}>Des partenaires stratégiques.</span>
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
            Maison Aldéric réunit des avocats formés dans les plus grandes
            structures internationales, choisis pour leur excellence technique
            et leur capacité à devenir des conseillers durables.
          </p>
        </div>
      </section>

      {/* Associés fondateurs */}
      {fondateurs.length > 0 && (
        <section className="py-24 md:py-32" style={{ backgroundColor: "var(--surface)" }}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <p
              className="text-xs font-medium tracking-widest uppercase mb-14"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
            >
              Associés fondateurs
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {fondateurs.map((avocat: Avocat) => (
                <AvocatCard key={avocat.id} avocat={avocat} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Counsels & Senior Associates */}
      {counsels.length > 0 && (
        <section className="py-24 md:py-32" style={{ backgroundColor: "var(--surface-alt)" }}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <p
              className="text-xs font-medium tracking-widest uppercase mb-14"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
            >
              Counsels &amp; Senior Associates
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {counsels.map((avocat: Avocat) => (
                <AvocatCard key={avocat.id} avocat={avocat} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function AvocatCard({ avocat }: { avocat: Avocat }) {
  const avocatSlug = avocat.slug ?? slugify(avocat.full_name);

  return (
    <Link href={`/associes/${avocatSlug}`} className="group block">
      <div className="mb-6 flex justify-center">
        <Image
          src={getAvocatPhoto(avocatSlug)}
          alt={avocat.full_name}
          width={200}
          height={200}
          className="rounded-full object-cover grayscale"
        />
      </div>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "1.125rem",
          color: "var(--text-primary)",
          letterSpacing: "-0.01em",
        }}
      >
        {avocat.full_name}
      </p>
      <p
        className="mt-1"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.8125rem",
          color: "var(--text-muted)",
        }}
      >
        {avocat.title}
      </p>
      {avocat.expertises?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {avocat.expertises.slice(0, 3).map((s: string) => (
            <span
              key={s}
              className="text-xs px-2.5 py-1"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--text-muted)",
                backgroundColor: "var(--surface-alt)",
                border: "1px solid var(--border)",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
