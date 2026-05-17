import type { LucideIcon } from "lucide-react";
import {
  Folders,
  Layout,
  MessagesSquare,
  Receipt,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const FEATURES: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Portail client white-label",
    description:
      "Votre cabinet, votre marque. Chaque client accède à un portail personnalisé sous votre identité visuelle.",
    icon: Layout,
  },
  {
    title: "Dossiers & timeline",
    description:
      "Suivez chaque affaire en temps réel. Timeline des événements, pièces jointes, statuts et équipe assignée.",
    icon: Folders,
  },
  {
    title: "Messagerie sécurisée",
    description:
      "Échanges chiffrés entre avocat et client directement dans le portail. Fini les emails sensibles perdus.",
    icon: MessagesSquare,
  },
  {
    title: "Facturation Stripe",
    description:
      "Émettez des factures professionnelles et encaissez en ligne. Stripe intégré, TVA belge et française incluse.",
    icon: Receipt,
  },
  {
    title: "Prise de notes IA",
    description:
      "Résumez une audience, dictez une note, générez un mémo. L'IA travaille pour vous, pas le contraire.",
    icon: Sparkles,
  },
  {
    title: "Conflits d'intérêts",
    description:
      "Vérifiez chaque nouveau client en quelques secondes. Moteur de détection automatique sur toute votre base.",
    icon: ShieldCheck,
  },
];

const cardStyles = `
  .lawyeros-feature-card {
    background-color: var(--surface);
    border: 1px solid var(--border-subtle);
    box-shadow: none;
    padding: 2rem;
    transition: border-color 250ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 250ms cubic-bezier(0.22, 1, 0.36, 1),
      box-shadow 250ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  @media (min-width: 768px) {
    .lawyeros-feature-card { padding: 2.5rem; }
  }
  .lawyeros-feature-card-icon {
    display: block;
    margin-bottom: 1.5rem;
    color: var(--foreground);
    transition: transform 250ms cubic-bezier(0.22, 1, 0.36, 1),
      color 250ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .lawyeros-feature-card-title {
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    color: var(--foreground);
    font-family: var(--font-body);
    transition: color 250ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  @media (hover: hover) and (pointer: fine) {
    .lawyeros-feature-card:hover {
      border-color: var(--border);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
    }
    .lawyeros-feature-card:hover .lawyeros-feature-card-icon {
      transform: scale(1.05);
      color: var(--accent);
    }
    .lawyeros-feature-card:hover .lawyeros-feature-card-title {
      color: var(--accent);
    }
  }
`;

export function FeaturesSection() {
  return (
    <>
      <style>{cardStyles}</style>
      <section id="fonctionnalites" className="px-6 py-32 md:px-12 md:py-40 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16">
            <p
              className="mb-4 text-xs font-medium uppercase tracking-widest"
              style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}
            >
              Fonctionnalités
            </p>
            <h2
              className="max-w-xl text-3xl font-heading font-medium tracking-tight md:text-4xl"
              style={{ color: "var(--foreground)" }}
            >
              Tout ce dont un cabinet moderne a besoin.
            </h2>
            <p
              className="mt-4 max-w-xl text-lg"
              style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
            >
              Conçu par des juristes, pour des juristes. Chaque fonctionnalité répond à un vrai besoin terrain.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="lawyeros-feature-card rounded-md">
                  <Icon
                    className="lawyeros-feature-card-icon"
                    size={24}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <h3 className="lawyeros-feature-card-title">{feature.title}</h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
                  >
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
