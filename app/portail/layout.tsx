import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Portail client | Maison Aldéric & Associés",
    template: "%s | Maison Aldéric",
  },
};

export default async function PortailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}