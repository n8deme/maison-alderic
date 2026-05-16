import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false },
};

export default function ConfidentialitePage() {
  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: "var(--surface)" }}>
      <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-20">
        <p
          className="text-xs font-medium tracking-widest uppercase mb-8"
          style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
        >
          RGPD
        </p>
        <h1
          className="mb-4"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
          }}
        >
          Politique de confidentialité
        </h1>
        <p
          className="mb-12"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--text-muted)",
          }}
        >
          Dernière mise à jour : 1er janvier 2026
        </p>

        <div className="space-y-12" style={{ fontFamily: "var(--font-body)" }}>
          <PrivacySection title="Responsable du traitement">
            <p>
              Le responsable du traitement des données personnelles collectées via ce site et la
              plateforme LawyerOS est <strong>LawyerOS SRL</strong>, Bruxelles, Belgique — BCE
              0123.456.789.
            </p>
            <p className="mt-4">
              Contact DPO :{" "}
              <a href="mailto:dpo@lawyeros.app" style={{ color: "var(--accent)" }}>
                dpo@lawyeros.app
              </a>
            </p>
          </PrivacySection>

          <PrivacySection title="Données collectées et finalités">
            <p>Nous collectons les données suivantes :</p>
            <ul className="mt-4 space-y-3 list-none">
              {[
                ["Formulaire de contact", "Nom, e-mail, société, objet, message — pour répondre à votre demande (base : exécution de mesures précontractuelles, art. 6.1.b RGPD)"],
                ["Portail client", "Données d'authentification, documents partagés, messages — pour la gestion de votre dossier (base : exécution du contrat, art. 6.1.b RGPD)"],
                ["Navigation", "Adresse IP, pages visitées, durée de session — pour les statistiques d'usage et la sécurité (base : intérêt légitime, art. 6.1.f RGPD)"],
              ].map(([cat, desc]) => (
                <li key={cat} className="flex gap-3">
                  <span
                    className="mt-2 shrink-0 w-1 h-1 rounded-full"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                  <span>
                    <strong>{cat}</strong> — {desc}
                  </span>
                </li>
              ))}
            </ul>
          </PrivacySection>

          <PrivacySection title="Durée de conservation">
            <p>
              Les données de contact sont conservées 3 ans à compter de votre dernière prise de contact.
              Les données du portail client sont conservées pendant la durée de la relation contractuelle,
              puis 10 ans à des fins d&apos;archivage légal (obligations comptables et professionnelles
              des avocats).
            </p>
          </PrivacySection>

          <PrivacySection title="Destinataires des données">
            <p>
              Vos données ne sont pas vendues ni cédées à des tiers à des fins commerciales. Elles peuvent
              être transmises à des sous-traitants techniques (hébergeur, outil de messagerie) dans le
              cadre de contrats de traitement conformes au RGPD, ainsi que, le cas échéant, aux autorités
              compétentes sur réquisition judiciaire.
            </p>
          </PrivacySection>

          <PrivacySection title="Transferts hors UE">
            <p>
              L&apos;hébergement du site est assuré par Vercel Inc. (États-Unis). Des garanties
              appropriées sont en place (clauses contractuelles types de la Commission européenne) pour
              encadrer ce transfert.
            </p>
          </PrivacySection>

          <PrivacySection title="Vos droits">
            <p>
              Conformément au Règlement (UE) 2016/679 (RGPD), vous disposez des droits suivants :
            </p>
            <ul className="mt-4 space-y-2 list-none">
              {[
                "Droit d'accès à vos données",
                "Droit de rectification",
                "Droit à l'effacement (« droit à l'oubli »)",
                "Droit à la limitation du traitement",
                "Droit à la portabilité",
                "Droit d'opposition",
              ].map((right) => (
                <li key={right} className="flex gap-3">
                  <span
                    className="mt-2 shrink-0 w-1 h-1 rounded-full"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                  {right}
                </li>
              ))}
            </ul>
            <p className="mt-6">
              Pour exercer vos droits, écrivez à{" "}
              <a href="mailto:dpo@lawyeros.app" style={{ color: "var(--accent)" }}>
                dpo@lawyeros.app
              </a>
              . Vous disposez également du droit d&apos;introduire une réclamation auprès de
              l&apos;Autorité de protection des données (APD Belgique) : <strong>apd-gba.be</strong>.
            </p>
          </PrivacySection>

          <PrivacySection title="Cookies">
            <p>
              Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement du portail
              client (gestion de session). Aucun cookie publicitaire ou de tracking tiers n&apos;est déposé.
            </p>
          </PrivacySection>

          <PrivacySection title="Modifications">
            <p>
              Nous nous réservons le droit de mettre à jour cette politique. La version en vigueur est
              toujours accessible à cette adresse. Toute modification substantielle vous sera notifiée
              par e-mail si vous disposez d&apos;un compte sur le portail client.
            </p>
          </PrivacySection>
        </div>
      </div>
    </section>
  );
}

function PrivacySection({ title, children }: { title: string; children: React.ReactNode }) {
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
