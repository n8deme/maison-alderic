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
