import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client Supabase pour Server Components / Server Actions / Route Handlers.
 * Lit/écrit les cookies via next/headers. Le `try/catch` protège des
 * Server Components purs qui n'ont pas le droit d'écrire — c'est ok,
 * le middleware rafraîchira la session au prochain navigation.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component context — ok, middleware s'en occupe.
          }
        },
      },
    },
  );
}
