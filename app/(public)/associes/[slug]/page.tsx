import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { Reveal } from "@/components/public/reveal";
import { getAvocatPhoto } from "@/lib/avocats-photos";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface Avocat {
  id: string;
  slug: string;
  full_name: string;
  title: string;
  bio: string | null;
  expertises: string[];
  languages: string[] | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  bar_admission: string | null;
}

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase.from("avocats").select("slug").not("slug", "is", null).limit(8);
  return (data ?? []).map((item: { slug: string }) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createStaticClient();
  const { data: avocat } = await supabase
    .from("avocats")
    .select("full_name, title")
    .eq("slug", slug)
    .single();
  if (!avocat) return { title: "Associé introuvable" };
  return {
    title: `${avocat.full_name} — Maison Aldéric & Associés`,
    description: `${avocat.full_name}, ${avocat.title} — Maison Aldéric & Associés, Bruxelles.`,
  };
}

export default async function AssociePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: avocat } = await supabase
    .from("avocats")
    .select("id, slug, full_name, title, bio, expertises, languages, email, phone, avatar_url, bar_admission")
    .eq("slug", slug)
    .single();
  if (!avocat) notFound();

  const firstName = avocat.full_name.split(" ")[0];

  const publications = [
    {
      title: "Gouvernance actionnariale en phase d'hyper-croissance",
      source: "Revue belge du droit des affaires",
      year: "2025",
    },
    {
      title: "Negotiation patterns in cross-border transactions",
      source: "Brussels Business Law Forum",
      year: "2024",
    },
    {
      title: "Litiges post-acquisition: clauses et précédents",
      source: "Legal Strategy Conference",
      year: "2024",
    },
    {
      title: "Gestion du risque contractuel en contexte inflationniste",
      source: "Corporate Counsel Summit",
      year: "2023",
    },
  ];

  const { data: dealLinks } = await supabase
    .from("deal_avocats")
    .select(
      `
      deals (
        id,
        title,
        client_name,
        amount_label,
        year,
        category,
        slug
      )
    `
    )
    .eq("avocat_id", avocat.id)
    .limit(3);

  const deals = ((dealLinks ?? [])
    .map((item: any) => item.deals)
    .filter(Boolean) as Array<{
    id: string;
    title: string;
    client_name: string;
    amount_label: string | null;
    year: number;
    category: string;
    slug: string;
  }>).slice(0, 3);

  return (
    <>
      <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-7xl space-y-10">
          <Reveal className="grid grid-cols-1 gap-10 lg:grid-cols-[0.4fr_0.6fr]">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-surface-alt">
                <Image
                  src={getAvocatPhoto(slug)}
                  alt={avocat.full_name}
                  width={600}
                  height={600}
                  className="h-full w-full rounded-lg object-cover grayscale"
                />
              </div>
              <div className="space-y-1 text-sm text-text-secondary">
                {avocat.email && <p>{avocat.email}</p>}
                {avocat.phone && <p>{avocat.phone}</p>}
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-sm text-text-secondary">
                <Link href="/associes" className="hover:text-bordeaux">
                  L&apos;équipe
                </Link>{" "}
                / {avocat.full_name}
              </p>
              <h1 className="text-5xl text-foreground md:text-6xl">{avocat.full_name}</h1>
              <p className="text-xl text-text-secondary">{avocat.title}</p>
              <div className="flex flex-wrap gap-2">
                {avocat.expertises?.map((specialty: string) => (
                  <span
                    key={specialty}
                    className="rounded-full border border-bordeaux px-3 py-1 text-xs uppercase tracking-wide text-bordeaux"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
              {avocat.languages?.length ? (
                <p className="text-sm text-text-secondary">Langues: {avocat.languages.join(", ")}</p>
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 md:py-24 lg:px-20">
        <div className="prose-alderic mx-auto max-w-4xl text-lg leading-relaxed text-text-secondary">
          <h2 className="mb-6 text-3xl text-foreground">Parcours</h2>
          <p className="mb-6 first-letter:float-left first-letter:mr-3 first-letter:pt-1 first-letter:text-6xl first-letter:font-medium first-letter:leading-none first-letter:text-bordeaux">
            {avocat.bio ??
              "Profil reconnu en conseil transactionnel et contentieux d'affaires, avec une pratique orientée exécution et anticipation du risque."}
          </p>
          <p className="mb-6">
            Son approche combine rigueur technique, lisibilite des options juridiques et coordination
            des parties prenantes dans des contextes sensibles.
          </p>
          <p className="mb-6">
            Il accompagne les dirigeants et investisseurs sur des mandats multi-juridictions en
            priorisant la clarté contractuelle et la maîtrise du calendrier.
          </p>

          <h3 className="mb-4 mt-12 text-2xl text-foreground">Formation</h3>
          <ul className="mb-6 list-disc space-y-2 pl-6">
            <li>LL.M. en droit des affaires internationales</li>
            <li>Master en droit, Université libre de Bruxelles</li>
            <li>Certificat governance & compliance</li>
          </ul>

          <h3 className="mb-4 mt-12 text-2xl text-foreground">Barreaux</h3>
          <ul className="mb-6 list-disc space-y-2 pl-6">
            <li>{avocat.bar_admission ?? "Barreau de Bruxelles"}</li>
          </ul>
        </div>
      </section>

      <section className="bg-surface-alt px-6 py-16 md:px-12 md:py-24 lg:px-20">
        <div className="mx-auto max-w-4xl space-y-8">
          <h2 className="text-3xl text-foreground">Publications & interventions</h2>
          <div className="space-y-5">
            {publications.map((item) => (
              <article key={item.title} className="border-b border-border pb-5">
                <h3 className="text-xl text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">
                  {item.source} · {item.year}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 md:py-24 lg:px-20">
        <div className="mx-auto max-w-7xl space-y-8">
          <h2 className="text-3xl text-foreground">Transactions notables</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {(deals ?? []).map((deal: any, index: number) => (
              <Reveal key={deal.id} delay={index * 0.05}>
                <article className="rounded-sm border border-border bg-surface p-6">
                <p className="text-xs uppercase tracking-wide text-bordeaux">{deal.year}</p>
                <h3 className="mt-3 text-xl text-foreground">{deal.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{deal.client_name}</p>
                <p className="mt-4 text-lg text-bordeaux">{deal.amount_label ?? "Confidentiel"}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-4xl rounded-sm border border-border bg-surface-alt p-8 text-center md:p-12">
          <h2 className="text-3xl text-foreground">Travailler avec {firstName} ?</h2>
          <Link
            href={`/contact?avocat=${slug}`}
            className="mt-6 inline-flex rounded-sm bg-bordeaux px-6 py-3 text-sm font-medium text-white"
          >
            Prendre contact
          </Link>
        </div>
      </section>
    </>
  );
}
