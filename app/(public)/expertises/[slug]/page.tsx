import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { slugify } from "@/lib/slugify";
import { Reveal } from "@/components/public/reveal";

interface PageProps {
  params: Promise<{ slug: string }>;
}

type ExpertiseContent = {
  slug: string;
  name: string;
  category: string;
  description: string;
  intro: string;
  sections: Array<{ title: string; body: string; bullets?: string[] }>;
};

const EXPERTISES_FALLBACK: ExpertiseContent[] = [
  {
    slug: "ma",
    name: "Fusions & Acquisitions",
    category: "M&A",
    description:
      "Structuration, negociation et execution des transactions strategiques en Belgique et en Europe.",
    intro:
      "Nous accompagnons dirigeants, fonds et actionnaires dans les moments decisifs d'une transaction. Notre approche combine securisation contractuelle, lecture business et gestion du rythme de closing.",
    sections: [
      {
        title: "Structuration pre-deal",
        body: "Cadrage de la gouvernance, architecture de transaction et scenarios de partage de risque.",
      },
      {
        title: "Due diligence orientee decision",
        body: "Priorisation des risques materielles pour concentrer les negociations sur les sujets critiques.",
      },
      {
        title: "Negociation documentaire",
        body: "SPA, garanties, earn-out et clauses d'ajustement avec logique d'execution pragmatique.",
      },
      {
        title: "Closing et post-closing",
        body: "Pilotage des conditions suspensives, closing mechanics et feuille de route d'integration.",
      },
    ],
  },
  {
    slug: "pe",
    name: "Private Equity",
    category: "Private Equity",
    description: "Conseil sur acquisitions sponsorisees, pactes d'actionnaires et sorties.",
    intro:
      "Nous intervenons sur l'ensemble du cycle d'investissement avec une discipline contractuelle alignee aux contraintes fonds et management.",
    sections: [
      { title: "Origination et term sheets", body: "Structuration de l'offre et alignement des incentives." },
      { title: "Acquisition", body: "Documentation d'investissement et securisation gouvernance." },
      { title: "Vie de participation", body: "Avenants, management package et operations de croissance." },
      { title: "Exit", body: "Preparation juridique de cession et coordination des conseils." },
    ],
  },
  {
    slug: "contentieux",
    name: "Contentieux",
    category: "Contentieux",
    description: "Defense strategique en litiges commerciaux et arbitrages.",
    intro:
      "Nous traitons le contentieux comme un levier de negociation autant que de defense, avec une lecture business des enjeux.",
    sections: [
      { title: "Evaluation du risque", body: "Cartographie des issues et strategie processuelle." },
      { title: "Phase pre-contentieuse", body: "Mise en demeure, preservation de preuves et protocoles." },
      { title: "Procedure", body: "Plaidoirie, coordination experts et pilotage du calendrier." },
      { title: "Resolution", body: "Settlement structure et execution des decisions." },
    ],
  },
  {
    slug: "tax",
    name: "Fiscal",
    category: "Fiscal",
    description: "Structuration fiscale internationale et gestion des risques.",
    intro:
      "Nos interventions combinent optimisation conforme, anticipation des controles et robustesse documentaire.",
    sections: [
      { title: "Structuration", body: "Schema fiscal des flux et des vehicules d'investissement." },
      { title: "Conformite", body: "Documentation prix de transfert et obligations declaratives." },
      { title: "Controles", body: "Preparation, defense et transaction avec l'administration." },
      { title: "Coordination transfrontaliere", body: "Pilotage multi-juridictions avec conseils locaux." },
    ],
  },
  {
    slug: "corporate",
    name: "Corporate",
    category: "Corporate",
    description: "Gouvernance, secretariat juridique et operations de haut de bilan.",
    intro:
      "Nous mettons en place une architecture societaire claire, scalable et defendable dans la duree.",
    sections: [
      { title: "Gouvernance", body: "Regles internes, pouvoirs et comites decisoires." },
      { title: "Secretariat juridique", body: "AG, CA et formalites societaires critiques." },
      { title: "Operations", body: "Augmentations de capital, reorganisations et pactes." },
      { title: "Conflits d'actionnaires", body: "Prevention et resolution contractuelle." },
    ],
  },
  {
    slug: "restructuring",
    name: "Restructuring",
    category: "Restructuring",
    description: "Reorganisation juridique en contexte de tension financiere.",
    intro:
      "Nous construisons des plans de stabilisation et de retournement protegeant la valeur et les parties prenantes.",
    sections: [
      { title: "Diagnostic", body: "Analyse des contrats, suretes et fragilites juridiques." },
      { title: "Plan d'action", body: "Priorisation des options et calendrier d'execution." },
      { title: "Negociation parties prenantes", body: "Creanciers, actionnaires et management." },
      { title: "Mise en oeuvre", body: "Documentation, procedure et securisation finale." },
    ],
  },
];

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data, error } = await supabase.from("expertises").select("slug").order("slug");
  if (error || !data?.length) {
    return EXPERTISES_FALLBACK.map((item) => ({ slug: item.slug }));
  }
  return data.map((item: { slug: string }) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fromFallback = EXPERTISES_FALLBACK.find((item) => item.slug === slug);
  if (!fromFallback) return { title: "Expertise introuvable" };
  return {
    title: `${fromFallback.name} — Maison Aldéric & Associés`,
    description: fromFallback.description,
  };
}

