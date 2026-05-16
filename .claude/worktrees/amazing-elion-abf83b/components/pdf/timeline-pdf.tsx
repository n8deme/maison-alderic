import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

// ─── Palette Maison Aldéric ───────────────────────────────────────────────────
const C = {
  bordeaux:  "#7A1F2B",
  primary:   "#1A1A1A",
  secondary: "#6B6460",
  muted:     "#9C9490",
  border:    "#E5E2DB",
  surface:   "#F8F7F4",
  white:     "#FFFFFF",
  green:     "#16a34a",
  amber:     "#B45309",
  red:       "#DC2626",
  slate:     "#94A3B8",
};

const s = StyleSheet.create({
  page: {
    backgroundColor: C.white,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: C.primary,
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 50,
  },

  // ── Header ──
  header: {
    marginBottom: 24,
    paddingBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: C.bordeaux,
  },
  firmName: {
    fontFamily: "Times-Roman",
    fontSize: 18,
    color: C.primary,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 8,
    color: C.muted,
    marginTop: 3,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerRef: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: C.bordeaux,
    marginTop: 6,
  },

  // ── Bloc dossier ──
  dossierBlock: {
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
  },
  dossierTitle: {
    fontFamily: "Times-Roman",
    fontSize: 14,
    color: C.primary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  dossierMeta: {
    fontSize: 9,
    color: C.secondary,
  },

  // ── Section label ──
  sectionLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    color: C.muted,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 14,
  },

  // ── Infos grid ──
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 4,
  },
  infoCell: {
    width: "48%",
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 7,
    color: C.muted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 9,
    color: C.primary,
  },

  // ── Progress bar ──
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: C.surface,
    borderRadius: 2,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: C.bordeaux,
    borderRadius: 2,
  },
  progressPct: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: C.bordeaux,
  },

  // ── Timeline steps ──
  timelineSection: {
    marginTop: 6,
  },
  stepRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  stepIndicatorCol: {
    width: 20,
    alignItems: "center",
    paddingTop: 1,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepLine: {
    width: 1,
    flex: 1,
    marginTop: 2,
    backgroundColor: C.border,
  },
  stepContent: {
    flex: 1,
    paddingLeft: 8,
  },
  stepTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: C.primary,
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 8,
    color: C.secondary,
    marginBottom: 3,
    lineHeight: 1.4,
  },
  stepBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 2,
    marginBottom: 2,
  },
  stepBadgeText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
  },
  stepDate: {
    fontSize: 7.5,
    color: C.muted,
  },

  // ── Footer ──
  footer: {
    position: "absolute",
    bottom: 28,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: C.border,
  },
  footerText: {
    fontSize: 7,
    color: C.muted,
  },
  footerBrand: {
    fontSize: 7,
    color: C.bordeaux,
    fontFamily: "Helvetica-Bold",
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type TimelineStep = {
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  completed_at: string | null;
  display_order: number;
};

export type TimelinePDFProps = {
  reference: string;
  title: string;
  description: string | null;
  status: string;
  type: string | null;
  openedAt: string;
  closedAt: string | null;
  budgetEstimated: number | null;
  budgetConsumed: number | null;
  progressPct: number | null;
  clientName: string | null;
  clientCompany: string | null;
  leadAvocatName: string | null;
  leadAvocatTitle: string | null;
  steps: TimelineStep[];
  generatedAt: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

function fmtEur(n: number | null): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

const STATUS_LABELS: Record<string, string> = {
  active: "Actif", pending: "En attente", archived: "Archivé", won: "Clôturé", lost: "Perdu",
};

const STEP_CONFIG: Record<string, { label: string; dotColor: string; bgColor: string; textColor: string }> = {
  completed:   { label: "Terminé",   dotColor: C.green,   bgColor: "#F0FDF4", textColor: C.green   },
  in_progress: { label: "En cours",  dotColor: C.amber,   bgColor: "#FFFBEB", textColor: C.amber   },
  pending:     { label: "À venir",   dotColor: C.slate,   bgColor: "#F8FAFC", textColor: C.slate   },
  blocked:     { label: "Bloqué",    dotColor: C.red,     bgColor: "#FEF2F2", textColor: C.red     },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function TimelinePDF({
  reference, title, description, status, type,
  openedAt, closedAt, budgetEstimated, budgetConsumed, progressPct,
  clientName, clientCompany, leadAvocatName, leadAvocatTitle,
  steps, generatedAt,
}: TimelinePDFProps) {
  return (
    <Document
      title={`Récapitulatif ${reference}`}
      author="Maison Aldéric & Associés"
      subject="Timeline dossier"
      creator="Maison Aldéric & Associés"
    >
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.firmName}>Maison Aldéric & Associés</Text>
          <Text style={s.headerSub}>Récapitulatif de dossier</Text>
          <Text style={s.headerRef}>{reference}</Text>
        </View>

        {/* ── Titre dossier ── */}
        <View style={s.dossierBlock}>
          <Text style={s.dossierTitle}>{title}</Text>
          {(clientName || clientCompany) && (
            <Text style={s.dossierMeta}>
              {[clientName, clientCompany].filter(Boolean).join(" · ")}
            </Text>
          )}
          <Text style={[s.dossierMeta, { marginTop: 2 }]}>
            Statut : {STATUS_LABELS[status] ?? status}
          </Text>
        </View>

        {/* ── Informations ── */}
        <Text style={s.sectionLabel}>Informations</Text>
        <View style={s.infoGrid}>
          {leadAvocatName && (
            <View style={s.infoCell}>
              <Text style={s.infoLabel}>Avocat référent</Text>
              <Text style={s.infoValue}>{leadAvocatName}</Text>
              {leadAvocatTitle && (
                <Text style={[s.infoValue, { color: C.muted, fontSize: 8 }]}>{leadAvocatTitle}</Text>
              )}
            </View>
          )}
          <View style={s.infoCell}>
            <Text style={s.infoLabel}>Date d&apos;ouverture</Text>
            <Text style={s.infoValue}>{fmtDate(openedAt)}</Text>
          </View>
          {type && (
            <View style={s.infoCell}>
              <Text style={s.infoLabel}>Type de dossier</Text>
              <Text style={s.infoValue}>{type}</Text>
            </View>
          )}
          {closedAt && (
            <View style={s.infoCell}>
              <Text style={s.infoLabel}>Date de clôture</Text>
              <Text style={s.infoValue}>{fmtDate(closedAt)}</Text>
            </View>
          )}
          {(budgetEstimated != null || budgetConsumed != null) && (
            <View style={s.infoCell}>
              <Text style={s.infoLabel}>Budget</Text>
              <Text style={s.infoValue}>
                {fmtEur(budgetConsumed)} / {fmtEur(budgetEstimated)} estimé
              </Text>
            </View>
          )}
        </View>

        {progressPct != null && (
          <View>
            <Text style={s.infoLabel}>Avancement</Text>
            <View style={s.progressRow}>
              <View style={s.progressBarBg}>
                <View style={[s.progressBarFill, { width: `${progressPct}%` }]} />
              </View>
              <Text style={s.progressPct}>{progressPct}%</Text>
            </View>
          </View>
        )}

        {description && (
          <>
            <Text style={[s.sectionLabel, { marginTop: 12 }]}>Description</Text>
            <Text style={{ fontSize: 8.5, color: C.secondary, lineHeight: 1.5 }}>{description}</Text>
          </>
        )}

        {/* ── Timeline ── */}
        <Text style={s.sectionLabel}>Timeline — {steps.length} étape{steps.length > 1 ? "s" : ""}</Text>
        <View style={s.timelineSection}>
          {steps.map((step, idx) => {
            const cfg = STEP_CONFIG[step.status] ?? STEP_CONFIG.pending;
            const isLast = idx === steps.length - 1;
            return (
              <View key={step.title + idx} style={s.stepRow}>
                {/* Dot + line */}
                <View style={s.stepIndicatorCol}>
                  <View style={[s.stepDot, { backgroundColor: cfg.dotColor }]} />
                  {!isLast && <View style={s.stepLine} />}
                </View>

                {/* Content */}
                <View style={s.stepContent}>
                  <Text style={s.stepTitle}>{step.title}</Text>
                  {step.description && (
                    <Text style={s.stepDescription}>{step.description}</Text>
                  )}
                  <View style={[s.stepBadge, { backgroundColor: cfg.bgColor }]}>
                    <Text style={[s.stepBadgeText, { color: cfg.textColor }]}>{cfg.label}</Text>
                  </View>
                  {step.completed_at && (
                    <Text style={s.stepDate}>Terminé le {fmtDate(step.completed_at)}</Text>
                  )}
                  {!step.completed_at && step.due_date && (
                    <Text style={s.stepDate}>Échéance : {fmtDate(step.due_date)}</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Footer ── */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Document généré le {generatedAt}</Text>
          <Text style={s.footerBrand}>Maison Aldéric & Associés — Confidentiel</Text>
        </View>
      </Page>
    </Document>
  );
}
