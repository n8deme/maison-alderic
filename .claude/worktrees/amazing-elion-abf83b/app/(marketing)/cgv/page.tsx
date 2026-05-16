import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  robots: { index: false },
};

export default function CgvPage() {
  return (
    <div className="py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-3xl mx-auto">
        <p
          className="text-xs font-medium uppercase tracking-widest mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Conditions contractuelles
        </p>
        <h1
          className="text-4xl font-heading font-medium tracking-tight mb-12"
          style={{ color: "var(--foreground)" }}
        >
          Conditions générales de vente
        </h1>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>

          <div
            className="p-5 rounded-sm border"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-alt)" }}
          >
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Les présentes Conditions Générales de Vente (CGV) régissent l'accès et l'utilisation du service LawyerOS, plateforme SaaS de gestion de portail client pour cabinets d'avocats, éditée par LawyerOS SRL, société de droit belge (BCE 0123.456.789), sise Avenue Louise 480, 1050 Bruxelles.
            </p>
          </div>

          <Section title="Article 1 — Définitions">
            <ul className="space-y-3 pl-4">
              {[
                { term: "Service", def: "La plateforme LawyerOS accessible via lawyeros.be et les sous-domaines associés, comprenant le portail client white-label, les outils de gestion de dossiers, de messagerie, de facturation et de prise de rendez-vous." },
                { term: "Cabinet Client", def: "Tout professionnel du droit (avocat, cabinet d'avocats, association d'avocats) ayant souscrit un abonnement LawyerOS." },
                { term: "Client Final", def: "Le justiciable ou mandant du Cabinet Client, bénéficiaire du portail client mis à disposition par le Cabinet Client via LawyerOS." },
                { term: "Abonnement", def: "Le contrat à durée déterminée ou indéterminée liant LawyerOS SRL au Cabinet Client, donnant accès aux fonctionnalités correspondant au plan choisi." },
                { term: "Données Juridiques", def: "Toutes les informations hébergées sur la plateforme par le Cabinet Client, susceptibles d'être couvertes par le secret professionnel de l'avocat." },
              ].map(({ term, def }) => (
                <li key={term} className="flex gap-2">
                  <span className="shrink-0 font-medium" style={{ color: "var(--foreground)" }}>{term} :</span>
                  <span>{def}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Article 2 — Accès au service et période d'essai">
            <p>
              Tout Cabinet Client bénéficie d'une <strong style={{ color: "var(--foreground)" }}>période d'essai de 14 jours</strong> à compter de la création du compte, sans engagement et sans obligation de renseignement de coordonnées bancaires. Durant cette période, les fonctionnalités du plan Cabinet sont accessibles dans leur intégralité.
            </p>
            <p className="mt-3">
              À l'issue de la période d'essai, la poursuite de l'utilisation du service implique la souscription d'un abonnement payant. En l'absence de souscription, les données sont conservées 30 jours supplémentaires, puis supprimées définitivement.
            </p>
          </Section>

          <Section title="Article 3 — Plans et tarification">
            <p className="mb-4">LawyerOS propose trois formules d'abonnement :</p>
            <div className="space-y-3">
              {[
                { plan: "Solo", price: "79 €/mois HT", features: "1 avocat · 10 dossiers actifs · Portail client · Messagerie sécurisée · Facturation de base" },
                { plan: "Cabinet", price: "199 €/mois HT", features: "5 avocats · Dossiers illimités · Signature électronique · Formulaires intake · Rappels SMS" },
                { plan: "Premium", price: "399 €/mois HT", features: "Avocats illimités · IA résumés · Domaine personnalisé · Automatisations avancées · Support dédié" },
              ].map(({ plan, price, features }) => (
                <div
                  key={plan}
                  className="p-4 rounded-sm border"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-medium" style={{ color: "var(--foreground)" }}>{plan}</span>
                    <span className="font-medium" style={{ color: "var(--foreground)" }}>{price}</span>
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{features}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">
              Une réduction de <strong style={{ color: "var(--foreground)" }}>20% est appliquée sur la facturation annuelle</strong> (paiement en une fois pour 12 mois). Les prix s'entendent hors TVA belge (21%). La TVA applicable dépend de la situation fiscale du Cabinet Client.
            </p>
            <p className="mt-3">
              LawyerOS se réserve le droit de modifier ses tarifs avec un préavis de 60 jours. En cas de désaccord, le Cabinet Client peut résilier son abonnement sans pénalité avant l'entrée en vigueur du nouveau tarif.
            </p>
          </Section>

          <Section title="Article 4 — Modalités de paiement">
            <p>
              Les paiements sont traités par <strong style={{ color: "var(--foreground)" }}>Stripe Inc.</strong>, certifié PCI DSS niveau 1. LawyerOS SRL ne stocke aucune donnée de carte bancaire. La facturation est mensuelle ou annuelle, par prélèvement automatique sur la carte enregistrée lors de la souscription.
            </p>
            <p className="mt-3">
              En cas d'échec de paiement, LawyerOS notifie le Cabinet Client par email et tente trois nouveaux prélèvements à 3, 5 et 7 jours d'intervalle. Passé ce délai, l'accès au service peut être suspendu. Les données sont conservées durant 30 jours supplémentaires avant suppression définitive.
            </p>
            <p className="mt-3">
              Conformément à l'article VI.48 du Code de droit économique belge, les Cabinets Clients personnes physiques agissant dans un cadre professionnel reconnaissent expressément renoncer au droit de rétractation de 14 jours pour les abonnements numériques dont l'exécution a commencé.
            </p>
          </Section>

          <Section title="Article 5 — Obligations de LawyerOS SRL">
            <p>LawyerOS SRL s'engage à :</p>
            <ul className="mt-2 space-y-2 pl-4">
              {[
                "Maintenir une disponibilité du service d'au moins 99,5% sur une base mensuelle (hors maintenance planifiée notifiée 48h à l'avance).",
                "Sauvegarder les données quotidiennement avec une rétention de 30 jours.",
                "Notifier le Cabinet Client dans les 72 heures de tout incident de sécurité susceptible d'affecter ses données, conformément à l'article 33 du RGPD.",
                "Ne jamais accéder au contenu des Données Juridiques sauf intervention technique expressément autorisée par le Cabinet Client.",
                "Fournir un support technique par email dans un délai de 24h ouvrables (48h pour le plan Solo).",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span style={{ color: "var(--accent)" }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Article 6 — Obligations du Cabinet Client">
            <p>Le Cabinet Client s'engage à :</p>
            <ul className="mt-2 space-y-2 pl-4">
              {[
                "Utiliser le service dans le respect du droit belge, des règles déontologiques du Barreau et des présentes CGV.",
                "Ne pas partager ses identifiants de connexion et maintenir la confidentialité de son espace.",
                "Informer ses Clients Finaux de l'utilisation d'un outil tiers (LawyerOS) pour la gestion de leur portail client, conformément aux obligations d'information du RGPD.",
                "Ne pas utiliser le service à des fins de blanchiment d'argent, de financement du terrorisme ou de toute activité illicite.",
                "Respecter les droits de propriété intellectuelle de LawyerOS SRL.",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span style={{ color: "var(--accent)" }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Article 7 — Responsabilité">
            <p>
              LawyerOS SRL est soumis à une <strong style={{ color: "var(--foreground)" }}>obligation de moyens</strong>, non de résultat. Sa responsabilité ne saurait être engagée pour des dommages indirects, pertes de chiffre d'affaires ou pertes de données résultant d'une force majeure, d'une utilisation non conforme du service ou d'un manquement du Cabinet Client à ses obligations.
            </p>
            <p className="mt-3">
              En tout état de cause, la responsabilité de LawyerOS SRL est limitée au montant des sommes versées par le Cabinet Client au cours des 12 derniers mois précédant le fait générateur du dommage.
            </p>
            <p className="mt-3">
              Le Cabinet Client reste seul responsable du respect de ses obligations déontologiques d'avocat vis-à-vis de ses Clients Finaux, notamment en matière de secret professionnel et de conseil juridique. LawyerOS SRL n'est en aucun cas un prestataire juridique.
            </p>
          </Section>

          <Section title="Article 8 — Résiliation">
            <p>
              Le Cabinet Client peut résilier son abonnement à tout moment depuis les paramètres de son compte. La résiliation prend effet à la fin de la période de facturation en cours. Aucun remboursement partiel n'est accordé pour la période restante.
            </p>
            <p className="mt-3">
              LawyerOS SRL peut résilier l'abonnement avec un préavis de 30 jours, ou immédiatement en cas de violation grave des présentes CGV (notamment en cas d'utilisation illicite du service).
            </p>
            <p className="mt-3">
              Après résiliation, les données sont exportables pendant 30 jours via l'interface d'export (format JSON et CSV). Passé ce délai, elles sont supprimées définitivement et irrémédiablement.
            </p>
          </Section>

          <Section title="Article 9 — Propriété intellectuelle">
            <p>
              La plateforme LawyerOS, son code source, ses interfaces et ses marques restent la propriété exclusive de LawyerOS SRL. L'abonnement confère une licence d'utilisation personnelle, non transférable et non exclusive.
            </p>
            <p className="mt-3">
              Le Cabinet Client concède à LawyerOS SRL une licence limitée et non exclusive sur son logo et ses couleurs aux seules fins de personnalisation du portail client.
            </p>
          </Section>

          <Section title="Article 10 — Droit applicable et règlement des litiges">
            <p>
              Les présentes CGV sont régies par le <strong style={{ color: "var(--foreground)" }}>droit belge</strong>. En cas de litige, les parties s'engagent à rechercher une solution amiable dans un délai de 30 jours. À défaut d'accord, les tribunaux de <strong style={{ color: "var(--foreground)" }}>l'arrondissement judiciaire de Bruxelles</strong> seront seuls compétents.
            </p>
            <p className="mt-3">
              Conformément au Règlement (UE) n° 524/2013, les consommateurs européens peuvent recourir à la plateforme de résolution des litiges en ligne de la Commission européenne.
            </p>
          </Section>

          <Section title="Article 11 — Modifications des CGV">
            <p>
              LawyerOS SRL se réserve le droit de modifier les présentes CGV. Toute modification substantielle sera notifiée par email avec un préavis de 30 jours. La poursuite de l'utilisation du service après ce délai vaut acceptation des nouvelles CGV.
            </p>
          </Section>

          <p className="text-xs pt-6 border-t" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
            Version 1.0 — En vigueur à compter du 1er mai 2026.<br />
            LawyerOS SRL · BCE 0123.456.789 · Avenue Louise 480, 1050 Bruxelles · legal@lawyeros.be
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
