import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganization } from "@/lib/get-organization";

export const metadata: Metadata = { title: "Clients" };

export default async function AvocatClientsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const org = await getOrganization();

  // Les clients d'une org sont ceux qui ont au moins un dossier dans cette org.
  // On ne passe pas par organization_members car les clients n'y sont pas enregistrés.
  const { data: orgDossiers } = await supabase
    .from("dossiers")
    .select("client_id")
    .eq("organization_id", org.id);

  const clientIds = [...new Set((orgDossiers ?? []).map((d) => d.client_id))];

  const { data: raw } = clientIds.length > 0
    ? await supabase
        .from("profiles")
        .select(`
          id, full_name, email,
          dossiers:dossiers!client_id (
            id, reference, title, status, opened_at, organization_id
          )
        `)
        .eq("role", "client")
        .in("id", clientIds)
        .order("full_name")
    : { data: [] };

  const clients = (raw ?? []).map((c) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allDossiers = (Array.isArray((c as any).dossiers) ? (c as any).dossiers : []) as {
      id: string; reference: string; title: string; status: string; opened_at: string; organization_id: string;
    }[];
    // Ne comptabiliser que les dossiers de cet org (un client peut exister sur plusieurs orgs)
    const list        = allDossiers.filter((d) => d.organization_id === org.id);
    const sorted      = [...list].sort((a, b) => b.opened_at.localeCompare(a.opened_at));
    const activeCount = list.filter((d) => d.status === "active" || d.status === "pending").length;
    const lastDossier = sorted[0] ?? null;
    return { id: c.id, full_name: c.full_name, email: c.email, activeCount, lastDossier };
  });

  return (
    <div className="max-w-7xl p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>Clients</h1>
        <p className="mt-1 text-sm text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
          Vue globale des clients et de leur activité dossier.
        </p>
      </div>

      {clients.length === 0 && (
        <p className="text-sm text-text-muted py-12 text-center" style={{ fontFamily: "var(--font-body)" }}>
          Aucun client pour l&apos;instant. Créez un dossier pour voir apparaître un client ici.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {clients.map((client) => (
          <article key={client.id} className="rounded-sm border border-border bg-surface p-5">
            <h2 className="text-lg text-foreground" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
              {client.full_name ?? "Client"}
            </h2>
            <p className="mt-1 text-xs text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
              {client.email}
            </p>
            <p className="mt-3 text-xs text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
              Dossiers actifs : {client.activeCount}
            </p>
            <p className="mt-1 text-xs text-text-muted truncate" style={{ fontFamily: "var(--font-body)" }}>
              Dernier dossier :{" "}
              {client.lastDossier
                ? `${client.lastDossier.reference} — ${client.lastDossier.title}`
                : "Aucun"}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Link
                href={`/portail-avocat/clients/${client.id}`}
                className="rounded-sm border border-border px-3 py-1.5 text-xs hover:bg-surface-alt transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Voir profil
              </Link>
              <Link
                href={`/portail-avocat/dossiers?client=${client.id}`}
                className="rounded-sm bg-foreground px-3 py-1.5 text-xs text-background hover:opacity-90 transition-opacity"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Nouveau dossier
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}