"use client";

import { Reveal } from "@/components/public/reveal";

export type AssocieDealItem = {
  id: string;
  title: string;
  client_name: string;
  amount_label: string | null;
  year: number;
};

export function AssociesDealsSection({ deals }: { deals: AssocieDealItem[] }) {
  return (
    <section className="px-6 py-16 md:px-12 md:py-24 lg:px-20">
      <div className="mx-auto max-w-7xl space-y-8">
        <h2 className="text-3xl text-foreground">Transactions notables</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {deals.map((deal, index) => (
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
  );
}
