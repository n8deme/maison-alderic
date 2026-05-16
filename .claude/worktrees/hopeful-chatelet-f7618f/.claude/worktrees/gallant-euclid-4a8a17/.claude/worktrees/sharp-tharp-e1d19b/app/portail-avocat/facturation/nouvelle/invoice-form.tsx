"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { createInvoice, getDossiersByClient } from "./actions";

const invoiceLineSchema = z.object({
  description: z.string().min(1, "Description requise"),
  quantity: z.number().min(0.01, "Quantité invalide"),
  unit_price: z.number().min(0, "Prix invalide"),
});

const invoiceSchema = z.object({
  client_id: z.string().uuid("Client requis"),
  dossier_id: z.string().optional().nullable(),
  issued_at: z.string().min(1, "Date d'émission requise"),
  due_at: z.string().min(1, "Date d'échéance requise"),
  lines: z.array(invoiceLineSchema).min(1, "Au moins une ligne requise"),
});

type FormValues = z.infer<typeof invoiceSchema>;
type Dossier = { id: string; reference: string; title: string };
type Client = { id: string; full_name: string; company: string | null };

interface InvoiceFormProps {
  clients: Client[];
}

const inputClass =
  "w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-0 disabled:opacity-50";
const labelClass = "block text-xs font-medium text-text-secondary mb-1";
const errorClass = "mt-1 text-xs text-red-600";

