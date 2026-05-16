// ============================================================
// Exemple : app/portail/layout.tsx
// Comment intégrer getOrganization + OrganizationProvider
// dans le layout du portail
// ============================================================

import { getOrganization } from '@/lib/get-organization'
import { OrganizationProvider } from '@/lib/organization-context'
import { redirect } from 'next/navigation'

export default async function PortailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Récupérer l'org depuis les headers (injectés par le middleware)
  let org
  try {
    org = await getOrganization()
  } catch {
    // Pas d'org → pas sur un sous-domaine valide
    redirect('/')
  }

  return (
    <OrganizationProvider org={org}>
      {/*
        Ici tu mets le layout du portail :
        sidebar, topbar, etc.
        Tous les composants enfants ont accès à useOrganization()
      */}
      <div
        style={{
          // Appliquer les couleurs de branding de l'org
          // comme CSS variables → tout le portail les utilise
          '--color-primary': org.primaryColor,
          '--color-accent':  org.accentColor,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </OrganizationProvider>
  )
}

// ============================================================
// Exemple d'utilisation dans un composant client
// ============================================================

// 'use client'
// import { useOrganization } from '@/lib/organization-context'
//
// export function DashboardHeader() {
//   const { org } = useOrganization()
//
//   return (
//     <header>
//       {org.logoUrl && <img src={org.logoUrl} alt={org.name} />}
//       <h1>{org.name}</h1>
//       <span>Plan : {org.plan}</span>
//       {org.features.aiSummary && <AISummaryButton />}
//     </header>
//   )
// }

// ============================================================
// Exemple : vérifier le plan dans une page
// ============================================================

// import { getOrganization, isPlanAtLeast } from '@/lib/get-organization'
//
// export default async function IntakeFormsPage() {
//   const org = await getOrganization()
//
//   if (!isPlanAtLeast(org.plan, 'cabinet')) {
//     return <UpgradePrompt requiredPlan="cabinet" />
//   }
//
//   return <IntakeFormsUI />
// }
