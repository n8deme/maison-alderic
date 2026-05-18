import Link from "next/link";

export default function SaasLegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          backgroundColor: "rgba(248,247,244,0.95)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20"
          style={{ height: "3.5rem", display: "flex", alignItems: "center" }}
        >
          <Link
            href="/"
            className="text-lg font-heading font-medium"
            style={{ color: "var(--foreground)" }}
          >
            Lawyer<span style={{ color: "var(--accent)" }}>OS</span>
          </Link>
        </div>
      </header>
      <main style={{ backgroundColor: "var(--surface)" }}>{children}</main>
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          backgroundColor: "var(--surface-alt)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm font-heading font-medium" style={{ color: "var(--foreground)" }}>
            Lawyer<span style={{ color: "var(--accent)" }}>OS</span>
          </span>
          <div className="flex gap-5">
            {[
              { href: "/cgv",              label: "CGV" },
              { href: "/mentions-legales", label: "Mentions légales" },
              { href: "/confidentialite",  label: "Confidentialité" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs"
                style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            © 2026 LawyerOS SRL
          </p>
        </div>
      </footer>
    </>
  );
}
