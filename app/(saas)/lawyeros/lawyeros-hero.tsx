"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const CYCLING_WORDS = ["méritent", "exigent", "attendent", "réclament"] as const;
const WORD_INTERVAL_MS = 4000;
const WORD_EASE = [0.22, 1, 0.36, 1] as const;

function CyclingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % CYCLING_WORDS.length);
    }, WORD_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const word = CYCLING_WORDS[index];

  return (
    <span className="inline-block relative align-baseline overflow-hidden" aria-live="polite" aria-label={`vos clients ${word}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: WORD_EASE }}
          className="inline-block font-heading font-medium italic"
          style={{ color: "var(--accent)" }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function HeroScrollHint() {
  return (
    <div className="mt-20 flex flex-col items-center gap-2 sm:items-start">
      <span className="sr-only">Faire défiler vers le bas</span>
      <motion.div
        aria-hidden
        animate={{ y: [0, 4, 0] }}
        transition={{
          duration: 1.8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="inline-flex rounded-sm border p-2"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
          color: "var(--accent)",
        }}
      >
        <ChevronDown className="h-6 w-6" strokeWidth={2} />
      </motion.div>
      <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
        Suite
      </p>
    </div>
  );
}

export function LawyerosHero() {
  return (
    <section className="relative px-6 pb-16 md:px-12 md:pb-20 lg:px-20 pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <div
            className="inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 text-xs font-medium mb-8"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
              backgroundColor: "var(--surface)",
              fontFamily: "var(--font-body)",
            }}
          >
            <motion.span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
              animate={{
                opacity: [0.35, 1, 0.35],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              aria-hidden
            />
            Conçu pour les cabinets belges et français
          </div>

          <h1
            className="text-4xl md:text-6xl font-heading font-medium tracking-tight leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            Le portail client que vos clients <CyclingWord />
            <span style={{ color: "var(--foreground)" }}>.</span>
          </h1>

          <p
            className="mt-6 text-lg md:text-xl max-w-xl"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: "1.7" }}
          >
            LawyerOS donne à votre cabinet un portail professionnel en 10 minutes. Dossiers, messagerie,
            facturation et IA — tout dans un seul outil.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="los-hero-cta-primary inline-block rounded-sm px-6 py-3.5 text-sm font-medium text-white"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Essayer 14 jours gratuit
            </Link>
            <Link
              href="/portail-avocat?__tenant=maison-alderic"
              className="group los-btn-outline inline-flex items-center gap-1 rounded-sm px-6 py-3.5 text-sm font-medium"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <span>Voir la démo</span>
              <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          <p className="mt-5 text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            Aucune carte bancaire. Annulation en 1 clic.
          </p>

          <HeroScrollHint />
        </div>
      </div>
    </section>
  );
}
