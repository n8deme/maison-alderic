"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppointmentCell } from "./appointment-cell";
import { AppointmentDetailModal } from "./appointment-detail-modal";

export type Appointment = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  status: string;
  avocat: { full_name: string } | null;
  client: { full_name: string } | null;
};

const DAYS_FR    = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS_FR  = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function fmtTime(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

function fmtDateLong(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", {
    weekday: "long", day: "numeric", month: "long",
  }).format(new Date(iso));
}

/**
 * Returns all Date objects needed to fill the calendar grid for a given month.
 * Weeks start on Monday (European convention).
 */
function buildMonthGrid(year: number, month: number): Date[] {
  const firstDay   = new Date(year, month, 1);
  const lastDay    = new Date(year, month + 1, 0);
  // Monday = 0 … Sunday = 6
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalCells  = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7;

  return Array.from({ length: totalCells }, (_, i) => new Date(year, month, 1 - startOffset + i));
}

export function CalendarMonthView({ appointments }: { appointments: Appointment[] }) {
  const today = new Date();
  const [viewDate, setViewDate]       = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [view, setView]               = useState<"month" | "list">("month");
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const todayKey = toDateKey(today);

  // Index appointments by calendar date key
  const apptsByDate: Record<string, Appointment[]> = {};
  for (const appt of appointments) {
    const key = toDateKey(new Date(appt.starts_at));
    (apptsByDate[key] ??= []).push(appt);
  }

  // Filter for current view month (list view)
  const monthAppts = appointments
    .filter((a) => {
      const d = new Date(a.starts_at);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at));

  const cells = buildMonthGrid(year, month);

  function prevMonth() { setViewDate(new Date(year, month - 1, 1)); }
  function nextMonth() { setViewDate(new Date(year, month + 1, 1)); }
  function goToday()   { setViewDate(new Date(today.getFullYear(), today.getMonth(), 1)); }

  return (
    <>
      {/* Navigation header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-surface hover:bg-surface-alt transition-colors"
            aria-label="Mois précédent"
          >
            <ChevronLeft className="h-4 w-4 text-text-secondary" />
          </button>

          <h2
            className="w-36 text-center text-lg font-medium"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            {MONTHS_FR[month]} {year}
          </h2>

          <button
            type="button"
            onClick={nextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-surface hover:bg-surface-alt transition-colors"
            aria-label="Mois suivant"
          >
            <ChevronRight className="h-4 w-4 text-text-secondary" />
          </button>

          <button
            type="button"
            onClick={goToday}
            className="ml-1 h-8 rounded-sm border border-border bg-surface px-3 text-xs font-medium hover:bg-surface-alt transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Aujourd&apos;hui
          </button>
        </div>

        {/* View toggle */}
        <div className="flex overflow-hidden rounded-sm border border-border">
          {(["month", "list"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                v !== "month" ? "border-l border-border" : ""
              } ${
                view === v
                  ? "bg-foreground text-background"
                  : "bg-surface text-text-secondary hover:bg-surface-alt"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {v === "month" ? "Vue mois" : "Vue liste"}
            </button>
          ))}
        </div>
      </div>

      {view === "month" ? (
        <div className="overflow-hidden rounded-sm border border-border bg-surface">
          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 border-b border-border bg-surface-alt">
            {DAYS_FR.map((d) => (
              <div
                key={d}
                className="py-2 text-center text-[10px] font-medium uppercase tracking-wider text-text-muted"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {cells.map((date, i) => {
              const isCurrentMonth = date.getMonth() === month;
              const key            = toDateKey(date);
              const isToday        = key === todayKey;
              const dayAppts       = apptsByDate[key] ?? [];
              const visible        = dayAppts.slice(0, 3);
              const hiddenCount    = dayAppts.length - 3;
              const isLastInRow    = (i + 1) % 7 === 0;

              return (
                <div
                  key={key + "-" + i}
                  className={[
                    "min-h-24 p-1.5",
                    "border-t border-border",
                    !isLastInRow ? "border-r border-border" : "",
                    !isCurrentMonth ? "bg-surface-alt/60" : "",
                  ].join(" ")}
                >
                  {/* Day number */}
                  <div className="mb-0.5 flex justify-end">
                    <span
                      className={[
                        "flex h-5 w-5 items-center justify-center rounded-full text-[11px]",
                        isToday
                          ? "font-semibold text-white"
                          : isCurrentMonth
                          ? "text-foreground"
                          : "text-text-muted",
                      ].join(" ")}
                      style={
                        isToday
                          ? { backgroundColor: "var(--accent)", fontFamily: "var(--font-body)" }
                          : { fontFamily: "var(--font-body)" }
                      }
                    >
                      {date.getDate()}
                    </span>
                  </div>

                  {/* Appointment pills */}
                  <div className="space-y-0.5">
                    {visible.map((appt, ai) => (
                      <AppointmentCell
                        key={appt.id}
                        appointment={appt}
                        colorIndex={ai}
                        onClick={() => setSelectedAppt(appt)}
                      />
                    ))}
                    {hiddenCount > 0 && (
                      <button
                        type="button"
                        className="w-full px-1.5 text-left text-[10px] text-text-muted hover:text-text-secondary transition-colors"
                        style={{ fontFamily: "var(--font-body)" }}
                        onClick={() => setSelectedAppt(dayAppts[3])}
                      >
                        + {hiddenCount} autre{hiddenCount > 1 ? "s" : ""}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List view */
        <div className="rounded-sm border border-border bg-surface">
          {monthAppts.length === 0 ? (
            <p className="p-6 text-sm text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
              Aucun rendez-vous ce mois-ci.
            </p>
          ) : (
            monthAppts.map((appt, i) => (
              <button
                key={appt.id}
                type="button"
                onClick={() => setSelectedAppt(appt)}
                className={`w-full px-5 py-4 text-left hover:bg-surface-alt transition-colors ${
                  i !== 0 ? "border-t border-border-subtle" : ""
                }`}
              >
                <p className="text-sm font-medium text-foreground" style={{ fontFamily: "var(--font-body)" }}>
                  {appt.title}
                </p>
                <p className="mt-0.5 text-xs capitalize text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
                  {fmtDateLong(appt.starts_at)} à {fmtTime(appt.starts_at)}
                  {appt.client ? ` · ${appt.client.full_name}` : ""}
                  {appt.avocat ? ` · ${appt.avocat.full_name}` : ""}
                </p>
              </button>
            ))
          )}
        </div>
      )}

      {/* Detail modal */}
      {selectedAppt && (
        <AppointmentDetailModal
          appointment={selectedAppt}
          onClose={() => setSelectedAppt(null)}
        />
      )}
    </>
  );
}
