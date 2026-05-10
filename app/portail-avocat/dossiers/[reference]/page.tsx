import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, Building2, Calendar, CheckCircle2, Circle, Clock, FileText, Mail, Phone, User, AlertCircle } from 'lucide-react'
import { EditDossierButton } from '@/components/portail-avocat/dossiers/edit-dossier-button'
import { getDossierProgress } from '@/lib/dossiers'
import { generateTimelinePDF } from './pdf-actions'
import { DownloadPdfButton } from '@/components/pdf/download-pdf-button'

type PageProps = {
  params: Promise<{ reference: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { reference } = await params
  return { title: reference }
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Actif',
  won: 'Gagné',
  lost: 'Perdu',
  pending: 'En attente',
  archived: 'Archivé',
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800 border-green-200',
  won: 'bg-blue-100 text-blue-800 border-blue-200',
  lost: 'bg-red-100 text-red-800 border-red-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  archived: 'bg-gray-100 text-gray-800 border-gray-200',
}

const TIMELINE_STATUS_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  completed: { label: 'Terminé', icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
  in_progress: { label: 'En cours', icon: Clock, color: 'text-amber-700 bg-amber-50' },
  pending: { label: 'À venir', icon: Circle, color: 'text-slate-400 bg-slate-50' },
  blocked: { label: 'Bloqué', icon: AlertCircle, color: 'text-red-600 bg-red-50' },
}

function fmtDate(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function DossierDetailAvocatPage({ params }: PageProps) {
  const { reference } = await params
  const supabase = await createClient()

  const { data: dossier, error: dossierError } = await supabase
    .from('dossiers')
    .select(`
      *,
      client:profiles!client_id(id, full_name, email, company, phone),
      dossier_avocats(role, avocats(id, full_name, title))
    `)
    .eq('reference', reference)
    .single()

  if (dossierError || !dossier) {
    notFound()
  }

  const { data: timeline } = await supabase
    .from('dossier_timeline')
    .select('*, author:avocats!created_by(full_name)')
    .eq('dossier_id', dossier.id)
    .order('display_order', { ascending: true })

  const leadAvocat = dossier.dossier_avocats?.find((da: any) => da.role === 'lead')?.avocats
  const otherAvocats = (dossier.dossier_avocats ?? []).filter((da: any) => da.role !== 'lead')

  const { data: allAvocats } = await supabase
    .from('avocats')
    .select('id, full_name, title')
    .order('display_order')

  const completedCount = (timeline ?? []).filter((e: any) => e.status === 'completed').length
  const totalCount = timeline?.length ?? 0
  const progressPct = getDossierProgress(dossier, timeline ?? []) ?? 0

  return (
    <div className="space-y-6 p-6 md:p-8">
      {/* Header */}
      <div>
        <Link
          href="/portail-avocat/dossiers"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux dossiers
        </Link>
        <div className="flex flex-wrap items-center gap-3 mb-1">
          <h1 className="text-3xl font-serif text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
            {dossier.reference}
          </h1>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
              STATUS_COLORS[dossier.status] ?? STATUS_COLORS.pending
            }`}
          >
            {STATUS_LABELS[dossier.status] ?? dossier.status}
          </span>
          <EditDossierButton
            dossierId={dossier.id}
            reference={dossier.reference}
            defaultValues={{
              title: dossier.title,
              description: dossier.description ?? undefined,
              status: dossier.status,
              type: dossier.type,
              lead_avocat_id: leadAvocat?.id ?? '',
              team_avocat_ids: (dossier.dossier_avocats ?? [])
                .filter((da: any) => da.role !== 'lead')
                .map((da: any) => da.avocats?.id)
                .filter(Boolean),
              budget_estimated: dossier.budget_estimated ?? null,
            }}
            avocats={allAvocats ?? []}
          />
          <DownloadPdfButton
            action={generateTimelinePDF.bind(null, dossier.id)}
            fileName={`timeline-${dossier.reference}.pdf`}
            label="Récapitulatif PDF"
            variant="outline"
          />
        </div>
        <p className="text-lg text-slate-600">{dossier.title}</p>
        {dossier.description && (
          <p className="mt-2 text-sm text-slate-500 max-w-3xl">{dossier.description}</p>
        )}
      </div>

      {/* Grille 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche : Infos */}
        <div className="space-y-6">
          {/* Carte client */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>Client</h2>
              {dossier.client?.id && (
                <Link
                  href={`/portail-avocat/clients/${dossier.client.id}`}
                  className="text-sm text-amber-700 hover:text-amber-800"
                >
                  Voir profil →
                </Link>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
                <p className="font-medium text-slate-900">{dossier.client?.full_name ?? 'Client inconnu'}</p>
              </div>

              {dossier.client?.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
                  <a href={`mailto:${dossier.client.email}`} className="text-sm text-slate-600 hover:text-slate-900 break-all">
                    {dossier.client.email}
                  </a>
                </div>
              )}

              {dossier.client?.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-600">{dossier.client.phone}</p>
                </div>
              )}

              {dossier.client?.company && (
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-600">{dossier.client.company}</p>
                </div>
              )}
            </div>
          </div>

          {/* Carte informations dossier */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-serif text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>Informations</h2>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-500 mb-1">Type</p>
                <p className="text-slate-900 font-medium">{dossier.type ?? '—'}</p>
              </div>

              <div>
                <p className="text-slate-500 mb-1">Date d&apos;ouverture</p>
                <p className="text-slate-900">{fmtDate(dossier.opened_at) ?? fmtDate(dossier.created_at)}</p>
              </div>

              {dossier.closed_at && (
                <div>
                  <p className="text-slate-500 mb-1">Date de clôture</p>
                  <p className="text-slate-900">{fmtDate(dossier.closed_at)}</p>
                </div>
              )}

              <div>
                <p className="text-slate-500 mb-1">Avocat principal</p>
                <p className="text-slate-900">
                  {leadAvocat ? `${leadAvocat.full_name}` : 'Non assigné'}
                  {leadAvocat?.title && <span className="text-slate-500"> · {leadAvocat.title}</span>}
                </p>
              </div>

              {otherAvocats.length > 0 && (
                <div>
                  <p className="text-slate-500 mb-1">Équipe</p>
                  <ul className="space-y-1">
                    {otherAvocats.map((da: any) => (
                      <li key={da.avocats?.id} className="text-slate-900">
                        {da.avocats?.full_name}
                        {da.avocats?.title && <span className="text-slate-500"> · {da.avocats.title}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(dossier.budget_estimated || dossier.budget_consumed != null) && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-slate-500 mb-1">Budget</p>
                  <p className="text-slate-900">
                    <span className="font-medium">{Number(dossier.budget_consumed ?? 0).toLocaleString('fr-FR')} €</span>
                    {dossier.budget_estimated && (
                      <span className="text-slate-500"> / {Number(dossier.budget_estimated).toLocaleString('fr-FR')} € estimé</span>
                    )}
                  </p>
                </div>
              )}

              {totalCount > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-slate-500">Avancement</p>
                    <p className="text-slate-900 font-medium">{progressPct}%</p>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-amber-700 h-1.5 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{completedCount} / {totalCount} étapes terminées</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colonne droite : Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-serif text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>Timeline du dossier</h2>
              {totalCount > 0 && (
                <span className="text-xs text-slate-500">{totalCount} étape{totalCount > 1 ? 's' : ''}</span>
              )}
            </div>

            {!timeline || timeline.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Aucune étape n&apos;a encore été ajoutée à ce dossier.</p>
              </div>
            ) : (
              <ol className="space-y-5">
                {timeline.map((event: any, idx: number) => {
                  const cfg = TIMELINE_STATUS_CONFIG[event.status] ?? TIMELINE_STATUS_CONFIG.pending
                  const Icon = cfg.icon
                  const isLast = idx === timeline.length - 1
                  return (
                    <li key={event.id} className="flex gap-4 relative">
                      {/* Indicator */}
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cfg.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        {!isLast && <div className="w-px flex-1 bg-slate-200 mt-2" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
                          <h3 className="font-medium text-slate-900">{event.title}</h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          {event.completed_at && (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Terminé le {fmtDate(event.completed_at)}
                            </div>
                          )}
                          {!event.completed_at && event.due_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              Échéance {fmtDate(event.due_date)}
                            </div>
                          )}
                          {event.author?.full_name && (
                            <div className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              {event.author.full_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}