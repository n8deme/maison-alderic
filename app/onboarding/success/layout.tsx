import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Cabinet configuré | LawyerOS" },
};

export default function OnboardingSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
