import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
};

export default function ConfidentialitePage() {
  return <PagePlaceholder title="Politique de confidentialité" path="/confidentialite" section="legal" />;
}
