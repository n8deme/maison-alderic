"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { addTimeEntry, type TimeEntryRow } from "@/app/portail-avocat/dossiers/[reference]/time-actions";
import { Play, Square, Clock, Euro } from "lucide-react";

type Props = {
  dossierId: string;
  orgId: string;
  initialEntries: TimeEntryRow[];
};

function fmtMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}h${String(m).padStart(2, "0")}`;
}

function fmtSeconds(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function parseDuration(hhMm: string): number {
  const [h, m] = hhMm.split(":").map(Number);
  return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
}

function fmtEur(n: number): string {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export function DossierTimeTracking({ dossierId, orgId, initialEntries }: Props) {
  const [entries, setEntries] = useState<TimeEntryRow[]>(initialEntries);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [description, setDescription] = useState("");
  const [durationHHMM, setDurationHHMM] = useState("00:30");
  const [rate, setRate] = useState("250");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  function handleStart() {
    setElapsed(0);
    setRunning(true);
  }

  function handleStop() {
    setRunning(false);
    const h = Math.floor(elapsed / 3600);
    const m = Math.max(1, Math.ceil((elapsed % 3600) / 60));
    setDurationHHMM(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const minutes = parseDuration(durationHHMM);
    if (minutes <= 0) { setFormError("Durée invalide"); return; }
    if (!description.trim()) { setFormError("Description requise"); return; }
    const rateNum = parseFloat(rate);
    if (isNaN(rateNum) || rateNum <= 0) { setFormError("Taux invalide"); return; }

    startTransition(async () => {
      const result = await addTimeEntry(dossierId, orgId, minutes, description.trim(), rateNum, date);
      if (result.error) { setFormError(result.error); return; }
      if (result.entry) {
        setEntries((prev) => [result.entry!, ...prev]);
        setDescription("");
        setDurationHHMM("00:30");
        setElapsed(0);
      }
    });
  }

  const unbilledTotal = entries
    .filter((e) => !e.billed)
    .reduce((sum, e) => sum + e.total_amount, 0);
  const totalMinutes = entries.reduce((sum, e) => sum + e.duration_minutes, 0);
  const estimatedAmount = (parseDuration(durationHHMM) / 60) * (parseFloat(rate) || 0);

  return (
    <div className="space-y-5">
      {/* Chronomètre */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-6 py-5 flex flex-col items-center gap-4">
        <span
          className={`font-mono text-4xl font-light tracking-widest tabular-nums transition-colors ${
            running ? "text-amber-700" : "text-slate-400"
          }`}
        >
          {fmtSeconds(elapsed)}
        </span>
        <div className="flex gap-3">
          {!running ? (
            <button
              type="button"
              onClick={handleStart}
              className="inline-flex items-center gap-2 rounded-md bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 transition-colors"
            >
              <Play className="h-4 w-4" /> Démarrer
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStop}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
              <Square className="h-4 w-4" /> Arrêter
            </button>
          )}
        </div>
        {elapsed > 0 && !running && (
          <p className="text-xs text-slate-400">Durée reportée dans le formulaire</p>
        )}
      </div>

      {/* Saisie manuelle */}
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-slate-200 bg-white p-6 space-y-4"
      >
        <h3 className="text-sm font-medium text-slate-900">Saisir du temps</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Durée (HH:MM)</label>
            <input
              type="text"
              value={durationHHMM}
              onChange={(e) => setDurationHHMM(e.target.value)}
              placeholder="01:30"
              className="w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Taux horaire (€/h)</label>
            <input
              type="number"
              min="0"
              step="10"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Ex : Analyse du contrat, recherche jurisprudentielle…"
            className="w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700"
          />
        </div>

        {formError && <p className="text-sm text-red-600">{formError}</p>}

        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Montant estimé :{" "}
            <span className="font-medium text-slate-900">{fmtEur(estimatedAmount)}</span>
          </p>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>

      {/* Totaux + bouton facture */}
      {entries.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Temps total</p>
            <p className="text-lg font-medium text-slate-900">{fmtMinutes(totalMinutes)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">À facturer</p>
            <p className="text-lg font-medium text-amber-700">{fmtEur(unbilledTotal)}</p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center">
            <a
              href={`/portail-avocat/facturation?dossier=${dossierId}`}
              className={`flex h-full flex-col items-center justify-center gap-1 ${
                unbilledTotal === 0 ? "pointer-events-none opacity-40" : ""
              }`}
            >
              <Euro className="h-4 w-4 text-amber-700" />
              <p className="text-xs font-medium text-amber-800">Générer facture</p>
            </a>
          </div>
        </div>
      )}

      {/* Liste entrées */}
      {entries.length === 0 ? (
        <div className="py-10 text-center">
          <Clock className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm text-slate-400">Aucune entrée de temps pour ce dossier.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{entry.description}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {entry.avocat_full_name}
                  {" · "}
                  {new Date(entry.date).toLocaleDateString("fr-FR")}
                  {" · "}
                  {fmtMinutes(entry.duration_minutes)}
                  {" · "}
                  {Number(entry.rate_per_hour).toLocaleString("fr-FR")} €/h
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-medium text-slate-900">{fmtEur(entry.total_amount)}</p>
                {entry.billed ? (
                  <span className="rounded border border-green-200 bg-green-50 px-1.5 py-0.5 text-[10px] text-green-700">
                    Facturé
                  </span>
                ) : (
                  <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700">
                    À facturer
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
