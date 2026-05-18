"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

interface Disable2FADialogProps {
  factorId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function Disable2FADialog({
  factorId,
  open,
  onOpenChange,
  onSuccess,
}: Disable2FADialogProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => {
      document.getElementById("totp-disable-code")?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  const reset = () => {
    setCode("");
    setError(null);
    setLoading(false);
  };

  const handleClose = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleSubmit = async () => {
    if (code.length !== 6) {
      setError("Le code doit comporter 6 chiffres.");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { error: verifyErr } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code,
      });

      if (verifyErr) {
        const msg = verifyErr.message || "";
        if (/invalid|incorrect|expired/i.test(msg)) {
          setError(
            "Code invalide ou expiré. Vérifiez votre application d'authentification.",
          );
        } else {
          setError("Vérification impossible. Réessayez.");
        }
        return;
      }

      const { error: unenrollErr } = await supabase.auth.mfa.unenroll({
        factorId,
      });

      if (unenrollErr) {
        setError(
          "Impossible de désactiver la 2FA. " + unenrollErr.message,
        );
        return;
      }

      reset();
      onOpenChange(false);
      onSuccess();
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Désactiver la double authentification</DialogTitle>
          <DialogDescription>
            Pour confirmer, entrez le code à 6 chiffres affiché dans votre
            application d&apos;authentification (Google Authenticator, Authy,
            etc.).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          <Label htmlFor="totp-disable-code">Code à 6 chiffres</Label>
          <Input
            id="totp-disable-code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            autoComplete="one-time-code"
            disabled={loading}
            aria-invalid={error ? true : undefined}
            className="text-center font-mono text-lg tracking-widest"
            onKeyDown={(e) => {
              if (e.key === "Enter" && code.length === 6 && !loading) {
                void handleSubmit();
              }
            }}
          />
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => handleClose(false)}
            disabled={loading}
            className="rounded-md border border-[#E5E2DB] bg-transparent px-4 py-2 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-[#F8F7F4] disabled:opacity-50"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={loading || code.length !== 6}
            className="rounded-md bg-[#7A1F2B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5C1820] disabled:opacity-50"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {loading ? "Désactivation…" : "Désactiver la 2FA"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
