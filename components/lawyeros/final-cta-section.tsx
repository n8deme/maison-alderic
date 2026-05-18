"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function FinalCtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "-30% 0px -30% 0px", once: true });
  const prefersReduced = useReducedMotion();
  const showContent = prefersReduced || isInView;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-24 text-center md:px-12 lg:px-20"
      style={{ backgroundColor: "#1A1A1A" }}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "70%",
          height: "70%",
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(122, 31, 43, 0.35) 0%, transparent 70%)",
          filter: "blur(100px)",
          zIndex: 0,
        }}
        aria-hidden
      />

      <motion.div
        className="relative z-[1] mx-auto max-w-2xl"
        initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={prefersReduced ? { duration: 0 } : { duration: 0.6, ease: EASE }}
      >
        <h2 className="text-3xl font-heading font-medium tracking-tight md:text-4xl" style={{ color: "#ffffff" }}>
          Votre cabinet mérite mieux qu&apos;un email.
        </h2>
        <p className="mt-4 text-lg" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-body)" }}>
          Rejoignez les cabinets qui ont choisi de professionnaliser leur relation client.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="los-btn-accent rounded-sm px-6 py-3.5 text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>
            Commencer — 14 jours gratuits
          </Link>
          <Link href="/connexion" className="los-btn-ghost-dark rounded-sm px-6 py-3.5 text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>
            J&apos;ai déjà un compte
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
