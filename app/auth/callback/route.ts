import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  console.log("🔐 [auth/callback] Called with code:", code?.slice(0, 20) + "...");

  if (code) {
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            // Route Handler context — on DOIT pouvoir écrire
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

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
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      console.log("📋 [auth/callback] Profile role:", profile?.role);

      const targetPath = profile?.role === "avocat" ? "/portail-avocat" : "/portail";
      console.log("➡️ [auth/callback] Redirecting to:", targetPath);

      return NextResponse.redirect(`${origin}${targetPath}`);
    }
  } else {
    console.error("❌ [auth/callback] No code in URL");
  }

  return NextResponse.redirect(`${origin}/connexion?error=callback_failed`);
}
