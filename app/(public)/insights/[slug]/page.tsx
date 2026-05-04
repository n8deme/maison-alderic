import { PagePlaceholder } from "@/components/ui/page-placeholder";

interface InsightPageProps {
  params: Promise<{ slug: string }>;
}

export default async function InsightPage({ params }: InsightPageProps) {
  const { slug } = await params;
  return (
    <PagePlaceholder
      title={`Insight — ${slug}`}
      path={`/insights/${slug}`}
      section="public"
    />
  );
}
