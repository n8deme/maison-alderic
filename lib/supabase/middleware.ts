import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { DEMO_CREDENTIALS, DEMO_EMAILS_WHITELIST, DEMO_TENANT_SLUG } from "@/lib/demo/credentials";

const PUBLIC_SAAS_ROUTES = [
  "/signup",
  "/onboarding",
  "/pricing",
  "/lawyeros",
  "/docs",
  "/demo",
  "/admin",
  "/connexion",
  "/mentions-legales",
  "/confidentialite",
  "/cgv",
  "/api/health",
  "/api/demo",
  "/api/webhooks/stripe",
];

const RESERVED_SUBDOMAINS = ["www", "app", "admin", "demo", "api", "mail", "cdn"];
const DEV_DEFAULT_TENANT = "maison-alderic";
const TENANT_COOKIE = "x-tenant-slug";

function extractSubdomain(request: NextRequest): string | null {
  const hostname = request.headers.get("host") || "";
  const tenantParam = request.nextUrl.searchParams.get("__tenant");

  if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    if (tenantParam) return tenantParam;
    const tenantHeader = request.headers.get("x-tenant");
    if (tenantHeader) return tenantHeader;
    const tenantCookie = request.cookies.get(TENANT_COOKIE)?.value;
    if (tenantCookie) return tenantCookie;
    const parts = hostname.split(".");
    if (parts.length >= 2 && parts[0] !== "localhost") return parts[0];
    return DEV_DEFAULT_TENANT;
  }

  // Production — __tenant OU cookie OU sous-domaine
  if (tenantParam) return tenantParam;
  const tenantCookie = request.cookies.get(TENANT_COOKIE)?.value;
  if (tenantCookie) return tenantCookie;

  const parts = hostname.split(".");
  if (parts.length < 3) return null;
  const subdomain = parts[0];
  if (RESERVED_SUBDOMAINS.includes(subdomain)) return null;
  return subdomain;
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_SAAS_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next({ request });
  }

  const tenantParam = request.nextUrl.searchParams.get("__tenant");
  const tenantCookie = request.cookies.get(TENANT_COOKIE)?.value;
  if (!tenantParam && !tenantCookie && pathname === "/") {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const subdomain = extractSubdomain(request);

  if (subdomain) {
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("id, name, slug, plan, is_active, trial_ends_at, primary_color, accent_color, logo_url, feature_esignature, feature_ai_summary, feature_intake_forms")
      .eq("subdomain", subdomain)
      .single();

    if (orgError || !org) {
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }

    if (!org.is_active && !pathname.startsWith("/suspended")) {
      return NextResponse.redirect(new URL("/suspended", request.url));
    }

    if (
      org.plan === "trial" &&
      org.trial_ends_at &&
      new Date(org.trial_ends_at) < new Date() &&
      !pathname.startsWith("/upgrade") &&
      !pathname.startsWith("/connexion")
    ) {
      return NextResponse.redirect(new URL("/upgrade", request.url));
    }

    // Persister le tenant dans un cookie session
    supabaseResponse.cookies.set(TENANT_COOKIE, subdomain, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

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

  const demoTenantQuery = request.nextUrl.searchParams.get("__tenant");
  const isDemoTenant = demoTenantQuery === DEMO_TENANT_SLUG;
  const isPortailRoute =
    pathname.startsWith("/portail-avocat") ||
    pathname === "/portail" ||
    (pathname.startsWith("/portail/") && !pathname.startsWith("/portail-avocat"));

  if (isDemoTenant && isPortailRoute && subdomain) {
    const expectedRole = pathname.startsWith("/portail-avocat") ? "avocat" : "client";

    let shouldSignin = false;

    if (!user) {
      shouldSignin = true;
    } else {
      const userEmail = user.email ?? "";
      const isDemoSession = (DEMO_EMAILS_WHITELIST as readonly string[]).includes(
        userEmail,
      );
      if (isDemoSession) {
        const currentRole =
          userEmail === DEMO_CREDENTIALS.avocat.email
            ? "avocat"
            : userEmail === DEMO_CREDENTIALS.client.email
              ? "client"
              : null;
        if (currentRole != null && currentRole !== expectedRole) {
          shouldSignin = true;
        }
      }
    }

    if (shouldSignin) {
      const signinUrl = new URL("/api/demo/signin", request.url);
      signinUrl.searchParams.set("role", expectedRole);
      signinUrl.searchParams.set("next", pathname);
      const demoRedirect = NextResponse.redirect(signinUrl);
      supabaseResponse.cookies.getAll().forEach((c) => {
        demoRedirect.cookies.set(c.name, c.value);
      });
      return demoRedirect;
    }
  }

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

  if (user && pathname.startsWith("/portail") && !pathname.startsWith("/portail-avocat")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.role === "avocat") {
      const url = request.nextUrl.clone();
      url.pathname = "/portail-avocat";
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