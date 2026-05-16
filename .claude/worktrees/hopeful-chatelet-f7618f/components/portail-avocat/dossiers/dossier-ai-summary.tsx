"use client";

import { useState, useTransition } from "react";
import { generateDossierSummary } from "@/app/portail-avocat/dossiers/[reference]/ai-actions";
import { Sparkles, RefreshCw } from "lucide-react";

type Props = {
  dossierId: string;
  orgId: string;
};

export function DossierAISummary({ dossierId, orgId }: Props) {
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function generate() {
    setError(null);
    startTransition(async () => {
      const result = await generateDossierSummary(dossierId, orgId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSummary(result.summary ?? null);
    });
  }

  if (!summary && !isPending && !error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-amber-700" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-slate-900">Synthèse IA du dossier</p>
          <p className="text-xs text-slate-500 max-w-xs">
            Génère un résumé intelligent de l&apos;état actuel : timeline, messages, notes.
          </p>
        </div>
        <button
          onClick={generate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-amber-700 text-white text-sm font-medium hover:bg-amber-800 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          Générer le résumé
        </button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-amber-700 border-t-transparent animate-spin" />
        <p className="text-sm text-slate-500">Analyse du dossier en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
        <button
          onClick={generate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-700" />
          <h3 className="text-sm font-medium text-slate-900">Synthèse IA</h3>
        </div>
        <button
          onClick={generate}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Régénérer
        </button>
      </div>

      <div className="rounded-md bg-amber-50 border border-amber-100 px-5 py-4">
        <div className="prose prose-sm max-w-none text-slate-800 [&_ul]:space-y-1 [&_li]:leading-relaxed [&_p]:leading-relaxed">
          {summary!.split("\n").map((line, i) => {
            const bullet = line.match(/^[-•*]\s+(.+)/);
            if (bullet) {
              return (
                <div key={i} className="flex gap-2 text-sm py-0.5">
                  <span className="text-amber-700 mt-0.5 shrink-0">•</span>
                  <span>{bullet[1]}</span>
                </div>
              );
            }
            if (line.trim()) {
              return (
                <p key={i} className="text-sm text-slate-700 mb-1">
                  {line}
                </p>
              );
            }
            return null;
          })}
        </div>
      </div>

      <p className="text-[10px] text-slate-400">
        Résumé généré par IA — à vérifier avant toute décision.
      </p>
    </div>
  );
}
