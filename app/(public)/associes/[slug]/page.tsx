import { PagePlaceholder } from "@/components/ui/page-placeholder";

interface AssociePageProps {
  params: Promise<{ slug: string }>;
}

export default async function AssociePage({ params }: AssociePageProps) {
  const { slug } = await params;
  return (
    <PagePlaceholder
      title={`Associé — ${slug}`}
      path={`/associes/${slug}`}
      section="public"
    />
  );
}
