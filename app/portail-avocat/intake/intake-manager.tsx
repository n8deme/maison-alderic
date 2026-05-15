"use client";

import { useState, useTransition } from "react";
import { createIntakeForm, toggleIntakeForm, type IntakeField, type FieldType } from "./intake-actions";
import { Plus, Trash2, ExternalLink, Copy, Check, ToggleLeft, ToggleRight, ClipboardList } from "lucide-react";

type FormItem = {
  id: string;
  title: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  field_count: number;
  response_count: number;
};

type Props = {
  orgId: string;
  initialForms: FormItem[];
};

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text",    label: "Texte libre" },
  { value: "boolean", label: "Oui / Non" },
  { value: "date",    label: "Date" },
];

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function publicUrl(formId: string) {
  const base = typeof window !== "undefined" ? window.location.origin : "https://lawyeros.vercel.app";
  return `${base}/intake/${formId}`;
}

export function IntakeManager({ orgId, initialForms }: Props) {
  const [forms, setForms] = useState<FormItem[]>(initialForms);
  const [modalOpen, setModalOpen] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Form builder state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<IntakeField[]>([
    { id: genId(), type: "text", label: "", required: true },
  ]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function addField() {
    setFields((prev) => [...prev, { id: genId(), type: "text", label: "", required: false }]);
  }

  function removeField(id: string) {
    setFields((prev) => prev.filter((f) => f.id !== id));
  }

  function updateField(id: string, patch: Partial<IntakeField>) {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!title.trim()) { setFormError("Titre requis"); return; }
    if (fields.some((f) => !f.label.trim())) { setFormError("Tous les champs doivent avoir un label"); return; }

    startTransition(async () => {
      const result = await createIntakeForm(orgId, title.trim(), description.trim(), fields);
      if (result.error) { setFormError(result.error); return; }
      setCreatedId(result.formId ?? null);
      setForms((prev) => [
        {
          id: result.formId!,
          title: title.trim(),
          description: description.trim() || null,
          is_active: true,
          created_at: new Date().toISOString(),
          field_count: fields.length,
          response_count: 0,
        },
        ...prev,
      ]);
    });
  }

  function handleCopy() {
    if (!createdId) return;
    navigator.clipboard.writeText(publicUrl(createdId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setTitle("");
    setDescription("");
    setFields([{ id: genId(), type: "text", label: "", required: true }]);
    setFormError(null);
    setCreatedId(null);
    setCopied(false);
  }

  function handleToggle(formId: string, current: boolean) {
    startTransition(async () => {
      const result = await toggleIntakeForm(formId, !current);
      if (!result.error) {
        setForms((prev) =>
          prev.map((f) => (f.id === formId ? { ...f, is_active: !current } : f))
        );
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Bouton nouveau */}
      <div className="flex justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouveau formulaire
        </button>
      </div>

      {/* Liste des formulaires */}
      {forms.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white py-16 text-center">
          <ClipboardList className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm text-slate-400">Aucun formulaire créé. Commencez par en créer un.</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white overflow-hidden">
          {forms.map((form) => (
            <li key={form.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-slate-900">{form.title}</p>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium border ${
                      form.is_active
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    {form.is_active ? "Actif" : "Inactif"}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  {form.field_count} champ{form.field_count > 1 ? "s" : ""}
                  {" · "}
                  {form.response_count} réponse{form.response_count > 1 ? "s" : ""}
                  {" · "}
                  {new Date(form.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggle(form.id, form.is_active)}
                  title={form.is_active ? "Désactiver" : "Activer"}
                  className="rounded p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {form.is_active
                    ? <ToggleRight className="h-5 w-5 text-green-600" />
                    : <ToggleLeft className="h-5 w-5" />
                  }
                </button>
                <a
                  href={publicUrl(form.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Ouvrir le formulaire public"
                  className="rounded p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(publicUrl(form.id));
                  }}
                  title="Copier le lien"
                  className="rounded p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal création */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={createdId ? handleCloseModal : undefined}
          />
          <div className="relative z-10 w-full max-w-lg rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-medium text-slate-900">
                {createdId ? "Formulaire créé" : "Nouveau formulaire intake"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="rounded-sm p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Succès */}
            {createdId ? (
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3">
                  <p className="text-sm font-medium text-green-800">Formulaire créé avec succès !</p>
                </div>
                <div>
                  <p className="mb-2 text-xs text-slate-500">Lien public à partager :</p>
                  <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="flex-1 truncate font-mono text-xs text-slate-700">
                      {publicUrl(createdId)}
                    </p>
                    <button
                      onClick={handleCopy}
                      className="shrink-0 rounded p-1 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-full rounded-md bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  Fermer
                </button>
              </div>
            ) : (
              /* Formulaire de création */
              <form onSubmit={handleCreate} className="flex-1 overflow-y-auto flex flex-col">
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Titre du formulaire <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex : Questionnaire pré-consultation M&A"
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Description (optionnel)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                      placeholder="Instructions pour le client…"
                      className="w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700"
                    />
                  </div>

                  {/* Champs */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-slate-700">
                        Questions <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={addField}
                        className="inline-flex items-center gap-1 rounded text-xs text-amber-700 hover:text-amber-800 font-medium transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" /> Ajouter un champ
                      </button>
                    </div>
                    <ul className="space-y-3">
                      {fields.map((field, idx) => (
                        <li key={field.id} className="rounded-md border border-slate-200 bg-slate-50 p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium text-slate-400 w-5 text-center">{idx + 1}</span>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              placeholder="Question…"
                              className="flex-1 rounded border border-slate-200 bg-white px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700"
                            />
                            <button
                              type="button"
                              onClick={() => removeField(field.id)}
                              disabled={fields.length <= 1}
                              className="rounded p-1 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-4 pl-5">
                            <select
                              value={field.type}
                              onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                              className="rounded border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-700"
                            >
                              {FIELD_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                              ))}
                            </select>
                            <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                className="rounded border-slate-300"
                              />
                              Obligatoire
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {formError && (
                    <p className="text-sm text-red-600">{formError}</p>
                  )}
                </div>

                <div className="border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
                  >
                    {isPending ? "Création…" : "Créer le formulaire"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
