"use client";

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import { checkConflict, type ConflictResult } from "./conflict-actions";
import { Search, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

type Props = { orgId: string };

export function ConflictChecker({ orgId }: Props) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ConflictResult | null>(null);
  const [lastQuery, setLastQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setError(null);
    setResult(null);
    setLastQuery(query.trim());

    startTransition(async () => {
      const res = await checkConflict(query, orgId);
      if (res.error) { setError(res.error); return; }
      setResult(res.result ?? null);
    });
  }

  return (
    <div className="space-y-6">
      {/* Champ de recherche */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nom, société, email, mot-clé…"
            className="w-full rounded-md border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700"
          />
        </div>
        <button
          type="submit"
          disabled={isPending || !query.trim()}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Vérifier"}
        </button>
      </form>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Résultat */}
      {result !== null && !isPending && (
        <div className="space-y-4">
          {result.has_conflict ? (
            <div className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
              <div>
                <p className="text-sm font-medium text-amber-900">
                  Conflit potentiel — {result.matches.length} dossier{result.matches.length > 1 ? "s" : ""} concerné{result.matches.length > 1 ? "s" : ""}
                </p>
                <p className="mt-0.5 text-xs text-amber-700">
                  Recherche : « {lastQuery} »
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-md border border-green-200 bg-green-50 px-4 py-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  Aucun conflit détecté
                </p>
                <p className="mt-0.5 text-xs text-green-700">
                  Recherche : « {lastQuery} »
                </p>
              </div>
            </div>
          )}

          {result.matches.length > 0 && (
            <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white overflow-hidden">
              {result.matches.map((match) => (
                <li key={match.dossier_id}>
                  <Link
                    href={`/portail-avocat/dossiers/${match.dossier_reference}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {match.dossier_title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        <span className="font-mono">{match.dossier_reference}</span>
                        {" · "}
                        {match.match_context}
                      </p>
                    </div>
                    <span className="ml-4 shrink-0 text-xs text-amber-700 font-medium">
                      Voir →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Note de bas de page */}
      <p className="text-xs text-slate-400">
        Chaque vérification est automatiquement enregistrée dans le journal des conflits.
      </p>
    </div>
  );
}
