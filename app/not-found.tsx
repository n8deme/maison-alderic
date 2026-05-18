import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6 py-24"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <div className="max-w-2xl text-center">
        <p
          className="mb-8 text-xs font-medium uppercase tracking-[0.2em]"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          Erreur 404
        </p>

        <h1
          className="font-heading text-5xl font-medium italic leading-[1.05] tracking-tight md:text-7xl"
          style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
        >
          Cette page n’existe pas.
          <br />
          <span style={{ color: "var(--accent)" }}>
            Mais d’autres vous attendent.
          </span>
        </h1>

        <p
          className="mx-auto mt-10 max-w-md text-base leading-relaxed"
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
        >
          Le lien que vous avez suivi est rompu, ou la page a été déplacée.
          Reprenez la navigation à partir de l’accueil.
        </p>

        <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-sm px-6 py-3 text-sm font-medium transition-colors"
            style={{
              backgroundColor: "var(--foreground)",
              color: "var(--background)",
              fontFamily: "var(--font-body)",
            }}
          >
            Retour à l’accueil
          </Link>
          <Link
            href="/demo/contact"
            className="inline-flex items-center justify-center rounded-sm border px-6 py-3 text-sm font-medium transition-colors"
            style={{
              borderColor: "var(--border)",
              color: "var(--foreground)",
              fontFamily: "var(--font-body)",
            }}
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </main>
  );
}
