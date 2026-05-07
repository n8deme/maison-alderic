import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Route handler appelée après clic sur un magic link.
 *
 * Supabase redirige ici avec ?code=xxx, on l'échange contre une session
 * côté serveur (cookies SSR posés correctement), puis on redirige vers
 * le portail correspondant au rôle du user.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  console.log("🔐 [auth/callback] Called with code:", code?.slice(0, 20) + "...");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("❌ [auth/callback] exchangeCodeForSession error:", {
        message: error.message,
        status: error.status,
        name: error.name,
      });
    } else {
      console.log("✅ [auth/callback] Session created for user:", data.user?.email);
    }

    if (!error && data.user) {
      // Si un "next" explicite est fourni, on l'utilise
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      // Sinon, on redirige selon le rôle
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("❌ [auth/callback] Profile fetch error:", profileError.message);
      }

      console.log("📋 [auth/callback] Profile role:", profile?.role);

      const targetPath =
        profile?.role === "avocat" ? "/portail-avocat" : "/portail";

      console.log("➡️ [auth/callback] Redirecting to:", targetPath);

      return NextResponse.redirect(`${origin}${targetPath}`);
    }
  } else {
    console.error("❌ [auth/callback] No code in URL");
  }

  // Échec : retour login avec flag d'erreur
  return NextResponse.redirect(`${origin}/connexion?error=callback_failed`);
}