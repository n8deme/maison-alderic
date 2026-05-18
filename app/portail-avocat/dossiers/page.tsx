// ============================================================
// app/portail-avocat/dossiers/page.tsx
// ============================================================
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { DossiersFiltersForm } from "@/components/portail-avocat/dossiers/dossiers-filters-form";
import { DataTableClickableRow } from "@/components/portail-avocat/ui/data-table-clickable-row";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableEmptyState,
  DataTableHead,
  DataTableHeadCell,
  DataTableHeadRow,
  DataTableTable,
  dataTableActionLinkClass,
} from "@/components/portail-avocat/ui/data-table";
import { createClient } from "@/lib/supabase/server";
import { getOrganization } from "@/lib/get-organization";

export const metadata: Metadata = { title: "Dossiers" };

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

const STATUS_LABELS: Record<string, string> = {
  active: "Actif", pending: "En attente", archived: "Archivé", won: "Clôturé", lost: "Perdu",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800", pending: "bg-yellow-100 text-yellow-800",
  archived: "bg-gray-100 text-gray-800", won: "bg-blue-100 text-blue-800", lost: "bg-red-100 text-red-800",
};

export default async function AvocatDossiersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string; avocat?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const org = await getOrganization();

  let query = supabase
    .from("dossiers")
    .select(`id, reference, title, type, status, opened_at, client:profiles!client_id(full_name), dossier_avocats(role, avocats(id, full_name))`)
    .eq("organization_id", org.id)
    .order("opened_at", { ascending: false });

  if (params.status && params.status !== "all") query = query.eq("status", params.status);
  if (params.type && params.type !== "all") query = query.eq("type", params.type);
  if (params.q) query = query.or(`title.ilike.%${params.q}%,reference.ilike.%${params.q}%`);

  const [{ data: dossiers }, { data: avocats }] = await Promise.all([
    query,
    supabase.from("avocats").select("id, full_name").eq("organization_id", org.id).order("full_name"),
  ]);

  let filteredDossiers = dossiers ?? [];
  if (params.avocat && params.avocat !== "all") {
    filteredDossiers = filteredDossiers.filter((d: any) =>
      d.dossier_avocats?.some((da: any) => da.avocats?.id === params.avocat)
    );
  }

  return (
    <div className="max-w-7xl p-6 md:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>Dossiers cabinet</h1>
          <p className="mt-1 text-sm text-text-secondary">Tous les dossiers du cabinet.</p>
        </div>
        <Link href="/portail-avocat/dossiers/nouveau" className="inline-flex shrink-0 items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90" style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}>
          <Plus className="h-4 w-4" />
          Nouveau dossier
        </Link>
      </div>

      <DossiersFiltersForm
        initialStatus={params.status ?? "all"}
        initialType={params.type ?? "all"}
        initialAvocat={params.avocat ?? "all"}
        initialQ={params.q ?? ""}
        avocats={avocats ?? []}
      />

      <DataTable>
        <DataTableTable>
          <DataTableHead>
            <DataTableHeadRow>
              <DataTableHeadCell>Numéro</DataTableHeadCell>
              <DataTableHeadCell>Client</DataTableHeadCell>
              <DataTableHeadCell>Titre</DataTableHeadCell>
              <DataTableHeadCell>Type</DataTableHeadCell>
              <DataTableHeadCell>Statut</DataTableHeadCell>
              <DataTableHeadCell>Avocat assigné</DataTableHeadCell>
              <DataTableHeadCell>Création</DataTableHeadCell>
              <DataTableHeadCell>Actions</DataTableHeadCell>
            </DataTableHeadRow>
          </DataTableHead>
          <DataTableBody>
            {filteredDossiers.length === 0 ? (
              <DataTableEmptyState colSpan={8} />
            ) : (
              filteredDossiers.map((d: any) => {
                const lead =
                  d.dossier_avocats?.find((da: any) => da.role === "lead") ?? d.dossier_avocats?.[0];
                const avocatName = lead?.avocats?.full_name ?? "—";
                const href = `/portail-avocat/dossiers/${d.reference}`;
                return (
                  <DataTableClickableRow
                    key={d.id}
                    href={href}
                    ariaLabel={`Ouvrir le dossier ${d.reference}`}
                  >
                    <DataTableCell mono>{d.reference}</DataTableCell>
                    <DataTableCell>{d.client?.full_name ?? "—"}</DataTableCell>
                    <DataTableCell>{d.title}</DataTableCell>
                    <DataTableCell>{d.type ?? "—"}</DataTableCell>
                    <DataTableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${STATUS_COLORS[d.status] ?? "bg-gray-100 text-gray-800"}`}
                      >
                        {STATUS_LABELS[d.status] ?? d.status}
                      </span>
                    </DataTableCell>
                    <DataTableCell>{avocatName}</DataTableCell>
                    <DataTableCell>{d.opened_at ? fmtDate(d.opened_at) : "—"}</DataTableCell>
                    <DataTableCell>
                      <span className={dataTableActionLinkClass()}>Voir</span>
                    </DataTableCell>
                  </DataTableClickableRow>
                );
              })
            )}
          </DataTableBody>
        </DataTableTable>
      </DataTable>
    </div>
  );
}
