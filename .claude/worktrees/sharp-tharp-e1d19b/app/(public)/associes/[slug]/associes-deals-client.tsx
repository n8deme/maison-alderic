"use client";
import dynamic from "next/dynamic";
import type { AssocieDealItem } from "./associes-deals-section";

const AssociesDealsSection = dynamic(
  () => import("./associes-deals-section").then((m) => m.AssociesDealsSection),
  { ssr: false, loading: () => null }
);

export function AssociesDealsSectionClient({ deals }: { deals: AssocieDealItem[] }) {
  return <AssociesDealsSection deals={deals} />;
}
