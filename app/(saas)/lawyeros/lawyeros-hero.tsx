"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const HERO_WORDS = ["méritent", "exigent", "attendent", "réclament"] as const;
const WORD_INTERVAL_MS = 4000;
const LETTER_EASE = [0.22, 1, 0.36, 1] as const;

function HeroRotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % HERO_WORDS.length);
    }, WORD_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const word = HERO_WORDS[index];
  const letters = [...word];

  return (
    <span
      className="relative inline-flex overflow-hidden align-baseline"
      style={{
        verticalAlign: "baseline",
        maxHeight: "1.2em",
      }}
      aria-live="polite"
      aria-label={`vos clients ${word}`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          className="inline-flex"
          style={{ fontStyle: "italic", color: "var(--accent)" }}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={{
            initial: {},
            animate: {
              transition: { staggerChildren: 0.038, delayChildren: 0 },
            },
            exit: {
              transition: {
                staggerChildren: 0.028,
                staggerDirection: -1,
              },
            },
          }}
        >
          {letters.map((char, i) => (
            <motion.span
              key={`${word}-${i}-${char}`}
              className="inline-block"
              style={{ fontStyle: "italic" }}
              variants={{
                initial: { y: "0.45em", opacity: 0 },
                animate: {
                  y: 0,
                  opacity: 1,
                  transition: { duration: 0.48, ease: LETTER_EASE },
                },
                exit: {
                  y: "-0.45em",
                  opacity: 0,
                  transition: { duration: 0.42, ease: LETTER_EASE },
                },
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function HeroScrollHint() {
  return (
    <motion.div
      className="mt-16 flex justify-start"
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <motion.div
        aria-hidden
        animate={{ y: [0, 4, 0] }}
        transition={{
          duration: 1.8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="rounded-sm border p-1.5"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        <ChevronDown className="h-5 w-5" strokeWidth={1.5} />
      </motion.div>
    </motion.div>
  );
}

export function LawyerosHero() {
  return (
    <section className="px-6 md:px-12 lg:px-20 pt-24 pb-20 md:pt-32 md:pb-28">
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
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              aria-hidden
            />
            Conçu pour les cabinets belges et français
          </div>

          <h1
            className="text-4xl md:text-6xl font-heading font-medium tracking-tight leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            Le portail client que vos clients{" "}
            <HeroRotatingWord />
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
              className="los-hero-cta-primary rounded-sm px-6 py-3.5 text-sm font-medium text-white"
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
