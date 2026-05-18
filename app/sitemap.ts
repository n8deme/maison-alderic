import type { MetadataRoute } from "next";
import { createStaticClient } from "@/lib/supabase/static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lawyeros.vercel.app";

  const [avocatsRes, insightsRes] = await Promise.all([
    supabase.from("avocats").select("slug, updated_at"),
    supabase
      .from("insights")
      .select("slug, updated_at")
      .eq("is_published", true),
  ]);

  const avocats = (avocatsRes.data ?? []).map((a) => ({
    url: `${base}/associes/${a.slug}`,
    lastModified: a.updated_at ?? new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const insights = (insightsRes.data ?? []).map((i) => ({
    url: `${base}/insights/${i.slug}`,
    lastModified: i.updated_at ?? new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/expertises`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/associes`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/deals`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/insights`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/confidentialite`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    // LawyerOS (produit SaaS)
    { url: `${base}/lawyeros`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/lawyeros/docs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/signup`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
    { url: `${base}/cgv`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  return [...staticPages, ...avocats, ...insights];
}
