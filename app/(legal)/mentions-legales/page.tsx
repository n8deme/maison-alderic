import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function MentionsLegalesPage() {
  return <PagePlaceholder title="Mentions légales" path="/mentions-legales" section="legal" />;
}
