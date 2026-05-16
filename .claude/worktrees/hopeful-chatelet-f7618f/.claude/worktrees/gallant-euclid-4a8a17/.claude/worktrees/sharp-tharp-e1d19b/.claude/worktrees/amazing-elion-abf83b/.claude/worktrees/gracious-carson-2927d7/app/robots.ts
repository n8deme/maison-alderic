import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/portail", "/portail-avocat", "/connexion"],
      },
    ],
    sitemap: "https://maison-alderic.vercel.app/sitemap.xml",
    // Built with care by kayo.agency
  };
}
