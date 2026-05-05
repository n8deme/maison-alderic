import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    "http://127.0.0.1:54321",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  console.log("🔐 MIDDLEWARE:", { 
    pathname, 
    hasUser: !!user, 
    userEmail: user?.email 
  });

  // 🚨 DEBUG — AJOUT D'UN LOG AVANT CHAQUE REDIRECT
  
  // Protection /portail/* sauf /portail/login
  if (!user && pathname.startsWith("/portail") && pathname !== "/portail/login") {
    console.log("❌ REDIRECT 1 — User not logged, redirecting to /portail/login");
    const url = request.nextUrl.clone();
    url.pathname = "/portail/login";
    return NextResponse.redirect(url);
  }

  // Si déjà loggué et sur /portail/login → redirect vers /portail
  if (user && pathname === "/portail/login") {
    console.log("✅ REDIRECT 2 — User logged, redirecting to /portail");
    const url = request.nextUrl.clone();
    url.pathname = "/portail";
    return NextResponse.redirect(url);
  }

  console.log("✅ NO REDIRECT — Returning normal response");
  return supabaseResponse;
}