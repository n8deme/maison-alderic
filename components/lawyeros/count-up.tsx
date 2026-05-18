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
}

function formatValue(v: number, decimals: number): string {
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
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { margin: "-30% 0px -30% 0px", once: true });
  const prefersReduced = useReducedMotion();
  const count = useMotionValue(animateOnValueChange ? value : 0);
  const display = useTransform(count, (v) => formatValue(v, decimals));
  const [text, setText] = useState(() =>
    prefersReduced ? formatValue(value, decimals) : formatValue(animateOnValueChange ? value : 0, decimals)
  );

  useMotionValueEvent(display, "change", (latest) => setText(latest));

  // Billing / controlled: animate when `value` changes (from current motion value)
  useEffect(() => {
    if (!animateOnValueChange) return;
    if (prefersReduced) {
      count.set(value);
      setText(formatValue(value, decimals));
      return;
    }
    const current = count.get();
    if (current === value) {
      setText(formatValue(value, decimals));
      return;
    }
    const controls = animate(count, value, {
      duration,
      ease: EASE,
      delay,
    });
    return () => controls.stop();
  }, [animateOnValueChange, prefersReduced, value, duration, delay, decimals, count]);

  // Stats: first reveal from zero when in view
  useEffect(() => {
    if (animateOnValueChange) return;
    if (prefersReduced) {
      count.set(value);
      setText(formatValue(value, decimals));
      return;
    }
    if (!isInView) return;
    count.set(0);
    setText(formatValue(0, decimals));
    const controls = animate(count, value, {
      duration,
      ease: EASE,
      delay,
    });
    return () => controls.stop();
  }, [animateOnValueChange, isInView, prefersReduced, value, duration, delay, decimals, count]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums", fontFeatureSettings: '"tnum"' }}>
      {text}
      {suffix}
    </span>
  );
}
