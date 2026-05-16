"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "@/app/(public)/contact/actions";

const demandTypes = [
  "m_a",
  "private_equity",
  "litigation",
  "tax",
  "corporate",
  "restructuring",
  "other",
] as const;

const demandTypeLabels: Record<typeof demandTypes[number], string> = {
  m_a:            "Opération M&A",
  private_equity: "Private Equity / Investissement",
  litigation:     "Contentieux",
  tax:            "Conseil fiscal",
  corporate:      "Corporate / Gouvernance",
  restructuring:  "Restructuration / Insolvabilité",
  other:          "Autre demande",
};

const initialState: ContactFormState = { status: "idle" };

const inputStyle = {
  fontFamily: "var(--font-body)",
  fontSize: "0.9375rem",
  color: "var(--text-primary)",
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 0,
  padding: "0.75rem 1rem",
  width: "100%",
  outline: "none",
};

const labelStyle = {
  fontFamily: "var(--font-body)",
  fontSize: "0.8125rem",
  color: "var(--text-muted)",
  display: "block",
  marginBottom: "0.375rem",
};

const errorStyle = {
  fontFamily: "var(--font-body)",
  fontSize: "0.8125rem",
  color: "var(--bordeaux)",
  marginTop: "0.375rem",
};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  if (state.status === "success") {
    return (
      <div
        className="py-16 text-center"
        style={{ border: "1px solid var(--border)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontStyle: "italic",
            fontSize: "1.25rem",
            color: "var(--text-primary)",
          }}
        >
          Message envoyé.
        </p>
        <p
          className="mt-3"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.9375rem",
            color: "var(--text-secondary)",
          }}
        >
          Nous vous répondrons dans les 24 heures ouvrées.
        </p>
      </div>
    );
  }

  const serverErrors = state.status === "error" ? state.errors : {};

  return (
    <form action={formAction} className="space-y-6">
      {/* Nature de la demande */}
      <div>
        <label style={labelStyle} htmlFor="demand_type">Nature de la demande *</label>
        <select
          id="demand_type"
          name="demand_type"
          defaultValue="other"
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          {demandTypes.map((val) => (
            <option key={val} value={val}>
              {demandTypeLabels[val]}
            </option>
          ))}
        </select>
        {serverErrors.demand_type && (
          <p style={errorStyle}>{serverErrors.demand_type[0]}</p>
        )}
      </div>

      {/* Nom + Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label style={labelStyle} htmlFor="name">Nom complet *</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            style={inputStyle}
          />
          {serverErrors.name && (
            <p style={errorStyle}>{serverErrors.name[0]}</p>
          )}
        </div>
        <div>
          <label style={labelStyle} htmlFor="email">Adresse e-mail *</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            style={inputStyle}
          />
          {serverErrors.email && (
            <p style={errorStyle}>{serverErrors.email[0]}</p>
          )}
        </div>
      </div>

      {/* Société + Téléphone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label style={labelStyle} htmlFor="company">Société</label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="phone">Téléphone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="subject">Objet de votre demande *</label>
        <input
          id="subject"
          name="subject"
          type="text"
          style={inputStyle}
        />
        {serverErrors.subject && (
          <p style={errorStyle}>{serverErrors.subject[0]}</p>
        )}
      </div>

      <div>
        <label style={labelStyle} htmlFor="message">Message *</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          style={{ ...inputStyle, resize: "vertical" }}
        />
        {serverErrors.message && (
          <p style={errorStyle}>{serverErrors.message[0]}</p>
        )}
      </div>

      {state.status === "server_error" && (
        <p style={{ ...errorStyle, fontSize: "0.9375rem" }}>{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-3 text-xs font-medium uppercase tracking-widest transition-colors hover:opacity-90 disabled:opacity-50"
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--background)",
          backgroundColor: "var(--text-primary)",
          border: "1px solid var(--text-primary)",
          cursor: isPending ? "wait" : "pointer",
        }}
      >
        {isPending ? "Envoi en cours…" : "Envoyer le message"}
      </button>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.8125rem",
          color: "var(--text-muted)",
        }}
      >
        Vos données sont traitées conformément à notre{" "}
        <a href="/confidentialite" style={{ color: "var(--bordeaux)" }}>
          politique de confidentialité
        </a>
        .
      </p>
    </form>
  );
}
