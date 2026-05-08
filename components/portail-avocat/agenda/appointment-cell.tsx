"use client";

import type { Appointment } from "./calendar-month-view";

const ACCENT_COLORS = ["#7A1F2B", "#3B4F8C", "#1A6B3C", "#7A5F1F"];

function fmtTime(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

export function AppointmentCell({
  appointment,
  colorIndex,
  onClick,
}: {
  appointment: Appointment;
  colorIndex: number;
  onClick: () => void;
}) {
  const color = ACCENT_COLORS[colorIndex % ACCENT_COLORS.length];

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="w-full flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-left hover:opacity-75 transition-opacity"
      style={{ backgroundColor: `${color}18` }}
    >
      <span className="shrink-0 h-3 w-0.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="truncate text-[10px] text-foreground" style={{ fontFamily: "var(--font-body)" }}>
        <span className="font-medium">{fmtTime(appointment.starts_at)}</span>
        {" "}{appointment.title}
      </span>
    </button>
  );
}
