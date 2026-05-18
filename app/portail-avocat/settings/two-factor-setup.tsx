"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { AlertCircle, Shield, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Disable2FADialog } from "./disable-2fa-dialog";

// ─── Types ───────────────────────────────────────────────────────────────────

/** Shape du data retourné par supabase.auth.mfa.enroll() pour factorType:'totp' */
type EnrollData = {
  id:   string;
  type: "totp";
  totp: { qr_code: string; secret: string; uri: string };
};

type Phase =
  | { kind: "loading" }
  | { kind: "disabled" }
  | { kind: "enrolling"; factorId: string; secret: string; uri: string }
  | { kind: "enabled"; factorId: string };

type State = {
  phase: Phase;
  code: string;
  error: string | null;
  busy: boolean;
};

type Action =
  | { type: "SET_PHASE"; phase: Phase }
  | { type: "SET_CODE"; code: string }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_BUSY"; busy: boolean }
  | { type: "RESET_ERROR" };

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PHASE":  return { ...state, phase: action.phase, error: null, busy: false, code: "" };
    case "SET_CODE":   return { ...state, code: action.code };
    case "SET_ERROR":  return { ...state, error: action.error, busy: false };
    case "SET_BUSY":   return { ...state, busy: action.busy, error: null };
    case "RESET_ERROR":return { ...state, error: null };
    default:           return state;
  }
}

const INIT: State = { phase: { kind: "loading" }, code: "", error: null, busy: false };

// ─── Component ───────────────────────────────────────────────────────────────

