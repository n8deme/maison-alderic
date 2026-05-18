import { Building2, CreditCard } from "lucide-react";
import { getOrganization } from "@/lib/get-organization";
import DangerZone from "./danger-zone";
import { TwoFactorSetup } from "./two-factor-setup";
import { BillingButton } from "./billing-button";

export default async function SettingsPage() {
  const org = await getOrganization();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 md:px-12 lg:px-16">
      <div className="mb-8">
        <h1
          className="font-heading text-3xl font-medium tracking-tight text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Paramètres
        </h1>
        <p className="mt-1 text-sm text-[#5C5A55]" style={{ fontFamily: "var(--font-body)" }}>
          Gestion et configuration de votre cabinet
        </p>
      </div>

      <div className="space-y-6">
        <section className="rounded-md border border-[#EFEDE6] bg-white p-6">
          <h2
            className="flex items-center gap-2 text-base font-medium text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Building2 className="size-[18px] shrink-0 text-[#1A1A1A]" aria-hidden />
            Informations du cabinet
          </h2>
          <dl className="mt-4 space-y-3">
            <div className="flex gap-4">
              <dt className="w-32 shrink-0 text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                Nom
              </dt>
              <dd className="text-sm font-medium text-[#1A1A1A]" style={{ fontFamily: "var(--font-body)" }}>
                {org.name}
              </dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-32 shrink-0 text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                Identifiant
              </dt>
              <dd className="font-mono text-sm text-[#5C5A55]">{org.slug}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-32 shrink-0 text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                Plan
              </dt>
              <dd className="text-sm capitalize text-[#5C5A55]" style={{ fontFamily: "var(--font-body)" }}>
                {org.plan}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-md border border-[#EFEDE6] bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                className="flex items-center gap-2 text-base font-medium text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <CreditCard className="size-[18px] shrink-0 text-[#1A1A1A]" aria-hidden />
                Abonnement
              </h2>
              <p className="mt-1 text-sm text-[#5C5A55]" style={{ fontFamily: "var(--font-body)" }}>
                Gérez votre plan, vos factures et vos informations de paiement.
              </p>
              <p className="mt-1 text-sm font-medium capitalize text-[#5C5A55]" style={{ fontFamily: "var(--font-body)" }}>
                Plan actuel : {org.plan}
              </p>
            </div>
            <div className="shrink-0 pt-1">
              <BillingButton orgId={org.id} />
            </div>
          </div>
        </section>

        <TwoFactorSetup />

        <DangerZone orgId={org.id} orgName={org.name} />
      </div>
    </div>
  );
}
