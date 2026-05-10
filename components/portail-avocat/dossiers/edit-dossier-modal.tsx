"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateDossier } from "@/app/portail-avocat/dossiers/[reference]/edit-actions";

const dossierEditSchema = z.object({
  title: z.string().min(1, "Titre requis"),
  description: z.string().optional(),
  status: z.enum(["active", "pending", "archived", "won", "lost"]),
  type: z.enum(["M&A", "Litigation", "Tax", "Corporate", "PE", "Restructuring"]),
  lead_avocat_id: z.string().uuid("Lead avocat requis"),
  team_avocat_ids: z.array(z.string().uuid()),
  budget_estimated: z.number().min(0).optional().nullable(),
});

type FormValues = z.infer<typeof dossierEditSchema>;

type Avocat = { id: string; full_name: string; title: string };

interface EditDossierModalProps {
  dossierId: string;
  reference: string;
  defaultValues: FormValues;
  avocats: Avocat[];
  onClose: () => void;
}

const DOSSIER_TYPES = ["M&A", "Litigation", "Tax", "Corporate", "PE", "Restructuring"] as const;
const DOSSIER_STATUSES = [
  { value: "active", label: "Actif" },
  { value: "pending", label: "En attente" },
  { value: "archived", label: "Archivé" },
  { value: "won", label: "Clôturé (gagné)" },
  { value: "lost", label: "Perdu" },
] as const;

const inputClass =
  "w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-0 disabled:opacity-50";
const labelClass = "block text-xs font-medium text-text-secondary mb-1";
const errorClass = "mt-1 text-xs text-red-600";

export function EditDossierModal({
  dossierId,
  reference,
  defaultValues,
  avocats,
  onClose,
}: EditDossierModalProps) {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(dossierEditSchema),
    defaultValues,
  });

  const leadAvocatId = watch("lead_avocat_id");

  // Fermer avec Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Bloquer le scroll du body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  async function onSubmit(values: FormValues) {
    const result = await updateDossier(dossierId, reference, values);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Dossier mis à jour");
    onClose();
    router.refresh();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-sm border border-border bg-surface shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2
            className="text-xl tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Modifier le dossier
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-sm border border-border hover:bg-surface-alt transition-colors"
          >
            <X className="h-4 w-4 text-text-muted" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
          {/* Titre */}
          <div>
            <label htmlFor="edit-title" className={labelClass}>
              Titre <span className="text-accent">*</span>
            </label>
            <input
              id="edit-title"
              type="text"
              {...register("title")}
              className={inputClass}
            />
            {errors.title && <p className={errorClass}>{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="edit-description" className={labelClass}>
              Description
            </label>
            <textarea
              id="edit-description"
              rows={3}
              {...register("description")}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Status + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-status" className={labelClass}>
                Statut <span className="text-accent">*</span>
              </label>
              <select id="edit-status" {...register("status")} className={inputClass}>
                {DOSSIER_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              {errors.status && <p className={errorClass}>{errors.status.message}</p>}
            </div>
            <div>
              <label htmlFor="edit-type" className={labelClass}>
                Type <span className="text-accent">*</span>
              </label>
              <select id="edit-type" {...register("type")} className={inputClass}>
                {DOSSIER_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.type && <p className={errorClass}>{errors.type.message}</p>}
            </div>
          </div>

          {/* Lead avocat */}
          <div>
            <label htmlFor="edit-lead" className={labelClass}>
              Avocat principal <span className="text-accent">*</span>
            </label>
            <select id="edit-lead" {...register("lead_avocat_id")} className={inputClass}>
              <option value="">— Sélectionner —</option>
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

          {/* Team avocats */}
          <div>
            <label className={labelClass}>Équipe (support)</label>
            <div className="rounded-sm border border-border bg-surface p-3 space-y-2 max-h-36 overflow-y-auto">
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
          </div>

          {/* Budget */}
          <div>
            <label htmlFor="edit-budget" className={labelClass}>
              Budget estimé (€)
            </label>
            <input
              id="edit-budget"
              type="number"
              min="0"
              step="100"
              {...register("budget_estimated", {
                valueAsNumber: true,
                setValueAs: (v) => (v === "" ? null : Number(v)),
              })}
              className={inputClass}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 border-t border-border pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-sm px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Enregistrer
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-sm border border-border px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-alt disabled:opacity-50"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
