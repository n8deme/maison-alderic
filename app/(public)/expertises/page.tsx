import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export const metadata: Metadata = {
  title: "Expertises",
  description: "Nos domaines d'expertise : M&A, Private Equity, Contentieux des affaires, Droit fiscal international.",
};

export default function ExpertisesPage() {
  return <PagePlaceholder title="Nos expertises" path="/expertises" section="public" />;
}
