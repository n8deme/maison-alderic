import { PagePlaceholder } from "@/components/ui/page-placeholder";

interface DossierDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DossierDetailPage({ params }: DossierDetailPageProps) {
  const { id } = await params;
  return (
    <PagePlaceholder
      title={`Dossier ${id}`}
      path={`/portail/dossiers/${id}`}
      section="portail"
    />
  );
}
