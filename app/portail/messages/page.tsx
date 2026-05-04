import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export const metadata: Metadata = {
  title: "Messages | Portail client",
};

export default function MessagesPage() {
  return <PagePlaceholder title="Messages" path="/portail/messages" section="portail" />;
}
