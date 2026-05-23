import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Accès suspendu | LawyerOS" },
};

export default function SuspendedPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--background)" }}>
      <header
        className="border-b px-6 py-4"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <span
          className="text-lg font-heading font-medium tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          Lawyer<span style={{ color: "var(--accent)" }}>OS</span>
        </span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--surface-alt)" }}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ stroke: "var(--text-muted)" }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <div className="space-y-3">
          <h1
            className="text-2xl font-heading font-medium tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Accès suspendu
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            L&apos;accès à ce portail a été suspendu. Si vous pensez qu&apos;il s&apos;agit
            d&apos;une erreur, contactez l&apos;administrateur de votre cabinet ou notre équipe.
          </p>
        </div>

        <div
          className="border-t pt-6 space-y-3"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Vous êtes l&apos;administrateur du cabinet ?{" "}
            <Link
              href="mailto:support@lawyeros.app"
              className="underline underline-offset-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Contactez le support
            </Link>
          </p>
          <Link
            href="/"
            className="block text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Retour à l&apos;accueil →
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
