"use client";

import { useState, type ReactNode } from "react";
import { DossierNotes } from "./dossier-notes";
import { DossierAISummary } from "./dossier-ai-summary";
import { DossierTimeTracking } from "./dossier-time-tracking";
import type { TimeEntryRow } from "@/app/portail-avocat/dossiers/[reference]/time-actions";

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
  reference: string;
  initialNotes: Note[];
  initialEntries: TimeEntryRow[];
  timelineContent: ReactNode;
};

type Tab = "timeline" | "notes" | "temps" | "ai";

const TABS: { id: Tab; label: string }[] = [
  { id: "timeline", label: "Timeline" },
  { id: "notes",    label: "Notes" },
  { id: "temps",    label: "Temps" },
  { id: "ai",       label: "✨ Résumé IA" },
];

export function DossierDetailTabs({
  dossierId,
  orgId,
  reference,
  initialNotes,
  initialEntries,
  timelineContent,
}: Props) {
  const [active, setActive] = useState<Tab>("timeline");

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-slate-200 px-6 pt-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors rounded-t ${
              active === tab.id
                ? "border-amber-700 text-amber-800"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
            {tab.id === "notes" && initialNotes.length > 0 && (
              <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[10px] font-medium text-slate-600">
                {initialNotes.length}
              </span>
            )}
            {tab.id === "temps" && initialEntries.length > 0 && (
              <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-100 text-[10px] font-medium text-amber-700">
                {initialEntries.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {active === "timeline" && timelineContent}
        {active === "notes" && (
          <DossierNotes dossierId={dossierId} orgId={orgId} initialNotes={initialNotes} />
        )}
        {active === "temps" && (
          <DossierTimeTracking
            dossierId={dossierId}
            orgId={orgId}
            initialEntries={initialEntries}
          />
        )}
        {active === "ai" && (
          <DossierAISummary dossierId={dossierId} orgId={orgId} />
        )}
      </div>
    </div>
  );
}
