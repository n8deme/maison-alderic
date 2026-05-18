import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lawyeros.vercel.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/portail", "/connexion"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    // Built with care by kayo.agency
  };
}
