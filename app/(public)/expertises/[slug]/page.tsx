import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ExpertiseSlugPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/expertises#${slug}`);
}