export default async function ExpertiseSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const expertise = EXPERTISES_FALLBACK.find((item) => item.slug === slug);
  if (!expertise) notFound();

  const expertiseKeywords: Record<string, string[]> = {
    ma: ["M&A"],
    pe: ["Private Equity", "PE"],
    contentieux: ["Contentieux", "Litigation"],
    tax: ["Tax", "Fiscal", "Fiscalité"],
    corporate: ["Corporate"],
    restructuring: ["Restructuring", "Insolvabilité"],
  };

  const dealCategoryByExpertise: Record<string, string[]> = {
    ma: ["M&A"],
    pe: ["PE"],
    contentieux: ["Restructuring", "M&A"],
    tax: ["M&A", "PE"],
    corporate: ["M&A", "PE"],
    restructuring: ["Restructuring"],
  };

  const keywords = expertiseKeywords[expertise.slug] ?? [expertise.category];

  const { data: avocats } = await supabase
    .from("avocats")
    .select("id, full_name, title, slug, avatar_url, expertises")
    .overlaps("expertises", keywords)
    .order("full_name")
    .limit(4);

  const avocatIds = (avocats ?? []).map((item: any) => item.id);

  const { data: linkedDeals } = avocatIds.length
    ? await supabase
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
        .in("avocat_id", avocatIds)
        .limit(12)
    : { data: [] as any[] };

  const fallbackCategories = dealCategoryByExpertise[expertise.slug] ?? [];
  const { data: fallbackDeals } = fallbackCategories.length
    ? await supabase
        .from("deals")
        .select("id, title, client_name, amount_label, year, category, slug")
        .in("category", fallbackCategories)
        .order("year", { ascending: false })
        .limit(3)
    : { data: [] as any[] };

  const uniqueDealsMap = new Map<string, any>();
  for (const row of linkedDeals ?? []) {
    const deal = (row as any).deals;
    if (deal?.id && !uniqueDealsMap.has(deal.id)) uniqueDealsMap.set(deal.id, deal);
  }
  for (const deal of fallbackDeals ?? []) {
    if (deal?.id && !uniqueDealsMap.has(deal.id)) uniqueDealsMap.set(deal.id, deal);
  }
  const deals = Array.from(uniqueDealsMap.values()).slice(0, 3);

  const { data: expertiseRow } = await supabase
    .from("expertises")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  const { data: specialistesPivot } =
    expertiseRow?.id
      ? await supabase
          .from("expertise_avocats")
          .select(
            `
            avocats (
              id,
              full_name,
              title,
              slug,
              avatar_url,
              expertises
            )
          `
          )
          .eq("expertise_id", expertiseRow.id)
          .limit(4)
      : { data: [] as any[] };

  const specialistesFromPivot = (specialistesPivot ?? [])
    .map((item: any) => item.avocats)
    .filter(Boolean);
  const specialistes =
    specialistesFromPivot.length > 0 ? specialistesFromPivot : (avocats ?? []);

  const { data: dealsPivot } =
    expertiseRow?.id
      ? await supabase
          .from("deal_expertises")
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
          .eq("expertise_id", expertiseRow.id)
          .limit(3)
      : { data: [] as any[] };

  const dealsFromPivot = (dealsPivot ?? []).map((item: any) => item.deals).filter(Boolean);
  const dealsFinal = dealsFromPivot.length > 0 ? dealsFromPivot : deals;

  return (
    <>
      <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-7xl space-y-6">
          <p className="text-sm text-text-secondary">
            <Link href="/expertises" className="hover:text-bordeaux">
              Expertises
            </Link>{" "}
            / {expertise.name}
          </p>
          <span className="text-xs uppercase tracking-wide text-bordeaux">{expertise.category}</span>
          <h1 className="max-w-4xl text-5xl font-medium leading-tight text-foreground md:text-6xl">
            {expertise.name}
          </h1>
          <p className="max-w-3xl text-xl leading-relaxed text-text-secondary">{expertise.description}</p>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 md:py-24 lg:px-20">
        <div className="prose-alderic mx-auto max-w-4xl text-lg leading-relaxed text-text-secondary">
          <p className="mb-6 first-letter:float-left first-letter:mr-3 first-letter:pt-1 first-letter:text-6xl first-letter:font-medium first-letter:leading-none first-letter:text-bordeaux">
            {expertise.intro}
          </p>
          {expertise.sections.map((entry, index) => (
            <Reveal key={entry.title} delay={index * 0.04}>
              <h2 className="mb-6 mt-16 text-3xl text-foreground">{entry.title}</h2>
              <p className="mb-6">{entry.body}</p>
              {entry.bullets && (
                <ul className="mb-6 list-disc space-y-2 pl-6">
                  {entry.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-surface-alt px-6 py-16 md:px-12 md:py-24 lg:px-20">
        <div className="mx-auto max-w-7xl space-y-10">
          <h2 className="text-3xl text-foreground">Nos spécialistes</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(specialistes ?? []).map((avocat: any) => (
              <Link
                key={avocat.id}
                href={`/associes/${avocat.slug ?? slugify(avocat.full_name)}`}
                className="rounded-sm border border-border bg-surface p-5"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border border-border">
                    {avocat.avatar_url ? (
                      <Image src={avocat.avatar_url} alt={avocat.full_name} fill className="object-cover" />
                    ) : (
                      <div className="h-full w-full bg-surface-alt" />
                    )}
                  </div>
                  <div>
                    <p className="text-base text-foreground">{avocat.full_name}</p>
                    <p className="text-sm text-text-secondary">{avocat.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 md:py-24 lg:px-20">
        <div className="mx-auto max-w-7xl space-y-10">
          <h2 className="text-3xl text-foreground">Transactions représentatives</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {(dealsFinal ?? []).map((deal: any) => (
              <article key={deal.id} className="rounded-sm border border-border bg-surface p-6">
                <p className="text-xs uppercase tracking-wide text-bordeaux">
                  {deal.category} · {deal.year}
                </p>
                <h3 className="mt-3 text-xl text-foreground">{deal.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{deal.client_name}</p>
                <p className="mt-4 text-lg text-bordeaux">{deal.amount_label ?? "Confidentiel"}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-4xl rounded-sm border border-border bg-surface-alt p-8 text-center md:p-12">
          <h2 className="text-3xl text-foreground">Un projet {expertise.name} ? Discutons-en.</h2>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-sm bg-bordeaux px-6 py-3 text-sm font-medium text-white"
          >
            Prendre contact
          </Link>
        </div>
      </section>
    </>
  );
}
