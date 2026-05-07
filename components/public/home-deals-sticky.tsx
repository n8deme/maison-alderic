import Link from "next/link";

type DealItem = {
  id: string;
  title: string;
  client_name: string;
  category: string;
  year: number;
  amount_label: string | null;
};

export function HomeDealsSticky({ deals }: { deals: DealItem[] }) {
  if (deals.length === 0) return null;

  return (
    <section className="bg-surface-alt px-6 py-32 md:px-12 md:py-40 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between pb-2 md:mb-12">
          <div className="space-y-4">
            <span className="text-xs font-medium uppercase tracking-widest text-text-muted">
              Transactions récentes
            </span>
            <h2 className="text-4xl text-foreground md:text-5xl">Deals notables</h2>
          </div>
          <Link href="/deals" className="hidden text-sm text-bordeaux md:inline">
            Voir tous →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {deals.slice(0, 6).map((deal, index) => (
            <article
              key={deal.id}
              className={
                index === 0
                  ? "rounded-sm border border-border bg-surface p-7 md:col-span-2 lg:col-span-2 lg:row-span-2 md:p-8"
                  : "rounded-sm border border-border bg-surface p-7 md:p-8"
              }
            >
              <div className="mb-8 flex items-center justify-between gap-4">
                <span className="text-xs font-medium uppercase tracking-wide text-bordeaux">
                  {deal.category}
                </span>
                <span className="tabular text-xs text-text-muted">{deal.year}</span>
              </div>

              <p className="mb-2 text-xs uppercase tracking-wider text-text-muted">
                {deal.client_name}
              </p>
              <h3 className={index === 0 ? "text-3xl leading-tight text-foreground" : "text-2xl leading-tight text-foreground"}>
                {deal.title}
              </h3>

              <div className="mt-10 border-t border-border pt-5">
                {deal.amount_label ? (
                  <p className="font-heading text-3xl font-medium text-bordeaux">{deal.amount_label}</p>
                ) : (
                  <p className="text-sm text-text-secondary">Montant confidentiel</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
