import { getOrganization } from "@/lib/get-organization";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableEmptyState,
  DataTableHead,
  DataTableHeadCell,
  DataTableHeadRow,
  DataTableRow,
  DataTableTable,
} from "@/components/portail-avocat/ui/data-table";

const ACTION_LABELS: Record<string, string> = {
  dossier_created:       "Dossier créé",
  dossier_updated:       "Dossier modifié",
  note_created:          "Note créée",
  time_entry_created:    "Temps enregistré",
  invoice_created:       "Facture créée",
  mandat_generated:      "Mandat généré",
  intake_form_created:   "Formulaire intake créé",
  organization_deleted:  "Cabinet supprimé",
};

const RESOURCE_LABELS: Record<string, string> = {
  dossier:      "Dossier",
  note:         "Note",
  time_entry:   "Temps",
  invoice:      "Facture",
  intake_form:  "Formulaire",
  organization: "Cabinet",
};

export default async function AuditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const org = await getOrganization();

  const { data: logs } = await supabase
    .from("audit_logs")
    .select("id, action, resource_type, resource_id, created_at, user_id")
    .eq("organization_id", org.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const userIds = [...new Set((logs ?? []).map((l) => l.user_id).filter(Boolean))];
  const { data: profiles } = userIds.length > 0
    ? await supabase.from("profiles").select("id, full_name, email").in("id", userIds)
    : { data: [] };

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  return (
    <div className="px-6 py-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-2xl font-heading font-medium tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          Journal d&apos;audit
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          50 dernières actions enregistrées pour votre cabinet
        </p>
      </div>

      <DataTable>
        <DataTableTable>
          <DataTableHead>
            <DataTableHeadRow>
              <DataTableHeadCell>Date</DataTableHeadCell>
              <DataTableHeadCell>Action</DataTableHeadCell>
              <DataTableHeadCell>Ressource</DataTableHeadCell>
              <DataTableHeadCell>Utilisateur</DataTableHeadCell>
            </DataTableHeadRow>
          </DataTableHead>
          <DataTableBody>
            {!logs || logs.length === 0 ? (
              <DataTableEmptyState colSpan={4} />
            ) : (
              logs.map((log) => {
                const profile = profileMap.get(log.user_id);
                const label = ACTION_LABELS[log.action] ?? log.action;
                const resource = RESOURCE_LABELS[log.resource_type] ?? log.resource_type;
                const userName = profile?.full_name ?? profile?.email ?? "—";
                const date = log.created_at
                  ? new Intl.DateTimeFormat("fr-BE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(log.created_at))
                  : "—";

                return (
                  <DataTableRow key={log.id}>
                    <DataTableCell className="tabular-nums">{date}</DataTableCell>
                    <DataTableCell>{label}</DataTableCell>
                    <DataTableCell>{resource}</DataTableCell>
                    <DataTableCell>{userName}</DataTableCell>
                  </DataTableRow>
                );
              })
            )}
          </DataTableBody>
        </DataTableTable>
      </DataTable>
    </div>
  );
}
