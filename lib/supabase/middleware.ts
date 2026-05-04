import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Helper pour le middleware Next.js — rafraîchit la session Supabase et
 * protège les routes /portail/* (sauf /portail/login).
 *
 * Doit être appelé depuis middleware.ts à la racine.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT : ne rien intercaler entre createServerClient et getUser —
  // sinon possible désynchronisation cookies / état d'auth.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protection /portail/* sauf /portail/login
  if (
    !user &&
    pathname.startsWith("/portail") &&
    pathname !== "/portail/login"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/portail/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Si déjà loggué et sur /portail/login → redirect vers /portail
  if (user && pathname === "/portail/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/portail";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
