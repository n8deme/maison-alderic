import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export const metadata: Metadata = {
  title: "Nos associés",
  description: "L'équipe Maison Aldéric & Associés : associés fondateurs, counsels et senior associates.",
};

export default function AssociesPage() {
  return <PagePlaceholder title="Nos associés" path="/associes" section="public" />;
}
