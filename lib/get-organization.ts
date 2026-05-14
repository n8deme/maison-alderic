import { headers } from 'next/headers'
import type { Organization, OrgPlan } from './organization-context'

// ============================================================
// getOrganization()
// À appeler dans les Server Components et les layouts
// Lit les headers injectés par le middleware
// ============================================================
// Usage dans un Server Component :
//   const org = await getOrganization()
//   <OrganizationProvider org={org}>...</OrganizationProvider>
// ============================================================

export async function getOrganization(): Promise<Organization> {
  const headersList = await headers()

  const id           = headersList.get('x-org-id')
  const slug         = headersList.get('x-org-slug')
  const name         = headersList.get('x-org-name')
  const plan         = headersList.get('x-org-plan') as OrgPlan
  const primaryColor = headersList.get('x-org-color')
  const accentColor  = headersList.get('x-org-accent')
  const logoUrl      = headersList.get('x-org-logo')

  // Si pas d'org dans les headers → on est sur le root domain (site marketing)
  // Retourner une org vide / null selon le contexte
  if (!id || !slug) {
    throw new Error('Aucune organisation trouvée dans les headers. Vérifier le middleware.')
  }

  return {
    id,
    slug,
    name:         name || '',
    plan:         plan || 'trial',
    primaryColor: primaryColor || '#1A1A1A',
    accentColor:  accentColor  || '#7A1F2B',
    logoUrl:      logoUrl || null,
    features: {
      esignature:   headersList.get('x-org-feature-esignature')   === 'true',
      customDomain: headersList.get('x-org-feature-custom-domain') === 'true',
      aiSummary:    headersList.get('x-org-feature-ai-summary')   === 'true',
      intakeForms:  headersList.get('x-org-feature-intake-forms') === 'true',
    },
  }
}

// ============================================================
// getUserRole()
// Lit le rôle du user courant depuis les headers
// (injecté par le middleware sur les routes /portail et /admin)
// ============================================================
export async function getUserRole(): Promise<string | null> {
  const headersList = await headers()
  return headersList.get('x-user-role')
}

// ============================================================
// Helpers de vérification plan
// ============================================================
export function isPlanAtLeast(currentPlan: OrgPlan, requiredPlan: OrgPlan): boolean {
  const order: OrgPlan[] = ['trial', 'solo', 'cabinet', 'premium']
  return order.indexOf(currentPlan) >= order.indexOf(requiredPlan)
}

export function canAccessFeature(
  org: Organization,
  feature: keyof Organization['features']
): boolean {
  return org.features[feature]
}
