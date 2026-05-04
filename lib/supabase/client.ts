import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase pour Client Components (browser).
 * Utilise les cookies du navigateur — la session est synchronisée avec
 * le middleware qui rafraîchit les tokens.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
