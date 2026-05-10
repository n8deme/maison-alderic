type DossierForProgress = {
  budget_estimated?: number | string | null;
  budget_consumed?: number | string | null;
};

type TimelineStep = {
  status: string;
};

/**
 * Calcule l'avancement d'un dossier.
 * Priorité : % budget consommé. Fallback : % étapes terminées.
 * Retourne null si aucune donnée disponible.
 */
export function getDossierProgress(
  dossier: DossierForProgress,
  timeline: TimelineStep[],
): number | null {
  const estimated = Number(dossier.budget_estimated ?? 0);
  const consumed = Number(dossier.budget_consumed ?? 0);

  if (estimated > 0) {
    return Math.min(100, Math.round((consumed / estimated) * 100));
  }

  const total = timeline.length;
  if (total > 0) {
    const done = timeline.filter((s) => s.status === "completed").length;
    return Math.round((done / total) * 100);
  }

  return null;
}
