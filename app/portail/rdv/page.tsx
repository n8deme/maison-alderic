import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAvocatPhoto } from "@/lib/avocats-photos";
import { formatDateFrLong } from "@/lib/format-date";
import { Calendar, Clock, MapPin, CheckCircle2, XCircle } from "lucide-react";

export const metadata: Metadata = { title: "Rendez-vous" };

type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "cancelled";

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string; bg: string }> = {
  scheduled: { label: "Planifié",  color: "var(--text-secondary)", bg: "var(--surface-alt)"   },
  confirmed: { label: "Confirmé",  color: "#16a34a",               bg: "rgba(22,163,74,0.08)" },
  completed: { label: "Passé",     color: "var(--text-muted)",     bg: "var(--surface-alt)"   },
  cancelled: { label: "Annulé",    color: "var(--bordeaux)",       bg: "rgba(122,31,43,0.08)" },
};

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const c = STATUS_CONFIG[status] ?? STATUS_CONFIG.scheduled;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium uppercase tracking-wider shrink-0"
      style={{ color: c.color, backgroundColor: c.bg, fontFamily: "var(--font-body)" }}
    >
      {c.label}
    </span>
  );
}

function fmtTime(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

export default async function RdvPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const now = new Date().toISOString();

  const [upcomingResult, pastResult] = await Promise.all([
    supabase
      .from("appointments")
      .select("id, title, description, starts_at, ends_at, location, status, avocat:avocats(full_name, title, slug)")
      .eq("client_id", user.id)
      .in("status", ["scheduled", "confirmed"])
      .gte("starts_at", now)
      .order("starts_at", { ascending: true }),

    supabase
      .from("appointments")
      .select("id, title, starts_at, ends_at, location, status, avocat:avocats(full_name, title, slug)")
      .eq("client_id", user.id)
      .or(`status.eq.completed,status.eq.cancelled,starts_at.lt.${now}`)
      .order("starts_at", { ascending: false })
      .limit(10),
  ]);

  const upcoming = upcomingResult.data ?? [];
  const past     = pastResult.data     ?? [];

  type Avocat = { full_name: string; title: string; slug: string | null };

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-medium"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          Rendez-vous
        </h1>
        <p className="mt-1 text-sm text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
          {upcoming.length} à venir
        </p>
      </div>

      {/* Upcoming */}
      <section className="mb-10">
        <h2
          className="text-xs font-medium uppercase tracking-wider text-text-muted mb-4"
          style={{ fontFamily: "var(--font-body)" }}
        >
          À venir
        </h2>

        {upcoming.length === 0 ? (
          <div className="bg-surface border border-border rounded-sm p-8 text-center">
            <Calendar className="w-7 h-7 mx-auto mb-3 text-text-muted" />
            <p className="text-sm text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
              Aucun rendez-vous à venir.
            </p>
            <p className="text-xs text-text-muted mt-1" style={{ fontFamily: "var(--font-body)" }}>
              Contactez votre avocat pour planifier un rendez-vous.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((appt) => {
              const avocat = appt.avocat as unknown as Avocat | null;
              return (
                <div
                  key={appt.id}
                  className="bg-surface border border-border rounded-sm p-5"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>
                      {appt.title}
                    </h3>
                    <StatusBadge status={appt.status as AppointmentStatus} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      <span className="text-xs text-text-secondary capitalize" style={{ fontFamily: "var(--font-body)" }}>
                        {formatDateFrLong(appt.starts_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      <span className="text-xs text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
                        {fmtTime(appt.starts_at)} – {fmtTime(appt.ends_at)}
                      </span>
                    </div>
                    {appt.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
                        <span className="text-xs text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
                          {appt.location}
                        </span>
                      </div>
                    )}
                    {avocat && (
                      <div className="mt-1 flex items-center gap-2">
                        <Image
                          src={getAvocatPhoto(avocat.slug ?? "")}
                          alt={avocat.full_name}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                        <p className="text-xs text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                          Avec {avocat.full_name} — {avocat.title}
                        </p>
                      </div>
                    )}
                  </div>

                  {appt.description && (
                    <p className="text-xs text-text-secondary mt-3 pt-3 border-t border-border-subtle" style={{ fontFamily: "var(--font-body)" }}>
                      {appt.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h2
            className="text-xs font-medium uppercase tracking-wider text-text-muted mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Historique
          </h2>
          <div className="bg-surface border border-border rounded-sm overflow-hidden">
            {past.map((appt, idx) => {
              const avocat = appt.avocat as unknown as Avocat | null;
              const isDone = appt.status === "completed";
              return (
                <div
                  key={appt.id}
                  className={`flex items-center gap-4 px-5 py-3.5 ${idx !== 0 ? "border-t border-border-subtle" : ""}`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-text-muted" />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0" style={{ color: "var(--bordeaux)" }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ fontFamily: "var(--font-body)", color: isDone ? "var(--text-secondary)" : "var(--text-muted)" }}>
                      {appt.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-text-muted capitalize" style={{ fontFamily: "var(--font-body)" }}>
                        {formatDateFrLong(appt.starts_at)}
                      </span>
                      {avocat && (
                        <>
                          <span className="text-[10px] text-border">·</span>
                          <span className="text-[10px] text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                            {avocat.full_name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={appt.status as AppointmentStatus} />
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
