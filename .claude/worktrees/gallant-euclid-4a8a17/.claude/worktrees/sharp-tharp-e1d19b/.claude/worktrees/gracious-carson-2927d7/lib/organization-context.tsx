'use client'

// ============================================================
// OrganizationContext
// Expose les infos de l'organisation courante à tous les
// composants client. Hydraté depuis les headers du middleware.
// ============================================================
// Usage :
//   const { org } = useOrganization()
//   org.name, org.plan, org.features.aiSummary, etc.
// ============================================================

import { createContext, useContext } from 'react'

export type OrgPlan = 'trial' | 'solo' | 'cabinet' | 'premium'

export type OrgFeatures = {
  esignature:   boolean
  customDomain: boolean
  aiSummary:    boolean
  intakeForms:  boolean
}

export type Organization = {
  id:           string
  slug:         string
  name:         string
  plan:         OrgPlan
  primaryColor: string
  accentColor:  string
  logoUrl:      string | null
  features:     OrgFeatures
}

type OrganizationContextValue = {
  org: Organization
}

export const OrganizationContext = createContext<OrganizationContextValue | null>(null)

export function useOrganization(): OrganizationContextValue {
  const ctx = useContext(OrganizationContext)
  if (!ctx) {
    throw new Error('useOrganization doit être utilisé dans un OrganizationProvider')
  }
  return ctx
}

// ============================================================
// OrganizationProvider
// À placer dans app/layout.tsx (ou le layout du portail)
// Reçoit les données org depuis le Server Component parent
// ============================================================
export function OrganizationProvider({
  org,
  children,
}: {
  org: Organization
  children: React.ReactNode
}) {
  return (
    <OrganizationContext.Provider value={{ org }}>
      {children}
    </OrganizationContext.Provider>
  )
}
