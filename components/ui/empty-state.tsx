import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export type EmptyStateProps = {
  /** Icône Lucide affichée en haut, sobrement */
  icon: LucideIcon;
  /** Titre court, 3-5 mots */
  title: string;
  /** Phrase contextualisante, 1 ligne max */
  description?: string;
  /** Action optionnelle (CTA en bas) */
  action?: {
    label: string;
    href: string;
  };
  /** Padding ajusté selon le contexte (compact pour dashboard widgets, default pour pages pleines) */
  size?: "compact" | "default";
};

/**
 * EmptyState — affichage soigné quand une liste est vide.
 *
 * Direction sobre : icône légère, titre Fraunces, description Inter,
 * action en bordeaux subtile. Pas d'illustration cliché, pas d'emoji.
 */
export function EmptyState({ icon: Icon, title, description, action, size = "default" }: EmptyStateProps) {
  const paddingClass = size === "compact" ? "py-8 px-4" : "py-16 px-6";

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${paddingClass}`}
      role="status"
    >
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: "var(--surface-alt)" }}
      >
        <Icon
          className="h-5 w-5"
          strokeWidth={1.5}
          color="var(--text-muted)"
          aria-hidden="true"
        />
      </div>

      <h3
        className="text-base text-foreground"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>

      {description && (
        <p
          className="mt-1.5 max-w-xs text-sm"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}

      {action && (
        <Link
          href={action.href}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--bordeaux)",
          }}
        >
          {action.label}
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}