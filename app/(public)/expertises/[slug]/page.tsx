import { PagePlaceholder } from "@/components/ui/page-placeholder";

interface ExpertisePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ExpertisePage({ params }: ExpertisePageProps) {
  const { slug } = await params;
  return (
    <PagePlaceholder
      title={`Expertise — ${slug}`}
      path={`/expertises/${slug}`}
      section="public"
    />
  );
}
