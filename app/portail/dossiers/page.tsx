import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export const metadata: Metadata = {
  title: "Mes dossiers | Portail client",
};

export default function DossiersPage() {
  return <PagePlaceholder title="Mes dossiers" path="/portail/dossiers" section="portail" />;
}
