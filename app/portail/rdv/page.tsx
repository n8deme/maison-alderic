import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export const metadata: Metadata = {
  title: "Rendez-vous | Portail client",
};

export default function RdvPage() {
  return <PagePlaceholder title="Rendez-vous" path="/portail/rdv" section="portail" />;
}
