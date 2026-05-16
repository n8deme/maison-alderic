import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";

function portalUrl(subdomain: string): { href: string; display: string } {
  const isProd =
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_APP_DOMAIN;

  if (isProd) {
    const domain = process.env.NEXT_PUBLIC_APP_DOMAIN!;
    return {
      href:    `https://${subdomain}.${domain}`,
      display: `${subdomain}.${domain}`,
    };
  }

  return {
    href:    `http://localhost:3000/portail?__tenant=${subdomain}`,
    display: `localhost:3000/portail?__tenant=${subdomain}`,
  };
}

async function SuccessContent({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const subdomain = searchParams.subdomain || searchParams.__tenant || "";
  const { href, display } = portalUrl(subdomain);

  // Récupérer le nom du cabinet depuis les headers (injectés par le middleware)
  const hdrs = await headers();
  const orgName = hdrs.get("x-org-name") || "votre cabinet";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Icône succès */}
      <div
        className="mb-8 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: "#f0fdf4" }}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8"
          fill="none"
          stroke="#16a34a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <div className="w-full max-w-lg text-center space-y-4 mb-10">
        <h1
          className="text-3xl font-heading font-medium tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          Votre portail est actif
        </h1>
        <p
          className="text-base font-heading italic font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          {orgName} est prêt à accueillir ses premiers clients.
        </p>
      </div>

      {/* Carte portail */}
      <div
        className="w-full max-w-lg rounded-sm border px-8 py-8 space-y-6"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
        }}
      >
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            Votre portail client
          </p>
          <div
            className="flex items-center gap-3 rounded-sm border px-4 py-3"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-alt)" }}
          >
            <span className="text-sm font-mono flex-1 truncate" style={{ color: "var(--foreground)" }}>
              {display}
            </span>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium shrink-0"
              style={{ color: "var(--accent)" }}
            >
              Ouvrir →
            </a>
          </div>
        </div>

        <div
          className="border-t pt-6 space-y-3"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            Prochaines étapes
          </p>
          <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <li className="flex items-start gap-2">
              <span style={{ color: "var(--accent)" }}>·</span>
              Un email de bienvenue vous a été envoyé avec le récapitulatif de votre portail
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: "var(--accent)" }}>·</span>
              Créez votre premier dossier client depuis le portail avocat
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: "var(--accent)" }}>·</span>
              Partagez le lien du portail à vos clients pour qu&apos;ils créent leur espace
            </li>
          </ul>
        </div>

        <a
          href={href}
          className="block w-full py-3 px-4 rounded-sm text-sm font-medium text-center transition-colors"
          style={{
            backgroundColor: "var(--accent)",
            color: "#ffffff",
          }}
        >
          Accéder à mon portail
        </a>
      </div>

      {/* Période d'essai */}
      <div className="mt-8 text-center space-y-1">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Vous êtes en période d&apos;essai de 14 jours — aucun paiement requis pour l&apos;instant.
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Des questions ?{" "}
          <Link href="/contact" className="underline hover:no-underline">
            Contactez notre équipe
          </Link>
        </p>
      </div>
    </div>
  );
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  return (
    <Suspense fallback={null}>
      <SuccessContent searchParams={params} />
    </Suspense>
  );
}
