import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documentation — LawyerOS",
  description: "Guide complet pour configurer et utiliser LawyerOS : dossiers, portail client, facturation, sécurité.",
};

type Section = {
  id:      string;
  title:   string;
  content: { heading: string; body: string }[];
};

const SECTIONS: Section[] = [
  {
    id:    "demarrage",
    title: "Démarrage rapide",
    content: [
      {
        heading: "Créer votre cabinet en 10 minutes",
        body:    "Rendez-vous sur /signup et renseignez vos informations : nom complet, email professionnel, mot de passe et nom de votre cabinet. LawyerOS génère automatiquement votre sous-domaine (ex. cabinet-dupont.lawyeros.app) et crée votre espace dédié. Aucune carte bancaire requise pendant les 14 premiers jours.",
      },
      {
        heading: "Accéder au portail avocat",
        body:    "Après inscription, vous êtes redirigé vers /portail-avocat. C'est votre espace de travail principal : tableau de bord KPI, liste des dossiers, clients, agenda, facturation. Vos clients accèdent à un portail séparé (/portail) avec une vue épurée de leurs propres dossiers et documents.",
      },
      {
        heading: "Inviter votre équipe",
        body:    "Depuis les paramètres de votre cabinet, invitez vos collaborateurs par email. Chaque membre reçoit un lien magique de connexion. Les rôles disponibles sont : Propriétaire, Administrateur, Avocat, Secrétaire. Les clients sont invités directement depuis la fiche dossier.",
      },
    ],
  },
  {
    id:    "dossiers",
    title: "Dossiers",
    content: [
      {
        heading: "Créer un dossier",
        body:    "Cliquez sur \"Nouveau dossier\" depuis /portail-avocat/dossiers. Renseignez le client (existant ou nouveau), le titre, le type de dossier (M&A, Litigation, Tax, Corporate, PE, Restructuring), l'avocat lead, les membres de l'équipe et le budget estimé. La référence est générée automatiquement au format MA-2026-0001.",
      },
      {
        heading: "Suivi de la timeline",
        body:    "Chaque dossier dispose d'une timeline complète : notes internes (visibles uniquement par le cabinet), notes partagées (visibles par le client), saisie des temps facturables et pièces jointes. Les statuts disponibles sont : Actif, Suspendu, Clôturé.",
      },
      {
        heading: "Saisie des temps",
        body:    "Depuis l'onglet \"Temps\" d'un dossier, saisissez votre durée (en minutes), votre description, votre taux horaire et la date. Le montant total est calculé automatiquement. Les entrées peuvent être marquées \"facturées\" lors de la création d'une facture liée au dossier.",
      },
      {
        heading: "Détection de conflits",
        body:    "Avant d'accepter un nouveau client, utilisez /portail-avocat/conflits pour rechercher des correspondances dans votre base de données. Le moteur vérifie les noms, entreprises et dossiers existants pour signaler tout conflit d'intérêts potentiel.",
      },
    ],
  },
  {
    id:    "portail-client",
    title: "Portail client",
    content: [
      {
        heading: "Accès et connexion",
        body:    "Vos clients accèdent à leur portail sur l'URL de votre cabinet (ex. cabinet-dupont.lawyeros.app/portail). La connexion se fait par magic link envoyé à leur email — aucun mot de passe à mémoriser. Une connexion par mot de passe est également disponible si vous le configurez.",
      },
      {
        heading: "Ce que voit le client",
        body:    "Le client voit uniquement ses propres dossiers, les notes partagées par son avocat, ses documents téléchargeables, ses factures et son historique de messagerie. Les notes internes et les données de temps ne sont jamais exposées.",
      },
      {
        heading: "Messagerie sécurisée",
        body:    "Chaque dossier dispose d'un fil de messagerie direct entre le client et son avocat. Les messages sont stockés en base et l'avocat reçoit une notification email à chaque nouveau message. Évitez les échanges sensibles par email non sécurisé — utilisez LawyerOS.",
      },
      {
        heading: "Documents et signature",
        body:    "Uploadez des documents directement dans le dossier. Le client peut les consulter et les télécharger depuis son portail. En plan Premium, la signature électronique est disponible — le document est envoyé pour signature, le client signe depuis son navigateur et le document signé est archivé automatiquement.",
      },
    ],
  },
  {
    id:    "facturation",
    title: "Facturation",
    content: [
      {
        heading: "Créer une facture",
        body:    "Depuis /portail-avocat/facturation/nouvelle, sélectionnez le client, le dossier associé (optionnel), les dates d'émission et d'échéance, et ajoutez vos lignes de facturation (description, quantité, prix unitaire). La TVA à 21 % est calculée automatiquement. Le numéro de facture est généré au format MA2026-0001.",
      },
      {
        heading: "Envoi et paiement en ligne",
        body:    "Passez la facture en statut \"Envoyée\" pour qu'elle apparaisse dans le portail client. Le client peut payer directement en ligne via Stripe (carte bancaire, virement SEPA). Vous recevez une notification par email dès qu'un paiement est confirmé. Les webhooks Stripe mettent à jour le statut automatiquement.",
      },
      {
        heading: "Gérer votre abonnement LawyerOS",
        body:    "Depuis /portail-avocat/settings, cliquez sur \"Gérer mon abonnement\" pour accéder au portail Stripe. Vous pouvez y changer de plan, mettre à jour votre mode de paiement, télécharger vos factures LawyerOS et annuler votre abonnement.",
      },
    ],
  },
  {
    id:    "securite",
    title: "Sécurité",
    content: [
      {
        heading: "Authentification à deux facteurs (2FA)",
        body:    "Depuis /portail-avocat/settings, activez la 2FA TOTP dans la section \"Sécurité\". Scannez le QR code avec Google Authenticator, Authy ou toute application TOTP compatible. Entrez le code à 6 chiffres pour valider. Une fois activée, votre compte requiert le code à chaque connexion.",
      },
      {
        heading: "Isolation des données (multi-tenant)",
        body:    "Chaque cabinet est isolé par Row Level Security (RLS) dans Supabase. Un utilisateur ne peut jamais accéder aux données d'un autre cabinet, même en cas de bug applicatif. Les insertions et mises à jour sont filtrées par organization_id à la couche base de données.",
      },
      {
        heading: "Journal d'audit",
        body:    "Chaque action critique (création de dossier, facture, note, suppression) est enregistrée dans le journal d'audit accessible depuis /portail-avocat/audit. Les 50 dernières actions sont affichées avec la date, le type d'action, la ressource et l'utilisateur. Ce journal est immuable (pas de suppression possible).",
      },
      {
        heading: "RGPD et suppression des données",
        body:    "Exercez votre droit à l'effacement depuis /portail-avocat/settings → Zone de danger → \"Supprimer mon cabinet\". La suppression est un soft-delete : les données sont marquées inactives et conservées 30 jours pour permettre une restauration sur demande. Après 30 jours, les données sont définitivement purgées.",
      },
    ],
  },
];