export function TwoFactorSetup() {
  const [state, dispatch] = useReducer(reducer, INIT);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // ── Init : vérifier le statut MFA ──────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    async function checkStatus() {
      const { data, error } = await supabase.auth.mfa.listFactors();

      if (cancelled) return;

      if (error) {
        dispatch({ type: "SET_PHASE", phase: { kind: "disabled" } });
        dispatch({ type: "SET_ERROR", error: "Impossible de vérifier le statut 2FA." });
        return;
      }

      const verified = data.totp.find((f) => f.factor_type === "totp" && f.status === "verified");
      if (verified) {
        dispatch({ type: "SET_PHASE", phase: { kind: "enabled", factorId: verified.id } });
      } else {
        dispatch({ type: "SET_PHASE", phase: { kind: "disabled" } });
      }
    }

    checkStatus();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Actions ────────────────────────────────────────────────────────────

  async function handleEnroll() {
    dispatch({ type: "SET_BUSY", busy: true });

    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });

    if (error || !data) {
      dispatch({ type: "SET_ERROR", error: error?.message ?? "Échec de l'initialisation 2FA." });
      return;
    }

    const enroll = data as unknown as EnrollData;
    dispatch({
      type: "SET_PHASE",
      phase: {
        kind:     "enrolling",
        factorId: enroll.id,
        secret:   enroll.totp.secret,
        uri:      enroll.totp.uri,
      },
    });

    // Focus sur le champ code après rendu
    setTimeout(() => codeRef.current?.focus(), 100);
  }

  async function handleVerify() {
    if (state.phase.kind !== "enrolling") return;
    if (state.code.length !== 6) {
      dispatch({ type: "SET_ERROR", error: "Entrez un code à 6 chiffres." });
      return;
    }

    dispatch({ type: "SET_BUSY", busy: true });

    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: state.phase.factorId,
      code:     state.code,
    });

    if (error) {
      dispatch({ type: "SET_ERROR", error: "Code incorrect. Vérifiez votre application et réessayez." });
      codeRef.current?.select();
      return;
    }

    dispatch({ type: "SET_PHASE", phase: { kind: "enabled", factorId: state.phase.factorId } });
  }

  function handleUnenrollClick() {
    if (state.phase.kind !== "enabled") return;
    setShowDisableDialog(true);
  }

  function handleCancelEnroll() {
    dispatch({ type: "SET_PHASE", phase: { kind: "disabled" } });
  }

  // ── Render ─────────────────────────────────────────────────────────────

  const { phase, code, error, busy } = state;

  return (
    <section className="rounded-md border border-[#EFEDE6] bg-white p-6">
      {/* En-tête */}
      <div
        className="flex items-start justify-between gap-4"
        style={{ borderBottom: phase.kind === "enrolling" ? "1px solid #EFEDE6" : undefined, paddingBottom: phase.kind === "enrolling" ? "1.5rem" : undefined }}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {phase.kind === "enabled" ? (
              <ShieldCheck className="size-[18px] shrink-0 text-[#1A1A1A]" aria-hidden />
            ) : (
              <Shield className="size-[18px] shrink-0 text-[#1A1A1A]" aria-hidden />
            )}
            <h2
              className="text-base font-medium text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Authentification à deux facteurs
            </h2>
            {phase.kind === "enabled" && (
              <span
                className="inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium"
                style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#059669", fontFamily: "var(--font-body)" }}
              >
                <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Activée
              </span>
            )}
            {(phase.kind === "disabled" || phase.kind === "enrolling") && (
              <span
                className="inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium"
                style={{ backgroundColor: "var(--surface-alt)", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
              >
                Désactivée
              </span>
            )}
            {phase.kind === "loading" && (
              <span
                className="inline-flex items-center rounded-sm px-2 py-0.5 text-xs"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
              >
                Vérification…
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-[#5C5A55]" style={{ fontFamily: "var(--font-body)" }}>
            Protégez votre compte avec une application d&apos;authentification (Google Authenticator, Authy…).
          </p>
        </div>

        {/* CTA principal à droite de l'en-tête */}
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          {phase.kind === "disabled" && (
            <>
              <div
                className="mt-2 flex max-w-[260px] items-start gap-1.5 text-xs italic text-[#B45309] sm:mt-0 sm:text-right"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <AlertCircle className="size-3.5 shrink-0" aria-hidden />
                <span>Recommandé pour la sécurité de votre cabinet.</span>
              </div>
              <button
                type="button"
                onClick={handleEnroll}
                disabled={busy}
                className="rounded-md bg-[#1A1A1A] px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-50"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {busy ? "Initialisation…" : "Activer la 2FA"}
              </button>
            </>
          )}

          {phase.kind === "enabled" && (
            <>
              <button
                type="button"
                onClick={handleUnenrollClick}
                disabled={busy}
                className="rounded-md border border-[#E5E2DB] bg-transparent px-4 py-2 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-[#F8F7F4] disabled:opacity-50"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Désactiver
              </button>
              <Disable2FADialog
                factorId={phase.factorId}
                open={showDisableDialog}
                onOpenChange={setShowDisableDialog}
                onSuccess={() => {
                  dispatch({ type: "SET_PHASE", phase: { kind: "disabled" } });
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Panneau d'enrollment */}
      {phase.kind === "enrolling" && (
        <div className="mt-6 space-y-6 border-t border-[#EFEDE6] pt-6">

          {/* Instructions */}
          <p className="text-sm" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
            Scannez le QR code avec votre application d&apos;authentification, puis entrez le code à 6 chiffres pour valider.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* QR code */}
            <div
              className="shrink-0 rounded-sm border p-3"
              style={{ borderColor: "var(--border)", backgroundColor: "#ffffff" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(phase.uri)}&size=200x200&margin=0`}
                alt="QR code 2FA — scannez avec votre application d'authentification"
                width={200}
                height={200}
                style={{ display: "block", imageRendering: "pixelated" }}
              />
            </div>

            {/* Secret + champ code */}
            <div className="flex-1 space-y-4 min-w-0">
              {/* Secret manuel */}
              <div>
                <p
                  className="text-xs font-medium mb-1.5 uppercase tracking-wide"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                >
                  Code secret (saisie manuelle)
                </p>
                <div
                  className="rounded-sm border px-3 py-2 font-mono text-sm break-all select-all"
                  style={{
                    borderColor:     "var(--border)",
                    backgroundColor: "var(--surface-alt)",
                    color:           "var(--foreground)",
                    letterSpacing:   "0.08em",
                  }}
                >
                  {phase.secret}
                </div>
              </div>

              {/* Champ code */}
              <div>
                <label
                  htmlFor="totp-code"
                  className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                >
                  Code de vérification
                </label>
                <input
                  ref={codeRef}
                  id="totp-code"
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  autoComplete="one-time-code"
                  placeholder="123 456"
                  value={code}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                    dispatch({ type: "SET_CODE", code: v });
                    if (error) dispatch({ type: "RESET_ERROR" });
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter" && code.length === 6) handleVerify(); }}
                  className="w-full rounded-sm border px-3.5 py-2.5 font-mono text-lg tracking-widest outline-none transition-colors"
                  style={{
                    borderColor:     error ? "#ef4444" : "var(--border)",
                    backgroundColor: "var(--surface)",
                    color:           "var(--foreground)",
                    textAlign:       "center",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = error ? "#ef4444" : "var(--foreground)")}
                  onBlur={(e)  => (e.target.style.borderColor = error ? "#ef4444" : "var(--border)")}
                />
              </div>
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <p className="text-sm" style={{ color: "#dc2626", fontFamily: "var(--font-body)" }}>
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleCancelEnroll}
              disabled={busy}
              className="rounded-sm border px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleVerify}
              disabled={busy || code.length !== 6}
              className="rounded-sm px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--foreground)", color: "#ffffff", fontFamily: "var(--font-body)" }}
            >
              {busy ? "Vérification…" : "Vérifier et activer"}
            </button>
          </div>
        </div>
      )}

      {/* Message succès inline (état enabled) */}
      {phase.kind === "enabled" && (
        <div
          className="mt-6 border-t border-[#EFEDE6] px-0 py-4"
          style={{ backgroundColor: "rgba(16,185,129,0.04)" }}
        >
          <p className="text-sm" style={{ color: "#059669", fontFamily: "var(--font-body)" }}>
            La double authentification est activée. Votre compte est protégé.
          </p>
        </div>
      )}

      {/* Erreur globale (hors enrollment) */}
      {error && phase.kind !== "enrolling" && (
        <div className="mt-6 border-t border-[#fecaca] px-0 py-3" style={{ backgroundColor: "#fef2f2" }}>
          <p className="text-sm" style={{ color: "#dc2626", fontFamily: "var(--font-body)" }}>
            {error}
          </p>
        </div>
      )}
    </section>
  );
}
