"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * LenisProvider — active le smooth scroll global sur tout le site public.
 *
 * Configuration :
 * - duration 1.2s : feeling premium sans être lent
 * - easing custom : courbe d'expo out (départ rapide, fin douce)
 * - smoothWheel: true : trackpad et molette adoucis
 * - syncTouch: true : mobile/tactile bénéficie aussi du smooth
 *
 * À wrapper dans app/layout.tsx autour de {children}.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
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