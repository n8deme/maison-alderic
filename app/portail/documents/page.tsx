import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FileText, Upload } from "lucide-react";
import Link from "next/link";
import { DownloadButton } from "@/components/portail/documents/download-button";
import { uploadDocument } from "./actions";

export const metadata: Metadata = { title: "Documents" };

const CATEGORY_LABELS: Record<string, string> = {
  contract:       "Contrat",
  mandat:         "Mandat",
  pleading:       "Conclusions",
  correspondence: "Correspondance",
  other:          "Autre",
};

function fmtSize(bytes: number) {
  if (bytes < 1024)        return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

export default async function DocumentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portail/login");

  const [docsResult, dossiersResult] = await Promise.all([
    supabase
      .from("documents")
      .select("id, name, description, file_path, file_size, mime_type, category, is_signed, created_at, dossier:dossiers(id, reference, title)")
      .eq("visible_to_client", true)
      .order("created_at", { ascending: false }),

    supabase
      .from("dossiers")
      .select("id, reference, title")
      .eq("client_id", user.id)
      .in("status", ["active", "pending"])
      .order("opened_at", { ascending: false }),
  ]);

  const documents = docsResult.data  ?? [];
  const dossiers  = dossiersResult.data ?? [];

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1
            className="text-2xl md:text-3xl font-medium"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            Documents
          </h1>
          <p className="mt-1 text-sm text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
            {documents.length} document{documents.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document list */}
        <div className="lg:col-span-2">
          {documents.length === 0 ? (
            <div className="bg-surface border border-border rounded-sm p-12 text-center">
              <FileText className="w-8 h-8 mx-auto mb-3 text-text-muted" />
              <p className="text-sm text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
                Aucun document disponible.
              </p>
              <Link
                href="/portail/messages"
                className="mt-4 inline-flex rounded-sm border border-bordeaux px-4 py-2 text-xs font-medium uppercase tracking-wide text-bordeaux transition-colors hover:bg-bordeaux hover:text-white"
              >
                Demander un document
              </Link>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-sm overflow-hidden">
              {documents.map((doc, idx) => {
                const dossier = doc.dossier as unknown as { id: string; reference: string; title: string } | null;
                return (
                  <div
                    key={doc.id}
                    className={`flex items-start gap-4 px-5 py-4 ${idx !== 0 ? "border-t border-border-subtle" : ""}`}
                  >
                    <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "var(--surface-alt)" }}>
                      <FileText className="w-4 h-4 text-text-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ fontFamily: "var(--font-body)" }}>
                        {doc.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        {dossier && (
                          <span className="text-[10px] text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                            {dossier.reference}
                          </span>
                        )}
                        <span className="text-[10px] text-border">·</span>
                        <span className="text-[10px] text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                          {CATEGORY_LABELS[doc.category] ?? doc.category}
                        </span>
                        <span className="text-[10px] text-border">·</span>
                        <span className="text-[10px] text-text-muted tabular-nums" style={{ fontFamily: "var(--font-body)" }}>
                          {fmtSize(doc.file_size)}
                        </span>
                        <span className="text-[10px] text-border">·</span>
                        <span className="text-[10px] text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                          {fmtDate(doc.created_at)}
                        </span>
                        {doc.is_signed && (
                          <>
                            <span className="text-[10px] text-border">·</span>
                            <span
                              className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm"
                              style={{ color: "#16a34a", backgroundColor: "rgba(22,163,74,0.08)" }}
                            >
                              Signé
                            </span>
                          </>
                        )}
                      </div>
                      {doc.description && (
                        <p className="text-xs text-text-muted mt-0.5 line-clamp-1" style={{ fontFamily: "var(--font-body)" }}>
                          {doc.description}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0">
                      <DownloadButton filePath={doc.file_path} fileName={doc.name} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upload panel */}
        <div className="bg-surface border border-border rounded-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-4 h-4" style={{ color: "var(--bordeaux)" }} />
            <h2 className="text-xs font-medium uppercase tracking-wider text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
              Déposer un document
            </h2>
          </div>

          {dossiers.length === 0 ? (
            <p className="text-xs text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
              Aucun dossier actif pour déposer des documents.
            </p>
          ) : (
            <form action={uploadDocument} className="space-y-3">
              <div>
                <label className="block text-[10px] text-text-muted uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-body)" }}>
                  Dossier
                </label>
                <select
                  name="dossier_id"
                  required
                  className="w-full text-xs border border-border rounded-sm px-2.5 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-[color:var(--bordeaux)]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {dossiers.map((dos) => (
                    <option key={dos.id} value={dos.id}>
                      {dos.reference} — {dos.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-text-muted uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-body)" }}>
                  Catégorie
                </label>
                <select
                  name="category"
                  className="w-full text-xs border border-border rounded-sm px-2.5 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-[color:var(--bordeaux)]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-text-muted uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-body)" }}>
                  Nom (optionnel)
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Nom du document"
                  className="w-full text-xs border border-border rounded-sm px-2.5 py-2 bg-background placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-[color:var(--bordeaux)]"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>

              <div>
                <label className="block text-[10px] text-text-muted uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-body)" }}>
                  Fichier <span style={{ color: "var(--bordeaux)" }}>*</span>
                </label>
                <input
                  name="file"
                  type="file"
                  required
                  className="w-full text-xs text-text-secondary file:text-xs file:border-0 file:bg-surface-alt file:px-3 file:py-1.5 file:rounded-sm file:cursor-pointer file:mr-2"
                  style={{ fontFamily: "var(--font-body)" }}
                />
                <p className="text-[10px] text-text-muted mt-1" style={{ fontFamily: "var(--font-body)" }}>
                  Max 20 Mo
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2 text-xs font-medium rounded-sm transition-colors"
                style={{ backgroundColor: "var(--foreground)", color: "var(--background)", fontFamily: "var(--font-body)" }}
              >
                Déposer le document
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
