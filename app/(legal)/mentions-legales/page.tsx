import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales — Maison Aldéric & Associés",
};

export default function MentionsLegalesPage() {
  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: "var(--surface)" }}>
      <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-20">
        <p
          className="text-xs font-medium tracking-widest uppercase mb-8"
          style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
        >
          Informations légales
        </p>
        <h1
          className="mb-12"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
          }}
        >
          Mentions légales
        </h1>

        <div className="space-y-12" style={{ fontFamily: "var(--font-body)" }}>
          <LegalSection title="Identité de la société">
            <p>
              <strong>Maison Aldéric &amp; Associés SCRL</strong> est une société civile à responsabilité
              limitée à forme coopérative de droit belge, inscrite au Registre des Personnes Morales (RPM)
              de Bruxelles sous le numéro BCE <strong>0123.456.789</strong>.
            </p>
            <p className="mt-4">
              Siège social : Avenue Louise 480, 1050 Bruxelles, Belgique.
            </p>
          </LegalSection>

          <LegalSection title="Barreau et réglementation professionnelle">
            <p>
              Les avocats de Maison Aldéric &amp; Associés sont inscrits au Barreau de Bruxelles et
              soumis aux règles déontologiques de l&apos;Ordre des barreaux francophones et germanophone
              (OBFG) et de l&apos;Orde van Vlaamse Balies (OVB), ainsi qu&apos;aux règles du Conseil des
              barreaux européens (CCBE).
            </p>
            <p className="mt-4">
              Le titre d&apos;avocat est réglementé en Belgique. L&apos;exercice de la profession est
              soumis à la loi du 13 mars 1973 relative à l&apos;indemnité en cas de désistement dans le
              chef d&apos;une partie et aux règles de la procédure judiciaire belge.
            </p>
          </LegalSection>

          <LegalSection title="Assurance responsabilité professionnelle">
            <p>
              La société est couverte par une police d&apos;assurance responsabilité civile
              professionnelle souscrite auprès d&apos;un assureur agréé en Belgique. La couverture
              s&apos;étend aux activités exercées depuis la Belgique, y compris les conseils transfrontaliers
              au sein de l&apos;Union européenne.
            </p>
          </LegalSection>

          <LegalSection title="Hébergement du site">
            <p>
              Ce site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
              Les données de navigation sont traitées dans le respect du RGPD. Pour plus de détails,
              consultez notre <a href="/confidentialite" style={{ color: "var(--bordeaux)" }}>politique de confidentialité</a>.
            </p>
          </LegalSection>

          <LegalSection title="Propriété intellectuelle">
            <p>
              L&apos;ensemble du contenu de ce site (textes, visuels, structure, code) est la propriété
              exclusive de Maison Aldéric &amp; Associés SCRL ou de ses ayants droit. Toute reproduction,
              même partielle, est interdite sans autorisation écrite préalable.
            </p>
          </LegalSection>

          <LegalSection title="Limitation de responsabilité">
            <p>
              Les informations publiées sur ce site ont un caractère général et ne constituent pas un
              conseil juridique. Elles ne sauraient engager la responsabilité de la société. Seule une
              consultation avec un avocat permet d&apos;obtenir un avis juridique applicable à une
              situation particulière.
            </p>
          </LegalSection>

          <LegalSection title="Contact">
            <p>
              Pour toute question relative aux présentes mentions légales :
              <br />
              <a href="mailto:contact@maison-alderic.be" style={{ color: "var(--bordeaux)" }}>
                contact@maison-alderic.be
              </a>
              <br />
              +32 2 234 56 00
            </p>
          </LegalSection>
        </div>
      </div>
    </section>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2
        className="mb-4"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "1.125rem",
          color: "var(--text-primary)",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontSize: "0.9375rem",
          color: "var(--text-secondary)",
          lineHeight: 1.8,
          borderLeft: "2px solid var(--border)",
          paddingLeft: "1.25rem",
        }}
      >
        {children}
      </div>
    </div>
  );
}
