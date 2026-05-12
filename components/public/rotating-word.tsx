"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = ["stratégique", "décisif", "précis", "architecturé"];

const ROTATION_INTERVAL_MS = 4000;
const LETTER_STAGGER_S = 0.04;
const TRANSITION_DURATION_S = 0.6;
const EASING = [0.22, 1, 0.36, 1] as const;

/**
 * RotatingWord — anime un mot qui change toutes les 4 secondes.
 *
 * Animation letter-by-letter : chaque lettre apparaît du bas en stagger,
 * disparaît vers le haut. Couleur bordeaux pour accentuer.
 *
 * Usage : <RotatingWord /> au sein d'un h1.
 * Le composant gère son propre cycle, pas de props nécessaires.
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
      aria-label={currentWord}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          className="inline-block whitespace-nowrap"
          aria-hidden="true"
        >
          {currentWord.split("").map((letter, letterIndex) => (
            <motion.span
              key={`${currentWord}-${letterIndex}`}
              className="inline-block"
              initial={{ y: "0.5em", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-0.5em", opacity: 0 }}
              transition={{
                duration: TRANSITION_DURATION_S,
                ease: EASING,
                delay: letterIndex * LETTER_STAGGER_S,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}