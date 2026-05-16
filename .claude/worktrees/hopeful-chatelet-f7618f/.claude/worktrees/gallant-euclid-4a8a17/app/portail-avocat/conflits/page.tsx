import { getOrganization } from "@/lib/get-organization";
import type { Metadata } from "next";
import { ConflictChecker } from "./conflict-checker";

export const metadata: Metadata = { title: "Vérification conflits d'intérêts" };

export default async function ConflitsPage() {
  const org = await getOrganization();

  return (
    <div className="space-y-6 p-6 md:p-8 max-w-3xl">
      <div>
        <h1
          className="text-2xl font-medium text-slate-900"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          Conflits d&apos;intérêts
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Recherchez un nom, une société ou un mot-clé dans l&apos;ensemble des dossiers et clients.
        </p>
      </div>

      <ConflictChecker orgId={org.id} />
    </div>
  );
}
