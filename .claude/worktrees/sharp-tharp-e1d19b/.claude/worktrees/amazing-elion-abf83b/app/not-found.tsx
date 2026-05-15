import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="max-w-2xl w-full text-center space-y-8">
        <p
          className="text-sm tracking-widest uppercase"
          style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
        >
          Erreur 404
        </p>

        <h1
          className="text-5xl md:text-6xl italic"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
          }}
        >
          Ubi nihil vales,
          <br />
          ibi nihil velis.
        </h1>

        <p
          className="text-sm"
          style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
        >
          Cette page n&apos;existe pas.
        </p>

        <Link
          href="/"
          className="inline-block text-sm border px-6 py-3 transition-colors hover:bg-[#1A1A1A] hover:text-[#F8F7F4]"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
