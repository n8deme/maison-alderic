// PUBLIC DEMO CREDENTIALS — intentionally hardcoded for the live demo at lawyeros.vercel.app
// These accounts are seeded in supabase/migrations/20260504121000_11_seed_users_avocats.sql
// Activity data may be wiped nightly by POST /api/demo/reset (see vercel.json cron)
// NOT a production security boundary — do not reuse this pattern for real tenants.

export const DEMO_CREDENTIALS = {
  avocat: {
    email: "kev+alderic-vermeulen@n8de.me",
    password: "MA2026!Vermeulen-Kp7n",
  },
  client: {
    email: "kev+client-techscale@n8de.me",
    password: "MA2026!TechScale-Hx9n",
  },
} as const;

export const DEMO_EMAILS_WHITELIST = [
  DEMO_CREDENTIALS.avocat.email,
  DEMO_CREDENTIALS.client.email,
];

export const DEMO_TENANT_SLUG = "maison-alderic";

export type DemoRole = "avocat" | "client";

const PORTAIL_AVOCAT_PREFIX = "/portail-avocat";

/** Safe internal paths only — blocks open redirects (e.g. /portail-avocat.evil.com). */
export function isAllowedDemoRedirectPath(path: string): boolean {
  if (!path.startsWith("/")) return false;
  if (path.startsWith(PORTAIL_AVOCAT_PREFIX)) {
    return path.length === PORTAIL_AVOCAT_PREFIX.length || path.charAt(PORTAIL_AVOCAT_PREFIX.length) === "/";
  }
  if (path === "/portail") return true;
  return path.startsWith("/portail/") && !path.startsWith("/portail-avocat");
}
