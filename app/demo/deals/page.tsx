import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Deals notables — Maison Aldéric & Associés",
  description:
    "Sélection d'opérations récentes conseillées par Maison Aldéric & Associés en M&A, Private Equity et restructuration.",
};

interface Deal {
  id: string;
  slug: string | null;
  title: string;
  client_name: string | null;
  category: string;
  description: string;
  year: number;
  amount_label: string | null;
  is_featured: boolean;
}

const typeLabels: Record<string, string> = {
  "M&A": "M&A",
  "PE": "Private Equity",
  "Private Equity": "Private Equity",
  "Litigation": "Contentieux",
  "Contentieux": "Contentieux",
  "Restructuring": "Restructuration",
  "Tax": "Droit fiscal",
  "Corporate": "Corporate",
};

export default async function DealsPage() {
  const supabase = await createClient();

  const { data: deals } = await supabase
    .from("deals")
    .select("id, slug, title, client_name, category, description, year, amount_label, is_featured")
    .order("year", { ascending: false })
    .order("display_order", { ascending: true });

  const featured = (deals ?? []).filter((d: Deal) => d.is_featured);
  const others = (deals ?? []).filter((d: Deal) => !d.is_featured);

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
            Deals notables
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
            Une sélection d&apos;opérations<br />
            <span style={{ fontStyle: "italic" }}>récentes et représentatives.</span>
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
            Par respect de la confidentialité, certaines opérations sont
            présentées de manière anonymisée. D&apos;autres sont publiées avec
            l&apos;accord des parties.
          </p>
        </div>
      </section>

      {/* Featured deals */}
      {featured.length > 0 && (
        <section className="py-24 md:py-32" style={{ backgroundColor: "var(--surface)" }}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <p
              className="text-xs font-medium tracking-widest uppercase mb-14"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
            >
              Opérations phares
            </p>
            <div className="space-y-px" style={{ border: "1px solid var(--border)" }}>
              {featured.map((deal: Deal, i: number) => (
                <DealRow key={deal.id} deal={deal} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other deals */}
      {others.length > 0 && (
        <section className="py-24 md:py-32" style={{ backgroundColor: "var(--surface-alt)" }}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <p
              className="text-xs font-medium tracking-widest uppercase mb-14"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
            >
              Autres opérations
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ border: "1px solid var(--border)" }}>
              {others.map((deal: Deal) => (
                <div
                  key={deal.id}
                  className="p-8"
                  style={{ backgroundColor: "var(--surface)" }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-medium tracking-widest uppercase px-2 py-0.5"
                        style={{
                          fontFamily: "var(--font-body)",
                          color: "var(--bordeaux)",
                          border: "1px solid var(--bordeaux)",
                        }}
                      >
                        {typeLabels[deal.category] ?? deal.category}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.8125rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {deal.year}
                      </span>
                    </div>
                    {deal.amount_label && (
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 500,
                          fontSize: "1rem",
                          color: "var(--text-primary)",
                        }}
                      >
                        {deal.amount_label}
                      </span>
                    )}
                  </div>
                  {deal.client_name && (
                    <p
                      className="text-xs uppercase tracking-widest mb-2"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {deal.client_name}
                    </p>
                  )}
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      fontSize: "1.0625rem",
                      color: "var(--text-primary)",
                      lineHeight: 1.35,
                    }}
                  >
                    {deal.title}
                  </p>
                  <p
                    className="mt-3"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    {deal.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function DealRow({ deal, index }: { deal: Deal; index: number }) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 p-8 md:p-10"
      style={{
        backgroundColor: index % 2 === 0 ? "var(--surface)" : "var(--background)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span
            className="text-xs font-medium tracking-widest uppercase px-2 py-0.5"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--bordeaux)",
              border: "1px solid var(--bordeaux)",
            }}
          >
            {typeLabels[deal.category] ?? deal.category}
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
            }}
          >
            {deal.year}
          </span>
        </div>
        {deal.client_name && (
          <p
            className="text-xs uppercase tracking-widest mb-2"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--text-muted)",
            }}
          >
            {deal.client_name}
          </p>
        )}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "1.25rem",
            color: "var(--text-primary)",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
          }}
        >
          {deal.title}
        </p>
        <p
          className="mt-4 max-w-2xl"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.9375rem",
            color: "var(--text-secondary)",
            lineHeight: 1.75,
          }}
        >
          {deal.description}
        </p>
      </div>
      {deal.amount_label && (
        <div className="md:text-right shrink-0">
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "1.5rem",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            {deal.amount_label}
          </p>
          <p
            className="text-xs mt-1"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--text-muted)",
            }}
          >
            valeur de l&apos;opération
          </p>
        </div>
      )}
    </div>
  );
}