export default function DocsPage() {
  return (
    <>
      <style>{`
        .docs-nav-link { color: var(--text-secondary); transition: color 150ms; }
        .docs-nav-link:hover { color: var(--foreground); }
        .docs-section-anchor { scroll-margin-top: 80px; }
      `}</style>

      <div style={{ backgroundColor: "var(--background)", minHeight: "100vh" }}>

        {/* ─── Navbar LawyerOS ─── */}
        <header
          className="sticky top-0 z-40 border-b"
          style={{ backgroundColor: "rgba(248,247,244,0.95)", borderColor: "var(--border)", backdropFilter: "blur(8px)" }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex h-14 items-center justify-between">
            <Link href="/lawyeros" className="flex items-center gap-2">
              <span className="text-lg font-heading font-medium" style={{ color: "var(--foreground)" }}>
                Lawyer<span style={{ color: "var(--accent)" }}>OS</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {[
                { href: "/lawyeros#fonctionnalites", label: "Fonctionnalités" },
                { href: "/lawyeros#demo",            label: "Démo" },
                { href: "/lawyeros#tarifs",          label: "Tarifs" },
                { href: "/lawyeros/docs",            label: "Documentation" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="docs-nav-link text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/signup"
              className="rounded-sm px-4 py-2 text-sm font-medium"
              style={{ backgroundColor: "var(--accent)", color: "#ffffff", fontFamily: "var(--font-body)" }}
            >
              Essai gratuit
            </Link>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
          <div className="flex gap-12 lg:gap-16">

            {/* ─── Sidebar navigation ─── */}
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-24 space-y-1">
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                >
                  Sur cette page
                </p>
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block rounded-sm px-3 py-1.5 text-sm transition-colors docs-nav-link"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {s.title}
                  </a>
                ))}
              </div>
            </aside>

            {/* ─── Contenu principal ─── */}
            <main className="flex-1 min-w-0">
              {/* Header page */}
              <div className="mb-12 max-w-2xl">
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}
                >
                  Documentation
                </p>
                <h1
                  className="text-3xl md:text-4xl font-heading font-medium tracking-tight"
                  style={{ color: "var(--foreground)" }}
                >
                  Guide d&apos;utilisation LawyerOS
                </h1>
                <p
                  className="mt-4 text-base leading-relaxed"
                  style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
                >
                  Tout ce qu&apos;il faut savoir pour configurer votre cabinet, gérer vos dossiers et offrir une expérience professionnelle à vos clients.
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-16">
                {SECTIONS.map((section) => (
                  <section key={section.id} id={section.id} className="docs-section-anchor">
                    <div
                      className="flex items-center gap-3 mb-6 pb-3 border-b"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <h2
                        className="text-xl font-heading font-medium tracking-tight"
                        style={{ color: "var(--foreground)" }}
                      >
                        {section.title}
                      </h2>
                    </div>

                    <div className="space-y-8">
                      {section.content.map((item) => (
                        <div key={item.heading}>
                          <h3
                            className="text-base font-medium mb-2"
                            style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}
                          >
                            {item.heading}
                          </h3>
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
                          >
                            {item.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              {/* CTA bas de page */}
              <div
                className="mt-16 rounded-sm border px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <div>
                  <p className="text-base font-medium" style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}>
                    Une question non couverte ?
                  </p>
                  <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                    Notre équipe répond en moins de 24h en semaine.
                  </p>
                </div>
                <Link
                  href="/signup"
                  className="shrink-0 rounded-sm px-5 py-2.5 text-sm font-medium"
                  style={{ backgroundColor: "var(--accent)", color: "#ffffff", fontFamily: "var(--font-body)" }}
                >
                  Commencer gratuitement →
                </Link>
              </div>
            </main>
          </div>
        </div>

        {/* Footer minimal */}
        <footer
          className="border-t mt-16 px-6 md:px-12 lg:px-20 py-8"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm font-heading font-medium" style={{ color: "var(--foreground)" }}>
              Lawyer<span style={{ color: "var(--accent)" }}>OS</span>
            </span>
            <div className="flex gap-5">
              {[
                { href: "/cgv",              label: "CGV" },
                { href: "/mentions-legales", label: "Mentions légales" },
                { href: "/confidentialite",  label: "Confidentialité" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="docs-nav-link text-xs" style={{ fontFamily: "var(--font-body)" }}>
                  {item.label}
                </Link>
              ))}
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              © 2026 LawyerOS by Kayo Agency
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
