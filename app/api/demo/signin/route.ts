import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import {
  DEMO_CREDENTIALS,
  type DemoRole,
  isAllowedDemoRedirectPath,
} from "@/lib/demo/credentials";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const roleParam = searchParams.get("role");
  const next = searchParams.get("next") ?? "/";

  if (roleParam !== "avocat" && roleParam !== "client") {
    return NextResponse.redirect(new URL("/", origin));
  }
  if (!isAllowedDemoRedirectPath(next)) {
    return NextResponse.redirect(new URL("/", origin));
  }

  const role = roleParam as DemoRole;
  const creds = DEMO_CREDENTIALS[role];

  const redirectUrl = new URL(next, origin);
  const response = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({
    email: creds.email,
    password: creds.password,
  });

  if (error) {
    console.error("[demo/signin] login failed:", error.message);
    return NextResponse.redirect(new URL("/connexion?error=demo_unavailable", origin));
  }

  return response;
}
