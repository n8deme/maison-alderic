-- ============================================================================
-- Stripe integration : customer mapping + checkout session tracking
-- ============================================================================

-- Customer Stripe lié au profile (1:1, lazy creation)
ALTER TABLE public.profiles
  ADD COLUMN stripe_customer_id text UNIQUE;

CREATE INDEX profiles_stripe_customer_id_idx
  ON public.profiles(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

COMMENT ON COLUMN public.profiles.stripe_customer_id IS
  'Customer Stripe créé lazy à la 1ère tentative de paiement. NULL = jamais payé en ligne.';

-- Session Checkout Stripe en cours (pour réutilisation < 24h)
ALTER TABLE public.invoices
  ADD COLUMN stripe_checkout_session_id text UNIQUE,
  ADD COLUMN stripe_checkout_expires_at timestamptz;

CREATE INDEX invoices_stripe_checkout_session_id_idx
  ON public.invoices(stripe_checkout_session_id)
  WHERE stripe_checkout_session_id IS NOT NULL;

COMMENT ON COLUMN public.invoices.stripe_checkout_session_id IS
  'Session Checkout Stripe active. Réutilisable si non expirée (< 24h).';
