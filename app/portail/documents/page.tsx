import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export const metadata: Metadata = {
  title: "Documents | Portail client",
};

export default function DocumentsPage() {
  return <PagePlaceholder title="Documents" path="/portail/documents" section="portail" />;
}
