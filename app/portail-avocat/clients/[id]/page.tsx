import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Mail, Building2, Calendar, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { dossierStatusLabel } from "@/lib/dossier-status";
import { NewDossierButton } from "@/components/portail-avocat/clients/new-dossier-button";

export const metadata: Metadata = { title: "Profil client" };

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (profile?.role !== "avocat") redirect("/portail");

  // Fetch client avec ses dossiers et dernière activité
  const { data: client } = await supabase
    .from("profiles")
    .select(
      `
      *,
      dossiers:dossiers(
        id,
        reference,
        title,
        type,
        status,
        opened_at,
        closed_at,
        avocat:avocats(full_name, slug)
      )
    `
    )
    .eq("id", id)
    .eq("role", "client")
    .single();

  if (!client) redirect("/portail-avocat/clients");

  const dossiersActifs = client.dossiers?.filter((d: any) => d.status === "active") || [];

  return (
    <div className="max-w-5xl p-6 md:p-8">
      {/* Header avec retour */}
      <div className="mb-6">
        <Link
          href="/portail-avocat/clients"
          className="mb-4 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-bordeaux"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux clients
        </Link>
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
          {client.full_name}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">Profil client et dossiers associés</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Colonne gauche - Infos client */}
        <div className="space-y-6 md:col-span-1">
          {/* Carte coordonnées */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="mb-4 text-lg font-medium" style={{ fontFamily: "var(--font-display)" }}>
              Coordonnées
            </h2>
            <dl className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-text-secondary" />
                <div>
                  <dt className="text-xs text-text-secondary">Email</dt>
                  <dd className="text-sm">
                    <a href={`mailto:${client.email}`} className="text-bordeaux hover:underline">
                      {client.email}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 h-4 w-4 text-text-secondary" />
                <div>
                  <dt className="text-xs text-text-secondary">Société</dt>
                  <dd className="text-sm">{client.company || "-"}</dd>
                </div>
              </div>
            </dl>
          </div>

          {/* Carte statistiques */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="mb-4 text-lg font-medium" style={{ fontFamily: "var(--font-display)" }}>
              Statistiques
            </h2>
            <dl className="space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-text-secondary">Dossiers actifs</dt>
                <dd className="text-2xl font-semibold text-bordeaux">{dossiersActifs.length}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-text-secondary">Total dossiers</dt>
                <dd className="text-lg">{client.dossiers?.length || 0}</dd>
              </div>
            </dl>
          </div>

          {/* Actions rapides */}
          <div className="space-y-2">
            <NewDossierButton clientId={client.id} />
            <Link
              href={`/portail-avocat/agenda?client=${client.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm transition hover:bg-surface-alt"
            >
              <Calendar className="h-4 w-4" />
              Planifier RDV
            </Link>
          </div>
        </div>

        {/* Colonne droite - Dossiers */}
        <div className="md:col-span-2">
          <div className="rounded-lg border border-border bg-surface">
            <div className="border-b border-border p-6">
              <h2 className="text-lg font-medium" style={{ fontFamily: "var(--font-display)" }}>
                Dossiers ({client.dossiers?.length || 0})
              </h2>
            </div>

            {client.dossiers && client.dossiers.length > 0 ? (
              <div className="divide-y divide-border">
                {client.dossiers.map((dossier: any) => (
                  <Link
                    key={dossier.id}
                    href={`/portail-avocat/dossiers/${dossier.reference}`}
                    className="block p-6 transition hover:bg-surface-alt"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="text-xs text-text-secondary">{dossier.reference}</p>
                        <h3 className="mt-1 font-medium">{dossier.title}</h3>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs ${
                          dossier.status === "active"
                            ? "bg-green-50 text-green-700"
                            : dossier.status === "won"
                              ? "bg-blue-50 text-blue-700"
                              : dossier.status === "archived"
                                ? "bg-zinc-100 text-zinc-700"
                                : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {dossierStatusLabel[dossier.status] ?? dossier.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-text-secondary">
                      <span>{dossier.type || "-"}</span>
                      <span>•</span>
                      <span>{dossier.avocat?.full_name || "Non assigné"}</span>
                      <span>•</span>
                      <span>{dossier.opened_at ? fmtDate(dossier.opened_at) : "-"}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <FileText className="mx-auto mb-3 h-12 w-12 text-text-muted" />
                <p className="text-sm text-text-secondary">Aucun dossier pour ce client</p>
                <Link
                  href={`/portail-avocat/dossiers?client=${client.id}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm text-bordeaux hover:underline"
                >
                  Créer le premier dossier
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}