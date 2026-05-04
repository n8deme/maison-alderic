import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export const metadata: Metadata = {
  title: "Tableau de bord | Portail client",
};

export default function PortailDashboardPage() {
  return <PagePlaceholder title="Tableau de bord" path="/portail" section="portail" />;
}
