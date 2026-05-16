import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false },
};

export default function MentionsLegalesPage() {
  return (
    <div className="py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-3xl mx-auto">
        <p
          className="text-xs font-medium uppercase tracking-widest mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Informations légales
        </p>
        <h1
          className="text-4xl font-heading font-medium tracking-tight mb-12"
          style={{ color: "var(--foreground)" }}
        >
          Mentions légales
        </h1>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>

          <Section title="Éditeur du service">
            <p>
              <strong style={{ color: "var(--foreground)" }}>LawyerOS SRL</strong><br />
              Société à responsabilité limitée de droit belge<br />
              Numéro d'entreprise (BCE) : 0123.456.789<br />
              Numéro de TVA : BE 0123.456.789<br />
              Siège social : Avenue Louise 480, bte 90, 1050 Bruxelles, Belgique<br />
              Adresse email : legal@lawyeros.be<br />
              Téléphone : +32 2 000 00 00
            </p>
            <p className="mt-3">
              LawyerOS est une marque déposée de LawyerOS SRL. Tous droits réservés.
            </p>
          </Section>

          <Section title="Hébergement">
            <p>
              Le service LawyerOS est hébergé sur l'infrastructure de :<br /><br />
              <strong style={{ color: "var(--foreground)" }}>Vercel Inc.</strong><br />
              440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br />
              Les données personnelles des utilisateurs sont stockées exclusivement dans des centres de données situés en Union européenne (région EU Frankfurt — Germany) via Supabase.
            </p>
          </Section>

          <Section title="Directeur de la publication">
            <p>
              Le directeur de la publication est le gérant de LawyerOS SRL, conformément à la loi du 11 mars 2003 sur certains aspects juridiques des services de la société de l'information.
            </p>
          </Section>

          <Section title="Propriété intellectuelle">
            <p>
              L'ensemble des éléments constituant le service LawyerOS (textes, graphismes, logiciels, code source, base de données, marques, logos) est la propriété exclusive de LawyerOS SRL ou de ses concédants de licence. Toute reproduction, représentation, modification, publication, transmission ou dénaturation, totale ou partielle, est interdite sans l'accord préalable et écrit de LawyerOS SRL.
            </p>
            <p className="mt-3">
              Les cabinets clients de LawyerOS conservent l'intégralité des droits de propriété sur le contenu qu'ils hébergent sur la plateforme (documents, dossiers, correspondances). LawyerOS SRL n'acquiert aucun droit sur ce contenu.
            </p>
          </Section>

          <Section title="Liens hypertextes">
            <p>
              LawyerOS SRL n'est pas responsable du contenu des sites tiers vers lesquels des liens peuvent être établis depuis le service. La mise en place d'un lien vers le site de LawyerOS est soumise à l'accord préalable de LawyerOS SRL.
            </p>
          </Section>

          <Section title="Droit applicable et juridiction">
            <p>
              Les présentes mentions légales sont régies par le droit belge. Tout litige relatif à l'utilisation du service LawyerOS sera soumis à la compétence exclusive des tribunaux de l'arrondissement judiciaire de Bruxelles, sauf disposition légale contraire.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter à l'adresse suivante : <a href="mailto:legal@lawyeros.be" style={{ color: "var(--accent)" }}>legal@lawyeros.be</a>
            </p>
          </Section>

          <p className="text-xs pt-6 border-t" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
            Dernière mise à jour : 1er mai 2026
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2
        className="text-base font-heading font-medium tracking-tight mb-3"
        style={{ color: "var(--foreground)" }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
