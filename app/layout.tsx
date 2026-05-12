import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { LenisProvider } from "@/components/providers/lenis-provider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Maison Aldéric & Associés — Cabinet d'avocats d'affaires",
    template: "%s | Maison Aldéric & Associés",
  },
  description:
    "Conseil stratégique pour M&A, private equity, contentieux complexe et droit fiscal international. Le droit comme architecture stratégique.",
  keywords: [
    "cabinet avocats Bruxelles",
    "M&A Belgique",
    "private equity",
    "droit fiscal international",
    "contentieux affaires",
    "Maison Aldéric",
  ],
  authors: [{ name: "Maison Aldéric & Associés" }],
  creator: "Maison Aldéric & Associés",
  publisher: "Maison Aldéric & Associés",
  metadataBase: new URL("https://maison-alderic.be"),
  openGraph: {
    type: "website",
    locale: "fr_BE",
    url: "https://maison-alderic.be",
    siteName: "Maison Aldéric & Associés",
    title: "Maison Aldéric & Associés — Cabinet d'avocats d'affaires",
    description:
      "Conseil stratégique pour M&A, private equity, contentieux complexe et droit fiscal international.",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Maison Aldéric & Associés",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maison Aldéric & Associés",
    description: "Le droit comme architecture stratégique.",
    images: ["/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#F8F7F4",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr-BE"
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}