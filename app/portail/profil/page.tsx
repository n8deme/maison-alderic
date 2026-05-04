import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export const metadata: Metadata = {
  title: "Mon profil | Portail client",
};

export default function ProfilPage() {
  return <PagePlaceholder title="Mon profil" path="/portail/profil" section="portail" />;
}
