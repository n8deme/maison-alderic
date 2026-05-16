"use client";

import { useState, type ReactNode } from "react";
import { StickyNote } from "lucide-react";

type Note = {
  id: string;
  content: string;
  created_at: string;
};

type Props = {
  notes: Note[];
  timelineContent: ReactNode;
};

type Tab = "timeline" | "notes";

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function DossierClientTabs({ notes, timelineContent }: Props) {
  const [active, setActive] = useState<Tab>("timeline");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {(
          [
            { id: "timeline" as Tab, label: "Timeline" },
            { id: "notes" as Tab, label: "Notes" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors ${
              active === tab.id
                ? "border-foreground text-foreground"
                : "border-transparent text-text-muted hover:text-text-secondary"
            }`}
            style={{ fontFamily: "var(--font-body)" }}
          >
            {tab.label}
            {tab.id === "notes" && notes.length > 0 && (
              <span
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-medium"
                style={{ background: "var(--surface-alt)", color: "var(--text-muted)" }}
              >
                {notes.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {active === "timeline" && timelineContent}

      {active === "notes" && (
        <div>
          {notes.length === 0 ? (
            <div className="rounded-lg border border-border bg-surface p-8 text-center">
              <StickyNote className="h-8 w-8 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
              <p className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                Aucune note partagée pour ce dossier.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {notes.map((note) => (
                <li
                  key={note.id}
                  className="rounded-sm border border-border bg-surface p-4 space-y-2"
                >
                  <p
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}
                  >
                    {note.content}
                  </p>
                  <p
                    className="text-[11px]"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                  >
                    {fmtDate(note.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
