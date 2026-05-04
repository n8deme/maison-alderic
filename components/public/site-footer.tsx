import Link from "next/link";

const expertisesLinks = [
  { href: "/expertises#ma", label: "Fusions & Acquisitions" },
  { href: "/expertises#pe", label: "Private Equity" },
  { href: "/expertises#contentieux", label: "Contentieux" },
  { href: "/expertises#tax", label: "Droit fiscal international" },
];

const cabinetLinks = [
  { href: "/associes", label: "Nos associés" },
  { href: "/deals", label: "Deals notables" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Carrières" },
];

export function SiteFooter() {
  return (
    <footer
      style={{
        backgroundColor: "var(--surface-alt)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1 — Logo + tagline + adresse */}
          <div className="space-y-5">
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "1rem",
                color: "var(--text-primary)",
              }}
            >
              Maison Aldéric<br />&amp; Associés
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontStyle: "italic",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              Le droit comme architecture stratégique.
            </p>
            <address
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                color: "var(--text-muted)",
                lineHeight: 1.7,
                fontStyle: "normal",
              }}
            >
              Avenue Louise 480<br />
              1050 Bruxelles, Belgique<br />
              +32 2 234 56 00<br />
              contact@maison-alderic.be
            </address>
          </div>

          {/* Col 2 — Expertises */}
          <div className="space-y-4">
            <p
              className="text-xs font-medium tracking-widest uppercase"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
            >
              Expertises
            </p>
            <ul className="space-y-3">
              {expertisesLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Cabinet */}
          <div className="space-y-4">
            <p
              className="text-xs font-medium tracking-widest uppercase"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
            >
              Cabinet
            </p>
            <ul className="space-y-3">
              {cabinetLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div className="space-y-4">
            <p
              className="text-xs font-medium tracking-widest uppercase"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
            >
              Prendre contact
            </p>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
              }}
            >
              <p>Lundi – vendredi</p>
              <p>8h30 – 18h00</p>
            </div>
            <Link
              href="/contact"
              className="inline-block text-xs font-medium tracking-widest uppercase px-4 py-2 mt-2 transition-colors"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--bordeaux)",
                border: "1px solid var(--bordeaux)",
              }}
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
            }}
          >
            © 2026 Maison Aldéric &amp; Associés SCRL — RPM Bruxelles — BCE 0123.456.789
          </p>
          <div className="flex items-center gap-6">
            {[
              { href: "/mentions-legales", label: "Mentions légales" },
              { href: "/confidentialite", label: "Confidentialité" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
