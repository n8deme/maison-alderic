"use client";

import { usePathname } from "next/navigation";
import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * LenisProvider — smooth scroll sur le site vitrine uniquement.
 * Les portails (/portail, /portail-avocat) rendent {children} sans Lenis
 * pour un scroll document natif (dashboard / SaaS).
 */
function isPortailRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname === "/portail" ||
    pathname.startsWith("/portail/") ||
    pathname.startsWith("/portail-avocat")
  );
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (isPortailRoute(pathname)) {
    return children;
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}