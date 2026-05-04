import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export const metadata: Metadata = {
  title: "Facturation | Portail client",
};

export default function FacturationPage() {
  return <PagePlaceholder title="Facturation" path="/portail/facturation" section="portail" />;
}
