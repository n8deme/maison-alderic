import Link from "next/link";
import { formatDateFr } from "@/lib/format-date";

type InsightItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  published_at: string | null;
  reading_time_minutes: number | null;
};

export function HomeInsightsMagazine({ insights }: { insights: InsightItem[] }) {
  if (insights.length === 0) return null;

  const [featured, ...others] = insights;

  return (
    <section className="bg-surface-alt px-6 py-32 md:px-12 md:py-40 lg:px-20">
      <div className="mx-auto max-w-7xl space-y-12 md:space-y-14">
        <div className="flex items-end justify-between">
          <div className="space-y-4">
            <span className="text-xs font-medium uppercase tracking-widest text-text-muted">
              Analyses & perspectives
            </span>
            <h2 className="text-4xl text-foreground md:text-5xl">Insights recents</h2>
          </div>
          <Link href="/insights" className="hidden text-sm text-bordeaux md:inline">
            Voir tous →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <Link
            href={`/insights/${featured.slug}`}
            className="group rounded-sm border border-border bg-surface p-8 md:p-10"
          >
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="text-xs font-medium uppercase tracking-wide text-bordeaux">
                {featured.category}
              </span>
              {featured.published_at && (
                <span className="text-xs text-text-muted">{formatDateFr(featured.published_at)}</span>
              )}
              {featured.reading_time_minutes && (
                <span className="text-xs text-text-muted">{featured.reading_time_minutes} min</span>
              )}
            </div>
            <h3 className="max-w-3xl text-3xl leading-tight text-foreground transition-colors duration-300 group-hover:text-bordeaux md:text-4xl">
              {featured.title}
            </h3>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary">
              {featured.excerpt}
            </p>
            <p className="mt-8 text-sm font-medium text-bordeaux">Lire l&apos;article →</p>
          </Link>

          <div className="space-y-6">
            {others.map((item) => (
              <Link
                key={item.id}
                href={`/insights/${item.slug}`}
                className="group block rounded-sm border border-border bg-surface p-6"
              >
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-bordeaux">
                    {item.category}
                  </span>
                  {item.published_at && (
                    <span className="text-xs text-text-muted">{formatDateFr(item.published_at)}</span>
                  )}
                </div>
                <h4 className="text-xl leading-snug text-foreground transition-colors duration-300 group-hover:text-bordeaux">
                  {item.title}
                </h4>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-text-secondary">
                  {item.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
