"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FADE_THRESHOLD_PX = 100;

/**
 * Hook : détecte si on a dépassé le seuil de scroll.
 */
function useScrolled(threshold: number = FADE_THRESHOLD_PX) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

/**
 * ScrollIndicator — chevron animé invitant à scroller.
 *
 * Disparaît dès que l'utilisateur commence à scroller (>100px).
 * Animation : oscillation verticale subtile en boucle (effet "respiration").
 * Aria-hidden car purement décoratif.
 */
export function ScrollIndicator() {
  const scrolled = useScrolled();

  return (
    <motion.div
      aria-hidden="true"
      className="flex justify-center pt-10"
      animate={{
        opacity: scrolled ? 0 : 1,
      }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        animate={{
          y: [0, 8, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ChevronDown size={24} strokeWidth={1.5} color="var(--text-muted)" />
      </motion.div>
    </motion.div>
  );
}