import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Agenda" };

function fmtDateTime(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default async function AvocatAgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ rdv?: string }>;
}) {
  const { rdv } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

  const { data: appointments } = await supabase
    .from("appointments")
    .select("id, title, description, starts_at, ends_at, location, status, avocat:avocats(full_name), client:profiles!client_id(full_name)")
    .gte("starts_at", monthStart)
    .lt("starts_at", monthEnd)
    .order("starts_at", { ascending: true });

  const selected = (appointments ?? []).find((item) => item.id === rdv);

  return (
    <div className="max-w-6xl p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>Agenda cabinet</h1>
        <p className="mt-1 text-sm text-text-secondary">Calendrier mensuel de tous les rendez-vous.</p>
      </div>

      <div className="rounded-sm border border-border bg-surface">
        {(appointments ?? []).length === 0 ? (
          <p className="p-6 text-sm text-text-muted">Aucun rendez-vous ce mois-ci.</p>
        ) : (
          (appointments ?? []).map((appt: any, index: number) => (
            <Link
              key={appt.id}
              href={`/portail-avocat/agenda?rdv=${appt.id}`}
              className={`block px-5 py-4 hover:bg-surface-alt ${index !== 0 ? "border-t border-border-subtle" : ""}`}
            >
              <p className="text-sm text-foreground">{appt.title}</p>
              <p className="mt-1 text-xs text-text-secondary">
                {fmtDateTime(appt.starts_at)} - {appt.client?.full_name ?? "Client"} - {appt.avocat?.full_name ?? "Avocat"}
              </p>
            </Link>
          ))
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-lg rounded-sm border border-border bg-surface p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <h2 className="text-xl text-foreground">{selected.title}</h2>
              <Link href="/portail-avocat/agenda" className="text-xs text-bordeaux">Fermer</Link>
            </div>
            <p className="text-sm text-text-secondary">Debut: {fmtDateTime(selected.starts_at)}</p>
            <p className="text-sm text-text-secondary">Fin: {fmtDateTime(selected.ends_at)}</p>
            <p className="text-sm text-text-secondary">Lieu: {selected.location ?? "A confirmer"}</p>
            <p className="text-sm text-text-secondary">Statut: {selected.status}</p>
            <p className="mt-3 text-sm text-foreground">{selected.description ?? "Sans description."}</p>
          </div>
        </div>
      )}
    </div>
  );
}
