"use client";

import { X, Clock, MapPin, User, Briefcase } from "lucide-react";
import type { Appointment } from "./calendar-month-view";

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmé",
  pending:   "En attente",
  cancelled: "Annulé",
  done:      "Effectué",
};

function fmtDateLong(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
  }).format(new Date(iso));
}

function fmtTime(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

export function AppointmentDetailModal({
  appointment: appt,
  onClose,
}: {
  appointment: Appointment;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg rounded-sm border border-border bg-surface shadow-md">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border p-5">
          <div>
            <p
              className="mb-1 text-[10px] uppercase tracking-wider text-text-muted"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Rendez-vous
            </p>
            <h2
              className="text-xl text-foreground"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
            >
              {appt.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-border hover:bg-surface-alt transition-colors"
          >
            <X className="h-4 w-4 text-text-muted" />
          </button>
        </div>

        {/* Details */}
        <div className="space-y-3 p-5">
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 shrink-0 text-text-muted" />
            <div>
              <p className="text-sm text-foreground capitalize" style={{ fontFamily: "var(--font-body)" }}>
                {fmtDateLong(appt.starts_at)}
              </p>
              <p className="text-xs text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
                {fmtTime(appt.starts_at)}
                {appt.ends_at ? ` — ${fmtTime(appt.ends_at)}` : ""}
              </p>
            </div>
          </div>

          {appt.location && (
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-text-muted" />
              <p className="text-sm text-foreground" style={{ fontFamily: "var(--font-body)" }}>
                {appt.location}
              </p>
            </div>
          )}

          {appt.client && (
            <div className="flex items-center gap-2.5">
              <User className="h-4 w-4 shrink-0 text-text-muted" />
              <p className="text-sm text-foreground" style={{ fontFamily: "var(--font-body)" }}>
                {appt.client.full_name}
              </p>
            </div>
          )}

          {appt.avocat && (
            <div className="flex items-center gap-2.5">
              <Briefcase className="h-4 w-4 shrink-0 text-text-muted" />
              <p className="text-sm text-foreground" style={{ fontFamily: "var(--font-body)" }}>
                {appt.avocat.full_name}
              </p>
            </div>
          )}

          <div className="pt-1">
            <span
              className="inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
              style={{
                color:           "var(--text-secondary)",
                backgroundColor: "var(--surface-alt)",
                fontFamily:      "var(--font-body)",
              }}
            >
              {STATUS_LABELS[appt.status] ?? appt.status}
            </span>
          </div>

          {appt.description && (
            <div className="border-t border-border pt-3">
              <p className="text-sm leading-relaxed text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
                {appt.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
