import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DownloadButton } from "@/components/portail/documents/download-button";

export const metadata: Metadata = { title: "Documents" };

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

export default async function AvocatDocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; dossier?: string; client?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  let query = supabase
    .from("documents")
    .select("id, name, file_path, category, created_at, dossier_id, uploaded_by, dossier:dossiers(reference, title, client:profiles!client_id(full_name)), uploader:profiles!uploaded_by(full_name)")
    .order("created_at", { ascending: false });

  if (params.category && params.category !== "all") query = query.eq("category", params.category);
  if (params.dossier && params.dossier !== "all") query = query.eq("dossier_id", params.dossier);
  if (params.q) query = query.ilike("name", `%${params.q}%`);

  const [{ data: documents }, { data: dossiers }, { data: clients }] = await Promise.all([
    query,
    supabase.from("dossiers").select("id, reference").order("reference"),
    supabase.from("profiles").select("id, full_name").eq("role", "client").order("full_name"),
  ]);

  const filteredDocs = (documents ?? []).filter((doc: any) => {
    if (!params.client || params.client === "all") return true;
    return doc.dossier?.client?.id === params.client;
  });

  return (
    <div className="max-w-7xl p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>Documents globaux</h1>
      </div>

      <form className="mb-4 grid grid-cols-1 gap-2 rounded-sm border border-border bg-surface p-3 md:grid-cols-4">
        <input name="q" defaultValue={params.q ?? ""} placeholder="Recherche document" className="rounded-sm border border-border px-2 py-2 text-xs" />
        <select name="category" defaultValue={params.category ?? "all"} className="rounded-sm border border-border px-2 py-2 text-xs">
          <option value="all">Catégorie : toutes</option>
          <option value="contract">Contrat</option>
          <option value="mandat">Mandat</option>
          <option value="pleading">Conclusions</option>
          <option value="correspondence">Correspondance</option>
          <option value="other">Autre</option>
        </select>
        <select name="dossier" defaultValue={params.dossier ?? "all"} className="rounded-sm border border-border px-2 py-2 text-xs">
          <option value="all">Dossier: tous</option>
          {(dossiers ?? []).map((d) => (
            <option key={d.id} value={d.id}>{d.reference}</option>
          ))}
        </select>
        <select name="client" defaultValue={params.client ?? "all"} className="rounded-sm border border-border px-2 py-2 text-xs">
          <option value="all">Client: tous</option>
          {(clients ?? []).map((c) => (
            <option key={c.id} value={c.id}>{c.full_name}</option>
          ))}
        </select>
        <button type="submit" className="rounded-sm bg-foreground px-3 py-2 text-xs text-background md:col-span-4">Filtrer</button>
      </form>

      <div className="overflow-x-auto rounded-sm border border-border bg-surface">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-surface-alt text-text-muted">
            <tr>
              <th className="px-3 py-2">Nom</th>
              <th className="px-3 py-2">Catégorie</th>
              <th className="px-3 py-2">Dossier</th>
              <th className="px-3 py-2">Client</th>
              <th className="px-3 py-2">Date upload</th>
              <th className="px-3 py-2">Uploadé par</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((doc: any) => (
              <tr key={doc.id} className="border-t border-border-subtle">
                <td className="px-3 py-2">{doc.name}</td>
                <td className="px-3 py-2">
                  {doc.category === "contract" ? "Contrat" :
                   doc.category === "mandat" ? "Mandat" :
                   doc.category === "pleading" ? "Conclusions" :
                   doc.category === "correspondence" ? "Correspondance" :
                   doc.category === "other" ? "Autre" : doc.category}
                </td>
                <td className="px-3 py-2">{doc.dossier?.reference ?? "-"}</td>
                <td className="px-3 py-2">{doc.dossier?.client?.full_name ?? "-"}</td>
                <td className="px-3 py-2">{fmtDate(doc.created_at)}</td>
                <td className="px-3 py-2">{doc.uploader?.full_name ?? "-"}</td>
                <td className="px-3 py-2">
                  <DownloadButton documentId={doc.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}