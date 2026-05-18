"use client";

import {
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

export interface CountUpProps {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
  /** Seconds; used to stagger multiple CountUps in the same block */
  delay?: number;
  /**
   * When true, animates from the current displayed value whenever `value` changes
   * (e.g. billing toggle). Skips the stats in-view-from-zero behavior.
   */
  animateOnValueChange?: boolean;
  /** Si défini, format via Intl (ex. "fr-BE"). Sinon comportement historique (toFixed / round). */
  locale?: string;
}

function formatValue(v: number, decimals: number, locale?: string): string {
  if (locale) {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(v);
  }
  return decimals > 0 ? v.toFixed(decimals) : String(Math.round(v));
}

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function CountUp({
  value,
  suffix = "",
  decimals = 0,
  duration = 2,
  delay = 0,
  animateOnValueChange = false,
  locale,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { margin: "-30% 0px -30% 0px", once: true });
  const prefersReduced = useReducedMotion();
  const count = useMotionValue(animateOnValueChange ? value : 0);
  const display = useTransform(count, (v) => formatValue(v, decimals, locale));
  const [text, setText] = useState(() =>
    prefersReduced
      ? formatValue(value, decimals, locale)
      : formatValue(animateOnValueChange ? value : 0, decimals, locale)
  );

  useMotionValueEvent(display, "change", (latest) => setText(latest));

  // Billing / controlled: animate when `value` changes (from current motion value)
  useEffect(() => {
    if (!animateOnValueChange) return;
    if (prefersReduced) {
      count.set(value);
      setText(formatValue(value, decimals, locale));
      return;
    }
    const current = count.get();
    if (current === value) {
      setText(formatValue(value, decimals, locale));
      return;
    }
    const controls = animate(count, value, {
      duration,
      ease: EASE,
      delay,
    });
    return () => controls.stop();
  }, [animateOnValueChange, prefersReduced, value, duration, delay, decimals, locale, count]);

  // Stats: first reveal from zero when in view
  useEffect(() => {
    if (animateOnValueChange) return;
    if (prefersReduced) {
      count.set(value);
      setText(formatValue(value, decimals, locale));
      return;
    }
    if (!isInView) return;
    count.set(0);
    setText(formatValue(0, decimals, locale));
    const controls = animate(count, value, {
      duration,
      ease: EASE,
      delay,
    });
    return () => controls.stop();
  }, [animateOnValueChange, isInView, prefersReduced, value, duration, delay, decimals, locale, count]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums", fontFeatureSettings: '"tnum"' }}>
      {text}
      {suffix}
    </span>
  );
}
