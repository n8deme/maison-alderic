"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createDossier } from "./actions";

const dossierSchema = z.object({
  client_id: z.string().uuid("Client requis"),
  title: z.string().min(1, "Titre requis"),
  description: z.string().optional(),
  type: z.enum(["M&A", "Litigation", "Tax", "Corporate", "PE", "Restructuring"]),
  lead_avocat_id: z.string().uuid("Lead avocat requis"),
  team_avocat_ids: z.array(z.string().uuid()),
  budget_estimated: z.number().min(0).optional().nullable(),
  opened_at: z.string().min(1, "Date requise"),
});

type FormValues = z.infer<typeof dossierSchema>;

type Client = { id: string; full_name: string; company: string | null };
type Avocat = { id: string; full_name: string; title: string };

interface DossierFormProps {
  clients: Client[];
  avocats: Avocat[];
  defaultClientId?: string;
}

const DOSSIER_TYPES = ["M&A", "Litigation", "Tax", "Corporate", "PE", "Restructuring"] as const;

const inputClass =
  "w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-0 disabled:opacity-50";

const labelClass = "block text-xs font-medium text-text-secondary mb-1";

const errorClass = "mt-1 text-xs text-red-600";

export function DossierForm({ clients, avocats, defaultClientId }: DossierFormProps) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(dossierSchema),
    defaultValues: {
      client_id: defaultClientId ?? "",
      title: "",
      description: "",
      type: "M&A",
      lead_avocat_id: "",
      team_avocat_ids: [],
      budget_estimated: undefined,
      opened_at: today,
    },
  });

  const leadAvocatId = watch("lead_avocat_id");

  async function onSubmit(values: FormValues) {
    const result = await createDossier(values);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(`Dossier ${result.reference} créé`);
    router.push(`/portail-avocat/dossiers/${result.reference}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Section — Partie prenante */}
      <section className="space-y-4">
        <h2
          className="text-base font-medium tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Partie prenante
        </h2>

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
      </section>

      {/* Section — Informations du dossier */}
      <section className="space-y-4">
        <h2
          className="text-base font-medium tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Informations du dossier
        </h2>

        <div>
          <label htmlFor="title" className={labelClass}>
            Titre <span className="text-accent">*</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="Ex. Acquisition société Bertrand & Fils"
            {...register("title")}
            className={inputClass}
          />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="Contexte, enjeux principaux…"
            {...register("description")}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="type" className={labelClass}>
              Type <span className="text-accent">*</span>
            </label>
            <select id="type" {...register("type")} className={inputClass}>
              {DOSSIER_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.type && <p className={errorClass}>{errors.type.message}</p>}
          </div>

          <div>
            <label htmlFor="opened_at" className={labelClass}>
              Date d&apos;ouverture <span className="text-accent">*</span>
            </label>
            <input id="opened_at" type="date" {...register("opened_at")} className={inputClass} />
            {errors.opened_at && <p className={errorClass}>{errors.opened_at.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="budget_estimated" className={labelClass}>
            Budget estimé (€)
          </label>
          <input
            id="budget_estimated"
            type="number"
            min="0"
            step="100"
            placeholder="50000"
            {...register("budget_estimated", { valueAsNumber: true, setValueAs: (v) => (v === "" ? null : Number(v)) })}
            className={inputClass}
          />
        </div>
      </section>

      {/* Section — Équipe avocats */}
      <section className="space-y-4">
        <h2
          className="text-base font-medium tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Équipe
        </h2>

        <div>
          <label htmlFor="lead_avocat_id" className={labelClass}>
            Avocat principal <span className="text-accent">*</span>
          </label>
          <select id="lead_avocat_id" {...register("lead_avocat_id")} className={inputClass}>
            <option value="">— Sélectionner un avocat —</option>
            {avocats.map((a) => (
              <option key={a.id} value={a.id}>
                {a.full_name} — {a.title}
              </option>
            ))}
          </select>
          {errors.lead_avocat_id && (
            <p className={errorClass}>{errors.lead_avocat_id.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Équipe (support)</label>
          <div className="rounded-sm border border-border bg-surface p-3 space-y-2 max-h-44 overflow-y-auto">
            <Controller
              name="team_avocat_ids"
              control={control}
              render={({ field }) => (
                <>
                  {avocats.map((a) => {
                    const isLead = a.id === leadAvocatId;
                    const checked = field.value.includes(a.id);
                    return (
                      <label
                        key={a.id}
                        className={`flex items-center gap-2.5 cursor-pointer select-none ${
                          isLead ? "opacity-40 cursor-not-allowed" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          disabled={isLead}
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...field.value, a.id]);
                            } else {
                              field.onChange(field.value.filter((id) => id !== a.id));
                            }
                          }}
                          className="h-3.5 w-3.5 rounded-sm border-border accent-accent"
                        />
                        <span className="text-sm text-foreground">
                          {a.full_name}
                          <span className="ml-1.5 text-xs text-text-muted">{a.title}</span>
                        </span>
                        {isLead && (
                          <span className="ml-auto text-[10px] text-text-muted">Lead</span>
                        )}
                      </label>
                    );
                  })}
                </>
              )}
            />
          </div>
          <p className="mt-1 text-xs text-text-muted">
            L&apos;avocat principal est automatiquement exclu de la liste support.
          </p>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-border pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-sm px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Créer le dossier
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
