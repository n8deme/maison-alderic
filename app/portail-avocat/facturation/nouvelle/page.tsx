import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { InvoiceForm } from "./invoice-form";

export const metadata: Metadata = { title: "Nouvelle facture" };

export default async function NouvelleFacturePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "avocat") redirect("/portail-avocat");

  const { data: clients } = await supabase
    .from("profiles")
    .select("id, full_name, company")
    .eq("role", "client")
    .order("full_name");

  return (
    <div className="max-w-3xl p-6 md:p-8">
      <div className="mb-8">
        <Link
          href="/portail-avocat/facturation"
          className="mb-4 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la facturation
        </Link>
        <h1
          className="text-3xl tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Nouvelle facture
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Créer une facture et l&apos;associer à un client et un dossier.
        </p>
      </div>

      <InvoiceForm clients={clients ?? []} />
    </div>
  );
}
