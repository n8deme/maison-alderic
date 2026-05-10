import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dossiers" };

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

const STATUS_LABELS: Record<string, string> = {
  active: "Actif",
  pending: "En attente",
  archived: "Archivé",
  won: "Clôturé",
  lost: "Perdu",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  archived: "bg-gray-100 text-gray-800",
  won: "bg-blue-100 text-blue-800",
  lost: "bg-red-100 text-red-800",
};

export default async function AvocatDossiersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string; avocat?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  let query = supabase
    .from("dossiers")
    .select(`
      id, reference, title, type, status, opened_at,
      client:profiles!client_id(full_name),
      dossier_avocats(role, avocats(id, full_name))
    `)
    .order("opened_at", { ascending: false });

  if (params.status && params.status !== "all") query = query.eq("status", params.status);
  if (params.type && params.type !== "all") query = query.eq("type", params.type);
  if (params.q) query = query.or(`title.ilike.%${params.q}%,reference.ilike.%${params.q}%`);

  const [{ data: dossiers }, { data: avocats }] = await Promise.all([
    query,
    supabase.from("avocats").select("id, full_name").order("full_name"),
  ]);

  // Filtrer par avocat côté JS (vu que c'est une jointure many-to-many)
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
          <p className="mt-1 text-sm text-text-secondary">Tous les dossiers du cabinet, filtrables par statut, type et avocat assigné.</p>
        </div>
        <Link
          href="/portail-avocat/dossiers/nouveau"
          className="inline-flex shrink-0 items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
        >
          <Plus className="h-4 w-4" />
          Nouveau dossier
        </Link>
      </div>

      <form className="mb-4 grid grid-cols-1 gap-2 rounded-sm border border-border bg-surface p-3 md:grid-cols-5">
        <select name="status" defaultValue={params.status ?? "all"} className="rounded-sm border border-border px-2 py-2 text-xs">
          <option value="all">Statut : tous</option>
          <option value="active">Actif</option>
          <option value="pending">En attente</option>
          <option value="archived">Archivé</option>
          <option value="won">Clôturé</option>
          <option value="lost">Perdu</option>
        </select>
        <select name="type" defaultValue={params.type ?? "all"} className="rounded-sm border border-border px-2 py-2 text-xs">
          <option value="all">Type : tous</option>
          <option value="M&A">M&A</option>
          <option value="Litigation">Litigation</option>
          <option value="Tax">Tax</option>
          <option value="Corporate">Corporate</option>
          <option value="PE">PE</option>
          <option value="Restructuring">Restructuring</option>
        </select>
        <select name="avocat" defaultValue={params.avocat ?? "all"} className="rounded-sm border border-border px-2 py-2 text-xs">
          <option value="all">Avocat : tous</option>
          {(avocats ?? []).map((a) => (
            <option key={a.id} value={a.id}>{a.full_name}</option>
          ))}
        </select>
        <input name="q" defaultValue={params.q ?? ""} placeholder="Recherche titre / numéro" className="rounded-sm border border-border px-2 py-2 text-xs md:col-span-2" />
        <button type="submit" className="rounded-sm bg-foreground px-3 py-2 text-xs text-background md:col-span-5">Appliquer les filtres</button>
      </form>

      <div className="overflow-x-auto rounded-sm border border-border bg-surface">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-surface-alt text-text-muted">
            <tr>
              <th className="px-3 py-2">Numéro</th>
              <th className="px-3 py-2">Client</th>
              <th className="px-3 py-2">Titre</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Statut</th>
              <th className="px-3 py-2">Avocat assigné</th>
              <th className="px-3 py-2">Création</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDossiers.map((d: any) => {
              const lead = d.dossier_avocats?.find((da: any) => da.role === "lead") ?? d.dossier_avocats?.[0];
              const avocatName = lead?.avocats?.full_name ?? "—";
              return (
                <tr key={d.id} className="border-t border-border-subtle hover:bg-surface-alt/50">
                  <td className="px-3 py-2 font-mono">{d.reference}</td>
                  <td className="px-3 py-2">{d.client?.full_name ?? "—"}</td>
                  <td className="px-3 py-2">{d.title}</td>
                  <td className="px-3 py-2">{d.type ?? "—"}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${STATUS_COLORS[d.status] ?? "bg-gray-100 text-gray-800"}`}>
                      {STATUS_LABELS[d.status] ?? d.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">{avocatName}</td>
                  <td className="px-3 py-2">{d.opened_at ? fmtDate(d.opened_at) : "—"}</td>
                  <td className="px-3 py-2">
                    <Link className="text-bordeaux underline" href={`/portail-avocat/dossiers/${d.reference}`}>Voir</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}