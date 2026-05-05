import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Route handler appelée après clic sur un magic link.
 *
 * Supabase redirige ici avec ?code=xxx, on l'échange contre une session,
 * puis on redirige vers ?next=/... (ou /portail par défaut).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/portail";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Échec : retour login avec flag d'erreur
  return NextResponse.redirect(
    `${origin}/connexion?error=callback_failed`,
  );
}
