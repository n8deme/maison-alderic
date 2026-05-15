import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CalendarMonthView, type Appointment } from "@/components/portail-avocat/agenda/calendar-month-view";

export const metadata: Metadata = { title: "Agenda" };

export default async function AvocatAgendaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  // Fetch 3 months back to 12 months forward — covers full client-side navigation
  const now        = new Date();
  const rangeStart = new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString();
  const rangeEnd   = new Date(now.getFullYear(), now.getMonth() + 13, 1).toISOString();

  const { data: raw } = await supabase
    .from("appointments")
    .select(
      "id, title, description, starts_at, ends_at, location, status, avocat:avocats(full_name), client:profiles!client_id(full_name)"
    )
    .gte("starts_at", rangeStart)
    .lt("starts_at", rangeEnd)
    .order("starts_at", { ascending: true });

  // Normalize Supabase joins that may return arrays on certain relationship types
  const appointments: Appointment[] = (raw ?? []).map((a) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = a as any;
    return {
      id:          r.id,
      title:       r.title,
      description: r.description ?? null,
      starts_at:   r.starts_at,
      ends_at:     r.ends_at ?? null,
      location:    r.location ?? null,
      status:      r.status,
      avocat:      Array.isArray(r.avocat) ? (r.avocat[0] ?? null) : (r.avocat ?? null),
      client:      Array.isArray(r.client) ? (r.client[0] ?? null) : (r.client ?? null),
    };
  });

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1
          className="text-3xl"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          Agenda cabinet
        </h1>
        <p className="mt-1 text-sm text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
          Tous les rendez-vous du cabinet.
        </p>
      </div>

      <CalendarMonthView appointments={appointments} />
    </div>
  );
}
