import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export const metadata: Metadata = {
  title: "Deals notables",
  description: "Sélection d'opérations récentes conseillées par Maison Aldéric & Associés.",
};

export default function DealsPage() {
  return <PagePlaceholder title="Deals notables" path="/deals" section="public" />;
}
