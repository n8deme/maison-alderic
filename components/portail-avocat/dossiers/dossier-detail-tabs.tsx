"use client";

import { useState, type ReactNode } from "react";
import { DossierNotes } from "./dossier-notes";
import { DossierAISummary } from "./dossier-ai-summary";

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
  timelineContent: ReactNode;
};

type Tab = "timeline" | "notes" | "ai";

const TABS: { id: Tab; label: string }[] = [
  { id: "timeline", label: "Timeline" },
  { id: "notes",    label: "Notes" },
  { id: "ai",       label: "✨ Résumé IA" },
];

export function DossierDetailTabs({ dossierId, orgId, reference, initialNotes, timelineContent }: Props) {
  const [active, setActive] = useState<Tab>("timeline");

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      {/* Tab bar */}
      <div className="flex border-b border-slate-200 px-6 pt-4 gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t transition-colors -mb-px border-b-2 ${
              active === tab.id
                ? "border-amber-700 text-amber-800"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
            {tab.id === "notes" && initialNotes.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                {initialNotes.length}
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
        {active === "ai" && (
          <DossierAISummary dossierId={dossierId} orgId={orgId} />
        )}
      </div>
    </div>
  );
}
