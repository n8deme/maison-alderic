import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "LawyerOS — Le portail client pour avocats",
    template: "%s | LawyerOS",
  },
  description:
    "LawyerOS digitalise votre cabinet en 10 minutes : portail client white-label, gestion de dossiers, facturation Stripe et messagerie sécurisée. Essai gratuit 14 jours.",
  keywords: [
    "logiciel avocat",
    "portail client avocat",
    "gestion cabinet avocats",
    "facturation avocat",
    "LawyerOS",
    "SaaS droit",
  ],
  authors: [{ name: "LawyerOS" }],
  creator: "LawyerOS",
  publisher: "LawyerOS",
  metadataBase: new URL("https://lawyeros.app"),
  openGraph: {
    type: "website",
    locale: "fr_BE",
    url: "https://lawyeros.app",
    siteName: "LawyerOS",
    title: "LawyerOS — Le portail client pour avocats",
    description:
      "Digitalisez votre cabinet d'avocats : portail client, dossiers, facturation et messagerie sécurisée.",
    images: [
      {
        url: "/og-lawyeros.jpg",
        width: 1200,
        height: 630,
        alt: "LawyerOS — Le portail client pour avocats",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LawyerOS — Le portail client pour avocats",
    description: "Digitalisez votre cabinet en 10 minutes. Essai gratuit 14 jours.",
    images: ["/og-lawyeros.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SaasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
