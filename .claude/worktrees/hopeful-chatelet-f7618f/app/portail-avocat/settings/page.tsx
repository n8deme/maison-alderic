import { getOrganization } from "@/lib/get-organization";
import DangerZone from "./danger-zone";
import { TwoFactorSetup } from "./two-factor-setup";
import { BillingButton } from "./billing-button";

export default async function SettingsPage() {
  const org = await getOrganization();

  return (
    <div className="px-6 py-8 md:px-12 lg:px-16 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-2xl font-heading font-medium tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          Paramètres
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Gestion et configuration de votre cabinet
        </p>
      </div>

      <div className="space-y-6">
        <section
          className="rounded-sm border px-6 py-5"
          style={{ borderColor: "var(--border)" }}
        >
          <h2
            className="text-base font-medium"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}
          >
            Informations du cabinet
          </h2>
          <dl className="mt-4 space-y-3">
            <div className="flex gap-4">
              <dt className="w-32 shrink-0 text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                Nom
              </dt>
              <dd className="text-sm font-medium" style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}>
                {org.name}
              </dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-32 shrink-0 text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                Identifiant
              </dt>
              <dd className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
                {org.slug}
              </dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-32 shrink-0 text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                Plan
              </dt>
              <dd className="text-sm capitalize" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                {org.plan}
              </dd>
            </div>
          </dl>
        </section>

        <section
          className="rounded-sm border px-6 py-5"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                className="text-base font-medium"
                style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}
              >
                Abonnement
              </h2>
              <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                Gérez votre plan, vos factures et vos informations de paiement.
              </p>
              <p className="mt-1 text-sm font-medium capitalize" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                Plan actuel : {org.plan}
              </p>
            </div>
            <div className="shrink-0 pt-1">
              <BillingButton orgId={org.id} />
            </div>
          </div>
        </section>

        <section>
          <h2
            className="text-base font-medium mb-4"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}
          >
            Sécurité
          </h2>
          <TwoFactorSetup />
        </section>

        <DangerZone orgId={org.id} orgName={org.name} />
      </div>
    </div>
  );
}
