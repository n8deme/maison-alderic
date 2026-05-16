import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const RESERVED_SUBDOMAINS = ["www", "app", "admin", "demo", "api", "mail", "cdn"];
const DEV_DEFAULT_TENANT = "maison-alderic";

function extractSubdomain(request: NextRequest): string | null {
  const hostname = request.headers.get("host") || "";

  // Dev local
  if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    const tenantParam = request.nextUrl.searchParams.get("__tenant");
    if (tenantParam) return tenantParam;
    const tenantHeader = request.headers.get("x-tenant");
    if (tenantHeader) return tenantHeader;
    const parts = hostname.split(".");
    if (parts.length >= 2 && parts[0] !== "localhost") return parts[0];
    return DEV_DEFAULT_TENANT;
  }

  // Production
  const parts = hostname.split(".");
  if (parts.length < 3) return null;
  const subdomain = parts[0];
  if (RESERVED_SUBDOMAINS.includes(subdomain)) return null;
  return subdomain;
}

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
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // -------------------------------------------------------
  // Multi-tenant : détecter le sous-domaine + injecter org
  // -------------------------------------------------------
  const subdomain = extractSubdomain(request);

  if (subdomain) {
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("id, name, slug, plan, is_active, trial_ends_at, primary_color, accent_color, logo_url, feature_esignature, feature_ai_summary, feature_intake_forms")
      .eq("subdomain", subdomain)
      .single();

    // Sous-domaine inconnu
    if (orgError || !org) {
      console.log("[middleware] org not found for subdomain:", subdomain, "error:", orgError);
return NextResponse.rewrite(new URL("/not-found", request.url));
    }

    // Organisation inactive
    if (!org.is_active && !pathname.startsWith("/suspended")) {
      return NextResponse.redirect(new URL("/suspended", request.url));
    }

    // Trial expiré
    if (
      org.plan === "trial" &&
      org.trial_ends_at &&
      new Date(org.trial_ends_at) < new Date() &&
      !pathname.startsWith("/upgrade") &&
      !pathname.startsWith("/connexion")
    ) {
      return NextResponse.redirect(new URL("/upgrade", request.url));
    }

    // Injecter les infos org dans les headers
    supabaseResponse.headers.set("x-org-id",     org.id);
    supabaseResponse.headers.set("x-org-slug",   org.slug);
    supabaseResponse.headers.set("x-org-name",   org.name);
    supabaseResponse.headers.set("x-org-plan",   org.plan);
    supabaseResponse.headers.set("x-org-color",  org.primary_color);
    supabaseResponse.headers.set("x-org-accent", org.accent_color);
    supabaseResponse.headers.set("x-org-logo",   org.logo_url || "");
    supabaseResponse.headers.set("x-org-feature-esignature",   String(org.feature_esignature));
    supabaseResponse.headers.set("x-org-feature-ai-summary",   String(org.feature_ai_summary));
    supabaseResponse.headers.set("x-org-feature-intake-forms", String(org.feature_intake_forms));

    // Vérifier membership si route protégée
    if (user && (pathname.startsWith("/portail") || pathname.startsWith("/portail-avocat"))) {
      const { data: membership } = await supabase
        .from("organization_members")
        .select("role")
        .eq("organization_id", org.id)
        .eq("user_id", user.id)
        .single();

      if (membership) {
        supabaseResponse.headers.set("x-user-role", membership.role);
      }
    }
  }

  // -------------------------------------------------------
  // Auth : protection des routes (logique originale)
  // -------------------------------------------------------
  if (!user && (pathname.startsWith("/portail") || pathname.startsWith("/portail-avocat"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    return NextResponse.redirect(url);
  }

  if (user && pathname.startsWith("/portail-avocat")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.role !== "avocat") {
      const url = request.nextUrl.clone();
      url.pathname = "/portail";
      return NextResponse.redirect(url);
    }
  }

  if (user && pathname === "/connexion") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    const url = request.nextUrl.clone();
    url.pathname = profile?.role === "avocat" ? "/portail-avocat" : "/portail";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}