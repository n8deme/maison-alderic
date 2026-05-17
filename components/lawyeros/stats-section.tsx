"use client";

import { motion, type Variants, useInView } from "framer-motion";
import { useRef } from "react";
import { CountUp } from "./count-up";

const STATS = [
  {
    value: 12,
    suffix: "h",
    decimals: 0,
    primary: "gagnées par avocat",
    secondary: "par semaine",
    ariaLabel: "12 heures gagnées par avocat par semaine",
  },
  {
    value: 73,
    suffix: "%",
    decimals: 0,
    primary: "réduction no-shows",
    secondary: "(vs gestion manuelle)",
    ariaLabel: "73 % de réduction des no-shows, par rapport à la gestion manuelle",
  },
  {
    value: 4,
    suffix: "",
    decimals: 0,
    primary: "cabinets pilotes",
    secondary: "early access 2026",
    ariaLabel: "4 cabinets pilotes en early access 2026",
  },
  {
    value: 99.9,
    suffix: "%",
    decimals: 1,
    primary: "uptime garanti",
    secondary: "SLA infrastructure",
    ariaLabel: "99,9 % d'uptime garanti, SLA infrastructure",
  },
] as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "-30% 0px -30% 0px", once: true });

  return (
    <section
      ref={sectionRef}
      className="w-full py-24 md:py-32"
      style={{ backgroundColor: "var(--surface-alt)" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <motion.div
          className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:grid-cols-4"
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.ariaLabel}
              variants={item}
              aria-label={stat.ariaLabel}
            >
              <p
                className="font-heading font-medium tracking-tight text-6xl text-foreground md:text-7xl"
                style={{ fontVariantNumeric: "tabular-nums", fontFeatureSettings: '"tnum"' }}
              >
                <CountUp
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  duration={2}
                  delay={index * 0.1}
                />
              </p>
              <p
                className="mt-4 text-base font-medium text-foreground"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {stat.primary}
              </p>
              <p
                className="mt-1 text-sm font-normal text-text-secondary"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {stat.secondary}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
