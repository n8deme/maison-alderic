import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Connexion | LawyerOS" },
  description: "Connectez-vous à votre espace LawyerOS pour accéder à vos dossiers.",
};

export default function ConnexionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
