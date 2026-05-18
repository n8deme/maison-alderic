import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/associes", destination: "/demo/associes", permanent: true },
      { source: "/associes/:slug", destination: "/demo/associes/:slug", permanent: true },
      { source: "/expertises", destination: "/demo/expertises", permanent: true },
      { source: "/expertises/:slug", destination: "/demo/expertises/:slug", permanent: true },
      { source: "/deals", destination: "/demo/deals", permanent: true },
      { source: "/insights", destination: "/demo/insights", permanent: true },
      { source: "/insights/:slug", destination: "/demo/insights/:slug", permanent: true },
      { source: "/contact", destination: "/demo/contact", permanent: true },
      { source: "/carrieres", destination: "/demo/carrieres", permanent: true },
      { source: "/lawyeros", destination: "/", permanent: true },
      { source: "/lawyeros/docs", destination: "/docs", permanent: true },
      { source: "/lawyeros/docs/:slug*", destination: "/docs/:slug*", permanent: true },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // Suppress build output noise
  silent: !process.env.CI,

  // Disable logger to keep build output clean
  disableLogger: true,

  // Source maps: enable only when SENTRY_AUTH_TOKEN is set
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },

  // Tunnel Sentry requests through /monitoring to bypass ad-blockers
  tunnelRoute: "/monitoring",

  
});
