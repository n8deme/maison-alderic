import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export const metadata: Metadata = {
  title: "Contact",
  description: "Prenez contact avec Maison Aldéric & Associés — Avenue Louise 480, 1050 Bruxelles.",
};

export default function ContactPage() {
  return <PagePlaceholder title="Contact" path="/contact" section="public" />;
}
