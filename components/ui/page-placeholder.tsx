import Link from "next/link";

interface PagePlaceholderProps {
  title: string;
  path: string;
  section?: "public" | "legal" | "portail";
}

export function PagePlaceholder({ title, path, section = "public" }: PagePlaceholderProps) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* Section badge */}
        <span
          className="inline-block text-xs font-medium tracking-widest uppercase px-3 py-1 border"
          style={{
            color: "var(--text-muted)",
            borderColor: "var(--border)",
            fontFamily: "var(--font-body)",
          }}
        >
          {section === "portail" ? "Portail client" : section === "legal" ? "Pages légales" : "Site vitrine"}
        </span>

        {/* Page title */}
        <h1
          className="text-4xl md:text-5xl"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
          }}
        >
          {title}
        </h1>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-3">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "var(--bordeaux)" }}
          />
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--text-secondary)",
              fontSize: "0.9375rem",
            }}
          >
            Page en construction — Session 2
          </p>
        </div>

        {/* Path */}
        <code
          className="text-xs px-2 py-1"
          style={{
            fontFamily: "ui-monospace, monospace",
            color: "var(--text-muted)",
            backgroundColor: "var(--surface-alt)",
          }}
        >
          {path}
        </code>

        {/* Back link */}
        <div className="pt-4">
          <Link
            href="/"
            className="text-sm transition-colors"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--text-secondary)",
            }}
          >
            ← Maison Aldéric & Associés
          </Link>
        </div>
      </div>
    </main>
  );
}
