import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Paiement confirmé" };

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string }>;
}

function fmtEur(value: number) {
  return new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR" }).format(value);
}

export default async function PaiementReussiPage({ params, searchParams }: PageProps) {
  const { id: invoiceId } = await params;
  const { session_id } = await searchParams;

  if (!session_id) redirect(`/portail/facturation/${invoiceId}`);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  // Vérifier la propriété avant tout
  const { data: invoice } = await supabase
    .from("invoices")
    .select("id, invoice_number, amount_ttc, status, paid_at, client_id")
    .eq("id", invoiceId)
    .single();

  if (!invoice) redirect("/portail/facturation");
  if (invoice.client_id !== user.id) redirect("/portail/facturation");

  // Fallback : si le webhook n'est pas encore arrivé, on vérifie côté Stripe
  // et on met à jour la DB nous-mêmes.
  if (invoice.status !== "paid") {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status === "paid") {
        const admin = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );
        const { error } = await admin
          .from("invoices")
          .update({ status: "paid", paid_at: new Date().toISOString() })
          .eq("id", invoiceId)
          .neq("status", "paid");
        if (error) {
          console.error("[paiement-reussi] DB update échoué:", error);
        }
      }
    } catch (err) {
      console.error("[paiement-reussi] Fallback échoué:", err);
    }
  }

  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center"
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full mb-6"
        style={{ backgroundColor: "#f0fdf4" }}
      >
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>

      <h1
        className="mb-3 text-3xl tracking-tight"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
      >
        Paiement confirmé
      </h1>

      <p className="mb-1 text-lg text-foreground" style={{ fontFamily: "var(--font-body)" }}>
        Votre paiement de la facture{" "}
        <span className="font-medium">{invoice.invoice_number}</span> a bien été reçu.
      </p>

      <p className="mb-2 text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
        {fmtEur(Number(invoice.amount_ttc))}
      </p>

      <p
        className="mb-10 text-sm text-text-muted"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Un reçu vous a été envoyé par email.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href={`/portail/facturation/${invoiceId}`}
          className="rounded-sm border border-border bg-surface px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-alt"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Voir la facture
        </Link>
        <Link
          href="/portail/facturation"
          className="rounded-sm px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--foreground)",
            color: "var(--background)",
            fontFamily: "var(--font-body)",
          }}
        >
          Mes factures
        </Link>
      </div>
    </div>
  );
}
