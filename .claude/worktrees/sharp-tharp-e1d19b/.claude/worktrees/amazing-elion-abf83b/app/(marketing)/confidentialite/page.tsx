import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false },
};

export default function ConfidentialitePage() {
  return (
    <div className="py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-3xl mx-auto">
        <p
          className="text-xs font-medium uppercase tracking-widest mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          RGPD & Protection des données
        </p>
        <h1
          className="text-4xl font-heading font-medium tracking-tight mb-12"
          style={{ color: "var(--foreground)" }}
        >
          Politique de confidentialité
        </h1>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>

          <Section title="Qui sommes-nous ?">
            <p>
              LawyerOS SRL (BCE 0123.456.789, Avenue Louise 480, 1050 Bruxelles) est le <strong style={{ color: "var(--foreground)" }}>responsable du traitement</strong> des données personnelles collectées lors de l'inscription et de l'utilisation du service LawyerOS.
            </p>
            <p className="mt-3">
              Dans le cadre de la fourniture de services aux cabinets clients, LawyerOS SRL agit également en qualité de <strong style={{ color: "var(--foreground)" }}>sous-traitant</strong> au sens de l'article 28 du RGPD pour les données personnelles des clients finaux (justiciables, mandants) hébergées sur la plateforme par les cabinets d'avocats.
            </p>
          </Section>

          <Section title="Données collectées">
            <p className="mb-3">LawyerOS collecte les catégories de données suivantes :</p>
            <ul className="space-y-2 pl-4">
              {[
                "Données d'identification : nom, prénom, adresse email professionnelle, numéro de téléphone.",
                "Données de connexion : adresse IP, navigateur, horodatage des accès.",
                "Données de facturation : coordonnées de facturation, historique des transactions (les données de carte bancaire sont traitées exclusivement par Stripe Inc., certifié PCI DSS niveau 1).",
                "Données professionnelles : nom du cabinet, adresse, numéro ISDN le cas échéant, couleurs et logo uploadés.",
                "Données générées par l'utilisation : dossiers créés, documents déposés, messages échangés entre avocats et clients finaux. Ces données sont considérées comme potentiellement couvertes par le secret professionnel de l'avocat.",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span style={{ color: "var(--accent)" }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Finalités et bases légales">
            <div className="space-y-4">
              {[
                {
                  finalite: "Fourniture du service (gestion des comptes, accès au portail, synchronisation des données)",
                  base: "Exécution du contrat (art. 6.1.b RGPD)",
                },
                {
                  finalite: "Facturation et gestion des abonnements",
                  base: "Exécution du contrat et obligation légale (art. 6.1.b et 6.1.c RGPD)",
                },
                {
                  finalite: "Envoi d'emails transactionnels (connexion, rappels, notifications de dossier)",
                  base: "Exécution du contrat (art. 6.1.b RGPD)",
                },
                {
                  finalite: "Amélioration du service et analyses statistiques agrégées",
                  base: "Intérêt légitime (art. 6.1.f RGPD) — données anonymisées, sans profilage individuel",
                },
                {
                  finalite: "Communications commerciales LawyerOS (nouvelles fonctionnalités, offres)",
                  base: "Consentement révocable à tout moment (art. 6.1.a RGPD)",
                },
              ].map((row, i) => (
                <div key={i} className="p-4 rounded-sm" style={{ backgroundColor: "var(--surface-alt)" }}>
                  <p className="font-medium mb-1" style={{ color: "var(--foreground)" }}>
                    {row.finalite}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Base légale : {row.base}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Données juridiques et secret professionnel">
            <p>
              LawyerOS est conscient que les données hébergées sur la plateforme — dossiers, documents contractuels, correspondances avocat-client — peuvent être couvertes par le <strong style={{ color: "var(--foreground)" }}>secret professionnel de l'avocat</strong>, protégé par l'article 458 du Code pénal belge et les règlements du Barreau.
            </p>
            <p className="mt-3">
              En conséquence, LawyerOS s'engage à :
            </p>
            <ul className="mt-2 space-y-2 pl-4">
              {[
                "Ne jamais accéder au contenu des dossiers et documents sauf intervention technique expressément autorisée par le cabinet client.",
                "Ne jamais transmettre, vendre ou exploiter commercialement les données juridiques des clients finaux.",
                "Traiter toute demande de communication émanant d'une autorité comme une demande devant être validée par le cabinet client en sa qualité de responsable du traitement.",
                "Conclure un DPA (Data Processing Agreement) conforme à l'art. 28 RGPD avec chaque cabinet client sur demande.",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span style={{ color: "var(--accent)" }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Hébergement et transferts de données">
            <p>
              Toutes les données personnelles sont hébergées dans des centres de données situés en <strong style={{ color: "var(--foreground)" }}>Union européenne (Francfort, Allemagne)</strong> via Supabase (Supabase Inc., opérant sous AWS Frankfurt). Aucun transfert hors UE n'est effectué pour le stockage des données utilisateurs.
            </p>
            <p className="mt-3">
              Les sous-traitants ultérieurs de LawyerOS (Stripe pour les paiements, Resend pour les emails transactionnels) opèrent sous des garanties contractuelles conformes au RGPD (Clauses Contractuelles Types).
            </p>
          </Section>

          <Section title="Durée de conservation">
            <ul className="space-y-2 pl-4">
              {[
                "Données de compte actif : conservées pendant toute la durée de l'abonnement.",
                "Données après résiliation : conservées 30 jours (pour permettre la récupération), puis supprimées définitivement.",
                "Données de facturation et comptables : conservées 7 ans conformément à la législation comptable belge.",
                "Logs de connexion : conservés 12 mois à des fins de sécurité.",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span style={{ color: "var(--accent)" }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Vos droits (RGPD)">
            <p className="mb-3">
              Conformément au Règlement (UE) 2016/679 (RGPD) et à la loi belge du 30 juillet 2018 relative à la protection des personnes physiques à l'égard des traitements de données à caractère personnel, vous disposez des droits suivants :
            </p>
            <ul className="space-y-2 pl-4">
              {[
                "Droit d'accès à vos données personnelles",
                "Droit de rectification des données inexactes",
                "Droit à l'effacement (« droit à l'oubli »)",
                "Droit à la limitation du traitement",
                "Droit à la portabilité de vos données",
                "Droit d'opposition au traitement fondé sur l'intérêt légitime",
                "Droit de retirer votre consentement à tout moment",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span style={{ color: "var(--accent)" }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à <a href="mailto:privacy@lawyeros.be" style={{ color: "var(--accent)" }}>privacy@lawyeros.be</a>. Nous répondrons dans un délai maximal de 30 jours.
            </p>
            <p className="mt-3">
              Vous pouvez également introduire une réclamation auprès de l'Autorité de protection des données belge (APD) : <strong style={{ color: "var(--foreground)" }}>www.autoriteprotectiondonnees.be</strong>.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              LawyerOS utilise des cookies strictement nécessaires au fonctionnement du service (session d'authentification). Aucun cookie publicitaire ou de tracking tiers n'est déposé. Vous pouvez configurer votre navigateur pour refuser les cookies, mais certaines fonctionnalités du portail ne seront alors plus disponibles.
            </p>
          </Section>

          <Section title="Contact DPO">
            <p>
              LawyerOS SRL n'a pas l'obligation légale de désigner un DPO. Toute question relative à la protection des données peut être adressée à : <a href="mailto:privacy@lawyeros.be" style={{ color: "var(--accent)" }}>privacy@lawyeros.be</a>
            </p>
          </Section>

          <p className="text-xs pt-6 border-t" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
            Dernière mise à jour : 1er mai 2026. Version 1.0.
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
