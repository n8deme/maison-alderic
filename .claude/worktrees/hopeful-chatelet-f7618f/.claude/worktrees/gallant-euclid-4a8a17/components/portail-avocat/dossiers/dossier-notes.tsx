"use client";

import { useState, useTransition } from "react";
import { addNote } from "@/app/portail-avocat/dossiers/[reference]/notes-actions";

type Note = {
  id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
  author_full_name: string;
};

type Props = {
  dossierId: string;
  orgId: string;
  initialNotes: Note[];
};

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function DossierNotes({ dossierId, orgId, initialNotes }: Props) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [content, setContent] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    setError(null);

    startTransition(async () => {
      const result = await addNote(dossierId, orgId, trimmed, isInternal);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.note) {
        setNotes((prev) => [result.note!, ...prev]);
        setContent("");
        setIsInternal(false);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
        <h3 className="text-sm font-medium text-slate-900">Ajouter une note</h3>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Votre note..."
          rows={4}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700 resize-none"
          disabled={isPending}
        />
        <div className="flex items-center justify-between flex-wrap gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <button
              type="button"
              role="switch"
              aria-checked={isInternal}
              onClick={() => setIsInternal((v) => !v)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 ${
                isInternal ? "bg-red-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                  isInternal ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className="text-sm text-slate-700">
              Note interne
              {isInternal && (
                <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700 border border-red-200">
                  Interne
                </span>
              )}
            </span>
          </label>
          <button
            type="submit"
            disabled={isPending || !content.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Ajout..." : "Ajouter"}
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      {/* Liste */}
      {notes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-sm text-slate-400">Aucune note pour ce dossier.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id} className="bg-white rounded-lg border border-slate-200 p-4 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-900">{note.author_full_name}</span>
                  {note.is_internal && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700 border border-red-200">
                      Interne
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400">{fmtDate(note.created_at)}</span>
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{note.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
