export type InvoiceStatusKey = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export function computeDisplayStatus(invoice: {
  status: string;
  due_at?: string | null;
}): InvoiceStatusKey {
  if (invoice.status === "sent" && invoice.due_at) {
    if (new Date(invoice.due_at) < new Date()) return "overdue";
  }
  return invoice.status as InvoiceStatusKey;
}

export const invoiceStatusLabel: Record<InvoiceStatusKey, string> = {
  draft:     "Brouillon",
  sent:      "Envoyée",
  paid:      "Payée",
  overdue:   "En retard",
  cancelled: "Annulée",
};

export const invoiceStatusBadgeClass: Record<InvoiceStatusKey, string> = {
  draft:     "bg-gray-100 text-gray-700",
  sent:      "bg-blue-50 text-blue-700",
  paid:      "bg-green-50 text-green-700",
  overdue:   "bg-red-50 text-red-700",
  cancelled: "bg-gray-100 text-gray-500",
};
