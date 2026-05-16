import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DossierForm } from "./dossier-form";

export const metadata: Metadata = { title: "Nouveau dossier" };

export default async function NouveauDossierPage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string }>;
}) {
  const { client_id } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const [{ data: clients }, { data: avocats }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, company")
      .eq("role", "client")
      .order("full_name"),
    supabase
      .from("avocats")
      .select("id, full_name, title")
      .order("display_order"),
  ]);

  return (
    <div className="max-w-2xl p-6 md:p-8">
      <div className="mb-8">
        <Link
          href="/portail-avocat/dossiers"
          className="mb-4 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux dossiers
        </Link>
        <h1
          className="text-3xl tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Nouveau dossier
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Ouvrir un nouveau dossier et assigner l&apos;équipe avocats.
        </p>
      </div>

      <DossierForm
        clients={clients ?? []}
        avocats={avocats ?? []}
        defaultClientId={client_id}
      />
    </div>
  );
}
