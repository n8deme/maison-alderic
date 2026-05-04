export const metadata = {
  title: {
    default: "Portail client | Maison Aldéric & Associés",
    template: "%s | Maison Aldéric",
  },
};

export default function PortailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
