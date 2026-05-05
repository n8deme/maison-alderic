"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Circle,
  CircleDot,
  Download,
  FileText,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export type TimelinePremiumStep = {
  id: string;
  title: string;
  description: string | null;
  status: "completed" | "in_progress" | "pending" | "blocked";
  dueDate: string | null;
  completedAt: string | null;
  actionRequired: boolean;
  notes: string | null;
  attachments: Array<{ name: string; href: string }>;
};

function dateLabel(iso: string | null) {
  if (!iso) return "Date à confirmer";
  return new Intl.DateTimeFormat("fr-BE", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

function StepIcon({ status }: { status: TimelinePremiumStep["status"] }) {
  if (status === "completed") return <CheckCircle2 className="h-5 w-5 text-bordeaux" />;
  if (status === "in_progress") return <CircleDot className="h-5 w-5 text-bordeaux" />;
  if (status === "blocked") return <AlertCircle className="h-5 w-5 text-orange-600" />;
  return <Circle className="h-5 w-5 text-text-muted" />;
}

export function TimelineDossierPremium({
  steps,
  summaryHref,
}: {
  steps: TimelinePremiumStep[];
  summaryHref: string;
}) {
  const reduce = useReducedMotion();
  const [openStepId, setOpenStepId] = useState<string | null>(steps[0]?.id ?? null);

  return (
    <section className="rounded-lg border border-border bg-surface p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl text-foreground">Timeline du dossier</h2>
        <Link href={summaryHref} className="inline-flex items-center gap-2 text-sm text-bordeaux">
          <Download className="h-4 w-4" />
          Télécharger le récapitulatif timeline
        </Link>
      </div>

      <div className="space-y-0">
        {steps.map((step, index) => {
          const isOpen = openStepId === step.id;
          const stepNumber = String(index + 1).padStart(2, "0");

          return (
            <motion.div
              key={step.id}
              className="relative pl-10"
              initial={reduce ? {} : { opacity: 0, x: 12 }}
              whileInView={reduce ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={reduce ? {} : { duration: 0.4, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-[11px] top-8 h-[calc(100%-1rem)] w-px ${
                    step.status === "completed" ? "bg-bordeaux" : "border-l border-dashed border-border"
                  }`}
                />
              )}

              <button
                type="button"
                onClick={() => setOpenStepId((prev) => (prev === step.id ? null : step.id))}
                className="group flex w-full items-start gap-4 rounded-sm p-3 text-left transition-colors hover:bg-surface-alt"
              >
                <div className="absolute left-0 top-4">
                  <StepIcon status={step.status} />
                </div>

                <span className="mt-0.5 text-sm font-medium text-bordeaux">{stepNumber}</span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-xl ${step.status === "in_progress" ? "font-medium" : ""} text-foreground`}>
                        {step.title}
                      </p>
                      {step.description && <p className="mt-1 text-sm text-text-secondary">{step.description}</p>}
                    </div>
                    <ChevronDown className={`mt-1 h-4 w-4 text-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                    {step.status === "completed" ? (
                      <span>Complété le {dateLabel(step.completedAt)}</span>
                    ) : (
                      <span>Échéance: {dateLabel(step.dueDate)}</span>
                    )}
                    {step.actionRequired && (
                      <span className="rounded-sm bg-orange-100 px-2 py-0.5 text-orange-700">Action requise</span>
                    )}
                  </div>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={reduce ? {} : { opacity: 0, height: 0 }}
                    animate={reduce ? {} : { opacity: 1, height: "auto" }}
                    exit={reduce ? {} : { opacity: 0, height: 0 }}
                    transition={reduce ? {} : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden pl-10 pr-3"
                  >
                    <div className="rounded-sm border border-border bg-surface-alt p-4">
                      {step.notes && <p className="mb-3 text-sm text-text-secondary">{step.notes}</p>}

                      {step.attachments.length > 0 && (
                        <ul className="mb-3 space-y-2">
                          {step.attachments.map((file) => (
                            <li key={file.name}>
                              <Link href={file.href} className="inline-flex items-center gap-2 text-sm text-bordeaux">
                                <FileText className="h-4 w-4" />
                                {file.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}

                      {step.actionRequired && (
                        <button
                          type="button"
                          className="inline-flex rounded-sm bg-bordeaux px-4 py-2 text-sm font-medium text-white"
                        >
                          Compléter cette étape
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
