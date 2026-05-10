import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

const C = {
  bordeaux:  "#7A1F2B",
  primary:   "#1A1A1A",
  secondary: "#6B6460",
  muted:     "#9C9490",
  border:    "#E5E2DB",
  surface:   "#F8F7F4",
  white:     "#FFFFFF",
  green:     "#16a34a",
};

const CABINET = {
  name:    "Maison Aldéric & Associés",
  address: "Avenue Louise 480, 1050 Bruxelles, Belgique",
  vat:     "TVA : BE 0123.456.789",
  iban:    "IBAN : BE12 3456 7890 1234",
};

const s = StyleSheet.create({
  page: {
    backgroundColor: C.white,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: C.primary,
    paddingTop: 48,
    paddingBottom: 52,
    paddingHorizontal: 50,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
    paddingBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: C.bordeaux,
  },
  firmName: {
    fontFamily: "Times-Roman",
    fontSize: 16,
    color: C.primary,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  firmDetail: {
    fontSize: 8,
    color: C.muted,
    lineHeight: 1.5,
  },
  invoiceLabel: {
    fontFamily: "Times-Roman",
    fontSize: 22,
    color: C.bordeaux,
    textAlign: "right",
    letterSpacing: -0.5,
  },
  invoiceNumber: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: C.primary,
    textAlign: "right",
    marginTop: 4,
  },

  // ── Two-column bloc ──
  twoCol: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  col: {
    flex: 1,
    padding: 12,
    backgroundColor: C.surface,
    borderRadius: 2,
  },
  colTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    color: C.muted,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
  },
  colValue: {
    fontSize: 9,
    color: C.primary,
    marginBottom: 2,
  },
  colMuted: {
    fontSize: 8,
    color: C.secondary,
    marginBottom: 2,
  },

  // ── Table ──
  tableHeader: {
    flexDirection: "row",
    backgroundColor: C.surface,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
  },
  tableRowAlt: {
    backgroundColor: "#FAFAF9",
  },
  thDesc: {
    flex: 1,
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    color: C.muted,
    letterSpacing: 0.5,
  },
  thNum: {
    width: 50,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    color: C.muted,
    letterSpacing: 0.5,
  },
  tdDesc: {
    flex: 1,
    fontSize: 9,
    color: C.primary,
    lineHeight: 1.4,
  },
  tdNum: {
    width: 50,
    textAlign: "right",
    fontSize: 9,
    color: C.primary,
  },

  // ── Totaux ──
  totals: {
    alignSelf: "flex-end",
    width: 220,
    marginTop: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  totalLabel: {
    fontSize: 9,
    color: C.secondary,
  },
  totalValue: {
    fontSize: 9,
    color: C.primary,
    fontFamily: "Helvetica-Bold",
  },
  totalDivider: {
    borderTopWidth: 1,
    borderTopColor: C.border,
    marginVertical: 4,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    backgroundColor: C.bordeaux,
    paddingHorizontal: 8,
    borderRadius: 2,
    marginTop: 2,
  },
  grandTotalLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: C.white,
  },
  grandTotalValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: C.white,
  },

  // ── Mentions ──
  mentions: {
    marginTop: 24,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: C.border,
  },
  mentionText: {
    fontSize: 7.5,
    color: C.muted,
    lineHeight: 1.6,
  },

  // ── Footer ──
  footer: {
    position: "absolute",
    bottom: 24,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 6,
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

export type InvoiceLine = {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  display_order: number;
};

export type InvoicePDFProps = {
  invoiceNumber: string;
  status: string;
  issuedAt: string | null;
  dueAt: string | null;
  paidAt: string | null;
  amountHt: number;
  vatAmount: number;
  amountTtc: number;
  notes: string | null;
  clientName: string | null;
  clientCompany: string | null;
  clientEmail: string | null;
  dossierReference: string | null;
  dossierTitle: string | null;
  lines: InvoiceLine[];
  generatedAt: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

function fmtEur(n: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon", sent: "Envoyée", paid: "Payée", overdue: "En retard", cancelled: "Annulée",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function InvoicePDF({
  invoiceNumber, status, issuedAt, dueAt, paidAt,
  amountHt, vatAmount, amountTtc, notes,
  clientName, clientCompany, clientEmail,
  dossierReference, dossierTitle,
  lines, generatedAt,
}: InvoicePDFProps) {
  return (
    <Document
      title={`Facture ${invoiceNumber}`}
      author="Maison Aldéric & Associés"
      subject="Facture"
      creator="Maison Aldéric & Associés"
    >
      <Page size="A4" style={s.page}>

        {/* ── Header : cabinet + label facture ── */}
        <View style={s.header}>
          <View>
            <Text style={s.firmName}>{CABINET.name}</Text>
            <Text style={s.firmDetail}>{CABINET.address}</Text>
            <Text style={s.firmDetail}>{CABINET.vat}</Text>
          </View>
          <View>
            <Text style={s.invoiceLabel}>Facture</Text>
            <Text style={s.invoiceNumber}>{invoiceNumber}</Text>
            <Text style={[s.firmDetail, { textAlign: "right", marginTop: 4 }]}>
              {STATUS_LABELS[status] ?? status}
            </Text>
          </View>
        </View>

        {/* ── Bloc client + infos facture ── */}
        <View style={s.twoCol}>
          <View style={s.col}>
            <Text style={s.colTitle}>Facturé à</Text>
            {clientName    && <Text style={s.colValue}>{clientName}</Text>}
            {clientCompany && <Text style={s.colMuted}>{clientCompany}</Text>}
            {clientEmail   && <Text style={s.colMuted}>{clientEmail}</Text>}
            {!clientName && !clientCompany && (
              <Text style={s.colMuted}>Client non spécifié</Text>
            )}
          </View>

          <View style={s.col}>
            <Text style={s.colTitle}>Détails</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
              <Text style={s.colMuted}>Date d&apos;émission</Text>
              <Text style={s.colValue}>{fmtDate(issuedAt)}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
              <Text style={s.colMuted}>Échéance</Text>
              <Text style={s.colValue}>{fmtDate(dueAt)}</Text>
            </View>
            {paidAt && (
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
                <Text style={s.colMuted}>Payée le</Text>
                <Text style={[s.colValue, { color: C.green }]}>{fmtDate(paidAt)}</Text>
              </View>
            )}
            {dossierReference && (
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4, paddingTop: 4, borderTopWidth: 0.5, borderTopColor: C.border }}>
                <Text style={s.colMuted}>Dossier</Text>
                <Text style={s.colValue}>{dossierReference}</Text>
              </View>
            )}
            {dossierTitle && (
              <Text style={[s.colMuted, { textAlign: "right" }]}>{dossierTitle}</Text>
            )}
          </View>
        </View>

        {/* ── Tableau des lignes ── */}
        {lines.length > 0 ? (
          <View style={{ marginBottom: 4 }}>
            {/* En-tête tableau */}
            <View style={s.tableHeader}>
              <Text style={s.thDesc}>Description</Text>
              <Text style={s.thNum}>Qté</Text>
              <Text style={s.thNum}>P.U. HT</Text>
              <Text style={s.thNum}>Total HT</Text>
            </View>
            {/* Lignes */}
            {lines.map((line, idx) => (
              <View key={idx} style={[s.tableRow, idx % 2 === 1 ? s.tableRowAlt : {}]}>
                <Text style={s.tdDesc}>{line.description}</Text>
                <Text style={s.tdNum}>{line.quantity}</Text>
                <Text style={s.tdNum}>{fmtEur(line.unit_price)}</Text>
                <Text style={s.tdNum}>{fmtEur(line.total)}</Text>
              </View>
            ))}
          </View>
        ) : (
          /* Fallback si pas de lignes détaillées */
          <View style={{ marginBottom: 4 }}>
            <View style={s.tableHeader}>
              <Text style={s.thDesc}>Description</Text>
              <Text style={s.thNum}>Total HT</Text>
            </View>
            <View style={s.tableRow}>
              <Text style={s.tdDesc}>Honoraires — {dossierTitle ?? "Prestations juridiques"}</Text>
              <Text style={s.tdNum}>{fmtEur(amountHt)}</Text>
            </View>
          </View>
        )}

        {/* ── Totaux ── */}
        <View style={s.totals}>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Total HT</Text>
            <Text style={s.totalValue}>{fmtEur(amountHt)}</Text>
          </View>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>TVA (21 %)</Text>
            <Text style={s.totalValue}>{fmtEur(vatAmount)}</Text>
          </View>
          <View style={s.totalDivider} />
          <View style={s.grandTotalRow}>
            <Text style={s.grandTotalLabel}>Total TTC</Text>
            <Text style={s.grandTotalValue}>{fmtEur(amountTtc)}</Text>
          </View>
        </View>

        {/* ── Notes ── */}
        {notes && (
          <View style={{ marginTop: 16, padding: 10, backgroundColor: C.surface, borderRadius: 2 }}>
            <Text style={[s.colTitle, { marginBottom: 4 }]}>Notes</Text>
            <Text style={{ fontSize: 8.5, color: C.secondary, lineHeight: 1.5 }}>{notes}</Text>
          </View>
        )}

        {/* ── Mentions légales ── */}
        <View style={s.mentions}>
          <Text style={s.mentionText}>
            Conditions de paiement : 30 jours à compter de la date d&apos;émission.
            {"\n"}{CABINET.iban}. Communication structurée requise.
            {"\n"}Maison Aldéric & Associés SRL — Avocats inscrits au Barreau de Bruxelles.
          </Text>
        </View>

        {/* ── Footer ── */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Généré le {generatedAt}</Text>
          <Text style={s.footerBrand}>Maison Aldéric & Associés — Document confidentiel</Text>
        </View>

      </Page>
    </Document>
  );
}
