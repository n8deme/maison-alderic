"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ENTRY_EASE = [0.22, 1, 0.36, 1] as const;

const BORDER_HOVER = `color-mix(in srgb, var(--bordeaux) 30%, transparent)`;

/** Pulse : opacité visuelle ~1 → ~0.6 → ~1 sur le trait bordeaux (3s) */
const BORDER_PULSE_HIGH = `rgba(122, 31, 43, 0.38)`;
const BORDER_PULSE_LOW = `rgba(122, 31, 43, 0.23)`;

export type AnimatedKPICardProps = {
  icon: LucideIcon;
  value: ReactNode;
  label: string;
  href: string;
  sublabel?: string;
  index: number;
  /** Carte de type alerte (ex. factures en retard) */
  isAlert?: boolean;
  /** Condition active (ex. nombre > 0) — pulse discret + valeur en bordeaux */
  alertActive?: boolean;
};

export function AnimatedKPICard({
  icon: Icon,
  value,
  label,
  href,
  sublabel,
  index,
  isAlert = false,
  alertActive = false,
}: AnimatedKPICardProps) {
  const reduceMotion = useReducedMotion();
  const showPulse = Boolean(isAlert && alertActive && !reduceMotion);
  const valueEmphasis = Boolean(isAlert && alertActive);

  const entryDelay = reduceMotion ? 0 : index * 0.06;
  const entryDuration = reduceMotion ? 0.01 : 0.5;

  const transition = reduceMotion
    ? { duration: 0.01 }
    : showPulse
      ? {
          opacity: { duration: entryDuration, delay: entryDelay, ease: ENTRY_EASE },
          y: { duration: entryDuration, delay: entryDelay, ease: ENTRY_EASE },
          borderColor: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
          backgroundColor: { duration: 0.3, ease: "easeOut" as const },
        }
      : {
          opacity: { duration: entryDuration, delay: entryDelay, ease: ENTRY_EASE },
          y: { duration: entryDuration, delay: entryDelay, ease: ENTRY_EASE },
          borderColor: { duration: 0.3, ease: "easeOut" as const },
          backgroundColor: { duration: 0.3, ease: "easeOut" as const },
        };

  return (
    <Link href={href} className="block h-full cursor-pointer outline-none">
      <motion.div
        className="h-full rounded-lg border border-border bg-surface p-5"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={transition}
        whileHover={
          reduceMotion
            ? undefined
            : {
                y: -2,
                backgroundColor: "var(--surface-alt)",
                borderColor: BORDER_HOVER,
                transition: { duration: 0.3, ease: "easeOut" },
              }
        }
        animate={
          showPulse ? { borderColor: [BORDER_PULSE_HIGH, BORDER_PULSE_LOW, BORDER_PULSE_HIGH] } : undefined
        }
      >
        <div className="mb-2 flex items-center justify-between">
          <Icon className="h-4 w-4 shrink-0 text-bordeaux" />
        </div>
        <p className={`text-3xl ${valueEmphasis ? "text-bordeaux" : "text-foreground"}`}>{value}</p>
        <p className="mt-1 text-xs text-text-muted">{label}</p>
        {sublabel ? <p className="mt-0.5 text-xs text-text-secondary">{sublabel}</p> : null}
      </motion.div>
    </Link>
  );
}
