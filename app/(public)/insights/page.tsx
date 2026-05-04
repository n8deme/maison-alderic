import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export const metadata: Metadata = {
  title: "Insights",
  description: "Analyses juridiques et perspectives stratégiques par les associés de Maison Aldéric.",
};

export default function InsightsPage() {
  return <PagePlaceholder title="Insights" path="/insights" section="public" />;
}
