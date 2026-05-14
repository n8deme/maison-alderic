import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, Clock, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDateFrLong } from "@/lib/format-date";

export const metadata: Metadata = { title: "Rendez-vous" };

function fmtTime(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

export default async function PortailRendezVousPage({
  searchParams,
}: {
  searchParams: Promise<{ vue?: "avenir" | "passes" }>;
}) {
  const { vue = "avenir" } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const now = new Date().toISOString();
  const isPastView = vue === "passes";

  const { data: appointments } = await supabase
    .from("appointments")
    .select("id, title, description, starts_at, ends_at, location, status, avocat:avocats(full_name, title)")
    .eq("client_id", user.id)
    [isPastView ? "lt" : "gte"]("starts_at", now)
    .order("starts_at", { ascending: !isPastView });

  const list = appointments ?? [];

  return (
    <div className="max-w-5xl p-6 md:p-8">
      <div className="mb-6">
        <h1
          className="text-2xl font-medium md:text-3xl"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          Mes rendez-vous
        </h1>
        <p className="mt-1 text-sm text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
          {list.length} rendez-vous {isPastView ? "passés" : "à venir"}
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex gap-1.5">
          <Link
            href="/portail/rendez-vous?vue=avenir"
            className={`rounded-sm border px-3 py-1 text-xs ${
              !isPastView
                ? "border-foreground bg-foreground text-background"
                : "border-border text-text-secondary hover:border-foreground hover:text-foreground"
            }`}
          >
            À venir
          </Link>
          <Link
            href="/portail/rendez-vous?vue=passes"
            className={`rounded-sm border px-3 py-1 text-xs ${
              isPastView
                ? "border-foreground bg-foreground text-background"
                : "border-border text-text-secondary hover:border-foreground hover:text-foreground"
            }`}
          >
            Passés
          </Link>
        </div>

        <Link
          href="/contact?motif=rendez-vous"
          className="rounded-sm bg-bordeaux px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
        >
          Demander un RDV
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="rounded-sm border border-border bg-surface p-10 text-center">
          <Calendar className="mx-auto mb-3 h-8 w-8 text-text-muted" />
          <p className="text-sm text-text-secondary">Aucun rendez-vous {isPastView ? "passé" : "à venir"}.</p>
          <p className="mt-1 text-xs text-text-muted">Votre avocat vous proposera un créneau selon l’avancement du dossier.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-sm border border-border bg-surface">
          {list.map((appt, idx) => {
            const avocat = appt.avocat as unknown as { full_name: string; title: string } | null;
            return (
              <article key={appt.id} className={`px-5 py-4 ${idx !== 0 ? "border-t border-border-subtle" : ""}`}>
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{appt.title}</p>
                    {avocat && (
                      <p className="mt-0.5 text-xs text-text-muted">
                        Avec {avocat.full_name} — {avocat.title}
                      </p>
                    )}
                  </div>
                  <span className="rounded-sm bg-surface-alt px-2 py-0.5 text-[10px] uppercase tracking-wide text-text-muted">
                    {appt.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-text-secondary">
                  <p className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-text-muted" />
                    {formatDateFrLong(appt.starts_at)}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-text-muted" />
                    {fmtTime(appt.starts_at)} - {fmtTime(appt.ends_at)}
                  </p>
                  {appt.location && (
                    <p className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-text-muted" />
                      {appt.location}
                    </p>
                  )}
                </div>

                {appt.description && <p className="mt-3 border-t border-border-subtle pt-3 text-xs text-text-muted">{appt.description}</p>}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