function fmtEur(n: number) {
  return new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR" }).format(n);
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function InvoiceForm({ clients }: InvoiceFormProps) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      client_id: "",
      dossier_id: null,
      issued_at: today,
      due_at: addDays(today, 30),
      lines: [{ description: "", quantity: 1, unit_price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });

  const clientId = watch("client_id");
  const lines = watch("lines");
  const issuedAt = watch("issued_at");

  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loadingDossiers, setLoadingDossiers] = useState(false);

  // Charger les dossiers quand le client change
  useEffect(() => {
    if (!clientId) {
      setDossiers([]);
      setValue("dossier_id", null);
      return;
    }
    setLoadingDossiers(true);
    getDossiersByClient(clientId)
      .then((data) => {
        setDossiers(data);
        setValue("dossier_id", null);
      })
      .finally(() => setLoadingDossiers(false));
  }, [clientId, setValue]);

  // Mettre à jour due_at quand issued_at change (garde toujours +30j si pas modifié manuellement)
  useEffect(() => {
    if (issuedAt) setValue("due_at", addDays(issuedAt, 30));
  }, [issuedAt, setValue]);

  // Calcul des totaux
  const totalHT = lines.reduce((sum, l) => {
    const qty = Number(l.quantity) || 0;
    const price = Number(l.unit_price) || 0;
    return sum + qty * price;
  }, 0);
  const tva = Math.round(totalHT * 0.21 * 100) / 100;
  const totalTTC = Math.round((totalHT + tva) * 100) / 100;

  async function onSubmit(values: FormValues, send: boolean) {
    const result = await createInvoice({ ...values, send });
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(
      send ? "Facture créée et envoyée" : "Facture créée en brouillon",
    );
    router.push(`/portail-avocat/facturation/${result.id}`);
  }

  return (
    <form className="space-y-8">
      {/* Section — Client & Dossier */}
      <section className="space-y-4">
        <h2
          className="text-base font-medium tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Client & Dossier
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="client_id" className={labelClass}>
              Client <span className="text-accent">*</span>
            </label>
            <select id="client_id" {...register("client_id")} className={inputClass}>
              <option value="">— Sélectionner un client —</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name}
                  {c.company ? ` — ${c.company}` : ""}
                </option>
              ))}
            </select>
            {errors.client_id && <p className={errorClass}>{errors.client_id.message}</p>}
          </div>

          <div>
            <label htmlFor="dossier_id" className={labelClass}>
              Dossier associé
            </label>
            <select
              id="dossier_id"
              {...register("dossier_id")}
              disabled={!clientId || loadingDossiers}
              className={inputClass}
            >
              <option value="">— Aucun dossier —</option>
              {dossiers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.reference} — {d.title}
                </option>
              ))}
            </select>
            {!clientId && (
              <p className="mt-1 text-xs text-text-muted">Sélectionnez d&apos;abord un client</p>
            )}
          </div>
        </div>
      </section>

      {/* Section — Dates */}
      <section className="space-y-4">
        <h2
          className="text-base font-medium tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Dates
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="issued_at" className={labelClass}>
              Date d&apos;émission <span className="text-accent">*</span>
            </label>
            <input id="issued_at" type="date" {...register("issued_at")} className={inputClass} />
            {errors.issued_at && <p className={errorClass}>{errors.issued_at.message}</p>}
          </div>
          <div>
            <label htmlFor="due_at" className={labelClass}>
              Date d&apos;échéance <span className="text-accent">*</span>
            </label>
            <input id="due_at" type="date" {...register("due_at")} className={inputClass} />
            {errors.due_at && <p className={errorClass}>{errors.due_at.message}</p>}
          </div>
        </div>
      </section>

      {/* Section — Lignes */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2
            className="text-base font-medium tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Lignes de facturation
          </h2>
          <button
            type="button"
            onClick={() => append({ description: "", quantity: 1, unit_price: 0 })}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-alt transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Ajouter une ligne
          </button>
        </div>

        {errors.lines?.root && (
          <p className={errorClass}>{errors.lines.root.message}</p>
        )}

        <div className="rounded-sm border border-border overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_80px_120px_100px_36px] gap-2 bg-surface-alt px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-text-muted">
            <span>Description</span>
            <span>Qté</span>
            <span>Prix HT (€)</span>
            <span className="text-right">Total HT</span>
            <span />
          </div>

          <div className="divide-y divide-border-subtle">
            {fields.map((field, idx) => {
              const qty = Number(lines[idx]?.quantity) || 0;
              const price = Number(lines[idx]?.unit_price) || 0;
              const lineTotal = qty * price;

              return (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr_80px_120px_100px_36px] gap-2 items-start px-3 py-2 bg-surface"
                >
                  <div>
                    <input
                      type="text"
                      placeholder="Ex. Consultation juridique M&A"
                      {...register(`lines.${idx}.description`)}
                      className={inputClass}
                    />
                    {errors.lines?.[idx]?.description && (
                      <p className={errorClass}>{errors.lines[idx]?.description?.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      {...register(`lines.${idx}.quantity`, { valueAsNumber: true })}
                      className={inputClass}
                    />
                    {errors.lines?.[idx]?.quantity && (
                      <p className={errorClass}>{errors.lines[idx]?.quantity?.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register(`lines.${idx}.unit_price`, { valueAsNumber: true })}
                      className={inputClass}
                    />
                    {errors.lines?.[idx]?.unit_price && (
                      <p className={errorClass}>{errors.lines[idx]?.unit_price?.message}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-end pt-2">
                    <span className="text-sm font-medium text-foreground">
                      {fmtEur(lineTotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-center pt-1.5">
                    <button
                      type="button"
                      onClick={() => fields.length > 1 && remove(idx)}
                      disabled={fields.length <= 1}
                      className="flex h-7 w-7 items-center justify-center rounded-sm border border-border text-text-muted transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Récap totaux */}
        <div className="ml-auto w-full max-w-xs space-y-1.5 rounded-sm border border-border bg-surface-alt p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Total HT</span>
            <span className="font-medium">{fmtEur(totalHT)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">TVA 21%</span>
            <span>{fmtEur(tva)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2 text-sm">
            <span className="font-medium text-foreground">Total TTC</span>
            <span
              className="text-lg font-medium"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {fmtEur(totalTTC)}
            </span>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit((v) => onSubmit(v, false))}
          className="inline-flex items-center gap-2 rounded-sm border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-alt disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Créer en brouillon
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit((v) => onSubmit(v, true))}
          className="inline-flex items-center gap-2 rounded-sm px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Créer et envoyer
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="rounded-sm border border-border px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-alt disabled:opacity-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
