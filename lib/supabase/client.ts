import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: "pkce",
        storage: {
          getItem: (key) => {
            if (typeof document === "undefined") return null;
            const match = document.cookie.match(new RegExp("(^| )" + key + "=([^;]+)"));
            return match ? decodeURIComponent(match[2]) : null;
          },
          setItem: (key, value) => {
            if (typeof document === "undefined") return;
            const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
            const securePart = isLocalhost ? "" : "; Secure";
            document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=600; SameSite=Lax${securePart}`;
          },
          removeItem: (key) => {
            if (typeof document === "undefined") return;
            document.cookie = `${key}=; path=/; max-age=0`;
          },
        },
      },
    },
  );
}
