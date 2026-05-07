import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Clients" };

export default async function AvocatClientsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: clients } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("role", "client")
    .order("full_name");

  const clientIds = (clients ?? []).map((c) => c.id);
  const { data: dossiers } = clientIds.length
    ? await supabase
        .from("dossiers")
        .select("id, client_id, reference, title, status, opened_at")
        .in("client_id", clientIds)
        .order("opened_at", { ascending: false })
    : { data: [] as any[] };

  return (
    <div className="max-w-7xl p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>Clients</h1>
        <p className="mt-1 text-sm text-text-secondary">Vue globale des clients et de leur activite dossier.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(clients ?? []).map((client) => {
          const list = (dossiers ?? []).filter((d) => d.client_id === client.id);
          const activeCount = list.filter((d) => d.status === "active" || d.status === "pending").length;
          const lastDossier = list[0];
          return (
            <article key={client.id} className="rounded-sm border border-border bg-surface p-5">
              <h2 className="text-lg text-foreground">{client.full_name ?? "Client"}</h2>
              <p className="mt-1 text-xs text-text-secondary">{client.email}</p>
              <p className="mt-3 text-xs text-text-muted">Dossiers actifs: {activeCount}</p>
              <p className="mt-1 text-xs text-text-muted">
                Dernier dossier: {lastDossier ? `${lastDossier.reference} - ${lastDossier.title}` : "Aucun"}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Link href={`/portail-avocat/clients/${client.id}`} className="rounded-sm border border-border px-3 py-1.5 text-xs">
                  Voir profil
                </Link>
                <Link href={`/portail-avocat/dossiers?client=${client.id}`} className="rounded-sm bg-foreground px-3 py-1.5 text-xs text-background">
                  Nouveau dossier
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}