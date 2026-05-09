import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { formatDateFr } from "@/lib/format-date";
import { frenchTypography } from "@/lib/typography";
import { slugify } from "@/lib/slugify";
import { Reveal } from "@/components/public/reveal";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface Insight {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  reading_time_minutes: number;
  published_at: string;
  author: {
    id: string;
    full_name: string;
    title: string;
    slug: string | null;
    avatar_url: string | null;
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
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (!data) return { title: "Article introuvable" };
  return {
    title: `${data.title} — Maison Aldéric & Associés`,
    description: data.excerpt,
  };
}

export default async function InsightPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createStaticClient();

  const { data: insight, error } = await supabase
    .from("insights")
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      category,
      reading_time_minutes,
      published_at,
      author:avocats(id, full_name, title, slug, avatar_url)
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!insight) notFound();

  const item = insight as unknown as Insight;

  const { data: related } = await supabase
    .from("insights")
    .select("id, title, slug, category, reading_time_minutes, published_at, excerpt")
    .eq("is_published", true)
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(3);

  const headingMatches = Array.from(item.content.matchAll(/^##\s+(.+)$/gm)).map((match) => {
    const title = match[1].trim();
    return { title, id: slugify(title) };
  });

  return (
    <>
      <section className="px-6 py-16 md:px-12 md:py-20 lg:px-20">
        <div className="mx-auto max-w-4xl space-y-6">
          <p className="text-sm text-text-secondary">
            <Link href="/insights" className="hover:text-bordeaux">
              Insights
            </Link>{" "}
            / {categoryLabels[item.category] ?? item.category} / {item.title}
          </p>
          <span className="inline-flex rounded-full bg-bordeaux/10 px-3 py-1 text-xs uppercase tracking-wide text-bordeaux">
            {categoryLabels[item.category] ?? item.category}
          </span>
          <h1 className="max-w-3xl text-5xl leading-tight text-foreground md:text-6xl">{frenchTypography(item.title)}</h1>
          <p className="text-sm text-text-secondary">
            {formatDateFr(item.published_at)} · {item.reading_time_minutes} min ·{" "}
            {item.author ? (
              <Link href={`/associes/${item.author.slug ?? slugify(item.author.full_name)}`} className="hover:text-bordeaux">
                {item.author.full_name}
              </Link>
            ) : (
              "Maison Aldéric"
            )}
          </p>
        </div>
      </section>

      <section className="relative px-6 py-16 md:px-12 md:py-24 lg:px-20">
        <div className="mx-auto max-w-4xl">
          <div className="prose-alderic prose-lg">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={(() => {
                // Closure variable — resets for each ReactMarkdown render (server-side)
                let firstParagraph = true;
                return {
                p: ({ children }) => {
                  const isFirst = firstParagraph;
                  if (firstParagraph) firstParagraph = false;
                  return (
                    <p className={`mb-6 text-lg leading-relaxed text-text-secondary${
                      isFirst
                        ? " first-letter:float-left first-letter:mr-3 first-letter:pt-1 first-letter:text-6xl first-letter:font-medium first-letter:leading-none first-letter:text-bordeaux"
                        : ""
                    }`}>
                      {children}
                    </p>
                  );
                },
                h2: ({ children }) => {
                  const title = String(children);
                  const id = slugify(title);
                  return (
                    <h2 id={id} className="mb-6 mt-12 text-3xl text-foreground">
                      {children}
                    </h2>
                  );
                },
                h3: ({ children }) => <h3 className="mb-4 mt-8 text-2xl text-foreground">{children}</h3>,
                blockquote: ({ children }) => (
                  <blockquote className="my-8 border-l-4 border-bordeaux py-4 pl-6 text-xl italic text-text-secondary">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <Link href={href ?? "#"} className="text-bordeaux underline underline-offset-4">
                    {children}
                  </Link>
                ),
              };
              })()}
            >
              {item.content}
            </ReactMarkdown>
          </div>
        </div>

        {headingMatches.length > 0 && (
          <aside className="fixed right-8 top-32 hidden w-64 rounded-sm border border-border bg-surface p-4 lg:block">
            <p className="mb-3 text-xs uppercase tracking-wide text-text-muted">Sommaire</p>
            <nav className="space-y-2">
              {headingMatches.map((heading) => (
                <Link key={heading.id} href={`#${heading.id}`} className="block text-sm text-text-secondary hover:text-bordeaux">
                  {heading.title}
                </Link>
              ))}
            </nav>
          </aside>
        )}
      </section>

      {item.author && (
        <section className="bg-surface-alt px-6 py-12 md:px-12 lg:px-20">
          <div className="mx-auto max-w-4xl rounded-sm border border-border bg-surface p-6">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border border-border">
                {item.author.avatar_url ? (
                  <Image src={item.author.avatar_url} alt={item.author.full_name} fill className="object-cover" />
                ) : (
                  <div className="h-full w-full bg-surface-alt" />
                )}
              </div>
              <div>
                <p className="text-lg text-foreground">{item.author.full_name}</p>
                <p className="text-sm text-text-secondary">{item.author.title}</p>
                <Link href={`/associes/${slugify(item.author.full_name)}`} className="mt-1 inline-block text-sm text-bordeaux">
                  Voir le profil →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-16 md:px-12 md:py-24 lg:px-20">
        <div className="mx-auto max-w-6xl space-y-8">
          <h2 className="text-3xl text-foreground">Articles liés</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {(related as any[]).map((entry, index: number) => (
              <Reveal key={entry.id} delay={index * 0.05}>
                <Link href={`/insights/${entry.slug}`} className="block rounded-sm border border-border bg-surface p-6">
                <p className="text-xs uppercase tracking-wide text-bordeaux">
                  {categoryLabels[entry.category] ?? entry.category}
                </p>
                <h3 className="mt-3 text-xl text-foreground">{entry.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{formatDateFr(entry.published_at)}</p>
                <p className="mt-3 line-clamp-2 text-sm text-text-secondary">{entry.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bordeaux/5 px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-4xl rounded-sm border border-border bg-surface p-8 md:p-10">
          <h2 className="text-3xl text-foreground">Recevez nos insights par email</h2>
          <form className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="h-11 flex-1 rounded-sm border border-border bg-background px-4 text-sm text-foreground placeholder:text-text-muted focus:outline-none"
            />
            <button type="button" className="h-11 rounded-sm bg-bordeaux px-5 text-sm font-medium text-white">
              S&apos;abonner
            </button>
          </form>
        </div>
      </section>
    </>
  );
}