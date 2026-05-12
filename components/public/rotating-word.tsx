"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = ["décisive", "précise", "calibrée", "affûtée"];

const ROTATION_INTERVAL_MS = 4000;
const TRANSITION_DURATION_S = 0.7;
const EASING = [0.22, 1, 0.36, 1] as const;

/**
 * RotatingWord — anime un mot qui change toutes les 4 secondes.
 *
 * Animation "magazine éditorial" : le mot (avec son point final) disparaît
 * en fade vers le haut, le nouveau apparaît en fade depuis le bas.
 * Le point est inclus dans l'animation pour éviter qu'il "flotte seul"
 * pendant la transition.
 *
 * Inspiration : Stibbe, Sullivan & Cromwell.
 */
export function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const currentWord = WORDS[index];

  return (
    <span
      className="relative inline-block align-baseline"
      style={{
        fontStyle: "italic",
        color: "var(--bordeaux)",
        minWidth: "0.3em",
      }}
      aria-live="polite"
      aria-label={`${currentWord}.`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          className="inline-block whitespace-nowrap"
          initial={{ y: "0.4em", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-0.4em", opacity: 0 }}
          transition={{
            duration: TRANSITION_DURATION_S,
            ease: EASING,
          }}
        >
          {currentWord}.
        </motion.span>
      </AnimatePresence>
    </span>
  );
}