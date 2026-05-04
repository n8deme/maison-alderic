import type { Metadata } from "next";
import { ContactForm } from "@/components/public/contact-form";

export const metadata: Metadata = {
  title: "Contact — Maison Aldéric & Associés",
  description:
    "Prenez contact avec Maison Aldéric & Associés — Avenue Louise 480, 1050 Bruxelles. Première consultation confidentielle.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: "var(--surface-alt)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <p
            className="text-xs font-medium tracking-widest uppercase mb-6"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
          >
            Contact
          </p>
          <h1
            className="max-w-2xl"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
            }}
          >
            Une question. Un dossier.<br />
            <span style={{ fontStyle: "italic" }}>Nous vous répondons.</span>
          </h1>
          <p
            className="mt-8 max-w-xl"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.0625rem",
              color: "var(--text-secondary)",
              lineHeight: 1.75,
            }}
          >
            Décrivez votre situation en quelques lignes. Un associé prendra
            contact avec vous dans les 24 heures ouvrées pour une première
            consultation confidentielle et sans engagement.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-24 md:py-32" style={{ backgroundColor: "var(--surface)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16 lg:gap-24">
            {/* Form */}
            <div>
              <p
                className="text-xs font-medium tracking-widest uppercase mb-10"
                style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
              >
                Formulaire de contact
              </p>
              <ContactForm />
            </div>

            {/* Info sidebar */}
            <aside className="space-y-10">
              <div>
                <p
                  className="text-xs font-medium tracking-widest uppercase mb-4"
                  style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
                >
                  Adresse
                </p>
                <address
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.75,
                    fontStyle: "normal",
                  }}
                >
                  Avenue Louise 480<br />
                  1050 Bruxelles<br />
                  Belgique
                </address>
              </div>

              <div>
                <p
                  className="text-xs font-medium tracking-widest uppercase mb-4"
                  style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
                >
                  Téléphone
                </p>
                <a
                  href="tel:+3222345600"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  +32 2 234 56 00
                </a>
              </div>

              <div>
                <p
                  className="text-xs font-medium tracking-widest uppercase mb-4"
                  style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
                >
                  E-mail
                </p>
                <a
                  href="mailto:contact@maison-alderic.be"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--bordeaux)",
                  }}
                >
                  contact@maison-alderic.be
                </a>
              </div>

              <div>
                <p
                  className="text-xs font-medium tracking-widest uppercase mb-4"
                  style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
                >
                  Heures d&apos;ouverture
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  Lundi – vendredi<br />
                  8h30 – 18h00
                </p>
              </div>

              <div
                className="p-6"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontStyle: "italic",
                    fontSize: "0.9375rem",
                    color: "var(--text-primary)",
                    lineHeight: 1.5,
                  }}
                >
                  Toutes nos consultations sont couvertes par le secret professionnel de l&apos;avocat.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
