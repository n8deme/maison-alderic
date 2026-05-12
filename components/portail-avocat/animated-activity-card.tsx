"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const ENTRY_EASE = [0.22, 1, 0.36, 1] as const;

const surfaceVariants = {
  rest: { backgroundColor: "var(--surface)" },
  hover: {
    backgroundColor: "var(--surface-alt)",
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

const barVariants = {
  rest: {
    scaleY: 0,
    transition: { duration: 0.35, ease: ENTRY_EASE },
  },
  hover: {
    scaleY: 1,
    transition: { duration: 0.4, ease: ENTRY_EASE },
  },
};

const titleVariants = {
  rest: { x: 0 },
  hover: {
    x: 4,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export type AnimatedActivityCardProps = {
  title: string;
  subtitle: string;
  href?: string | null;
  index: number;
};

function ActivityCardSurface({
  title,
  subtitle,
  reduceMotion,
}: Pick<AnimatedActivityCardProps, "title" | "subtitle"> & { reduceMotion: boolean }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-sm border border-border-subtle p-3"
      initial="rest"
      animate="rest"
      whileHover={reduceMotion ? false : "hover"}
      variants={surfaceVariants}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-full w-[2px] origin-top bg-bordeaux"
        variants={barVariants}
      />
      <motion.p className="relative text-sm text-foreground" variants={titleVariants}>
        {title}
      </motion.p>
      <p className="relative mt-1 text-xs text-text-secondary">{subtitle}</p>
    </motion.div>
  );
}

export function AnimatedActivityCard({ title, subtitle, href, index }: AnimatedActivityCardProps) {
  const reduceMotion = useReducedMotion();

  const entrance = reduceMotion
    ? { duration: 0.01 }
    : { duration: 0.4, delay: index * 0.05, ease: ENTRY_EASE };

  const inner = (
    <ActivityCardSurface title={title} subtitle={subtitle} reduceMotion={reduceMotion} />
  );

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={entrance}
    >
      {href ? (
        <Link href={href} className="block cursor-pointer outline-none">
          {inner}
        </Link>
      ) : (
        <div className="block">{inner}</div>
      )}
    </motion.div>
  );
}
