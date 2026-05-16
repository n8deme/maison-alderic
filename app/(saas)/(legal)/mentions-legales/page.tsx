import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false },
};

export default function MentionsLegalesPage() {
  return (
    <section className="py-24 md:py-32">
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
            color: "var(--foreground)",
          }}
        >
          Mentions légales
        </h1>

        <div className="space-y-12" style={{ fontFamily: "var(--font-body)" }}>
          <LegalSection title="Éditeur du service">
            <p>
              <strong>LawyerOS SRL</strong> est une société de droit belge inscrite à la Banque-Carrefour
              des Entreprises sous le numéro BCE <strong>0123.456.789</strong>.
            </p>
            <p className="mt-4">
              Siège social : Bruxelles, Belgique.
            </p>
            <p className="mt-4">
              Contact :{" "}
              <a href="mailto:legal@lawyeros.app" style={{ color: "var(--accent)" }}>
                legal@lawyeros.app
              </a>
            </p>
          </LegalSection>

          <LegalSection title="Directeur de la publication">
            <p>
              Le directeur de la publication du site <strong>lawyeros.app</strong> est le représentant
              légal de LawyerOS SRL.
            </p>
          </LegalSection>

          <LegalSection title="Hébergement">
            <p>
              Le site et la plateforme LawyerOS sont hébergés par <strong>Vercel Inc.</strong>,
              440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. Les données sont traitées dans
              le respect du RGPD. Pour plus de détails, consultez notre{" "}
              <a href="/confidentialite" style={{ color: "var(--accent)" }}>
                politique de confidentialité
              </a>
              .
            </p>
            <p className="mt-4">
              Les bases de données sont hébergées par <strong>Supabase Inc.</strong> (AWS eu-west-1,
              Irlande) — au sein de l&apos;Union européenne.
            </p>
          </LegalSection>

          <LegalSection title="Propriété intellectuelle">
            <p>
              L&apos;ensemble du contenu de ce site (textes, visuels, interfaces, code source, marques)
              est la propriété exclusive de LawyerOS SRL ou de ses partenaires. Toute reproduction, même
              partielle, est interdite sans autorisation écrite préalable.
            </p>
            <p className="mt-4">
              Les données hébergées par les cabinets clients (dossiers, documents, messages) restent la
              propriété exclusive de ces cabinets et de leurs clients finaux. LawyerOS SRL n&apos;y
              accède pas à des fins commerciales.
            </p>
          </LegalSection>

          <LegalSection title="Limitation de responsabilité">
            <p>
              LawyerOS SRL met tout en œuvre pour assurer la disponibilité et l&apos;exactitude des
              informations publiées sur ce site. Les informations présentées ont un caractère général et
              ne constituent pas un conseil juridique. Seul un avocat qualifié peut fournir un avis
              applicable à une situation particulière.
            </p>
          </LegalSection>

          <LegalSection title="Droit applicable">
            <p>
              Les présentes mentions légales sont régies par le droit belge. Tout litige relatif à leur
              interprétation ou à leur exécution relève de la compétence exclusive des tribunaux de
              l&apos;arrondissement judiciaire de Bruxelles.
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
          color: "var(--foreground)",
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
