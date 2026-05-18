"use client";

import { CountUp } from "@/components/lawyeros/count-up";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { annualTotalEuros, PLANS } from "@/lib/lawyeros/pricing";

const pricingCardCss = `
  .lawyeros-pricing-card {
    transition: transform 250ms cubic-bezier(0.22, 1, 0.36, 1),
      border-color 250ms cubic-bezier(0.22, 1, 0.36, 1),
      box-shadow 250ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  @media (min-width: 1024px) {
    .lawyeros-pricing-card--featured {
      transform: scale(1.02);
      z-index: 10;
    }
  }
  @media (hover: hover) and (pointer: fine) and (min-width: 1024px) {
    .lawyeros-pricing-card:not(.lawyeros-pricing-card--featured):hover {
      transform: translateY(-2px);
      border-color: #1a1a1a !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
    }
    .lawyeros-pricing-card--featured:hover {
      transform: scale(1.02) translateY(-2px);
      box-shadow: 0 12px 32px -8px rgba(122, 31, 43, 0.2) !important;
    }
  }
  @media (hover: hover) and (pointer: fine) {
    .lawyeros-pricing-cta-ghost:hover {
      background-color: #f2f0eb;
    }
  }
`;

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const prevAnnualRef = useRef(false);
  const [badgeNonce, setBadgeNonce] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const monthlyBtnRef = useRef<HTMLButtonElement>(null);
  const annualBtnRef = useRef<HTMLButtonElement>(null);
  const [pill, setPill] = useState({ x: 4, w: 0 });

  const cardGridInView = useInView(containerRef, { margin: "-20% 0px -20% 0px", once: true });
  const reducedMotion = useReducedMotion();

  const updatePill = useCallback(() => {
    const c = toggleRef.current;
    const btn = annual ? annualBtnRef.current : monthlyBtnRef.current;
    if (!c || !btn) return;
    const cr = c.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setPill({ x: br.left - cr.left, w: br.width });
  }, [annual]);

  useLayoutEffect(() => {
    updatePill();
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => updatePill());
    });
    window.addEventListener("resize", updatePill);
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      window.removeEventListener("resize", updatePill);
    };
  }, [annual, updatePill]);

  useEffect(() => {
    if (annual && !prevAnnualRef.current) {
      setBadgeNonce((n) => n + 1);
    }
    prevAnnualRef.current = annual;
  }, [annual]);

  const showGrid = reducedMotion || cardGridInView;

  return (
    <section id="tarifs" className="px-6 py-32 md:px-12 md:py-40 lg:px-20" style={{ backgroundColor: "var(--background)" }}>
      <style>{pricingCardCss}</style>
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p
            className="mb-4 text-xs font-medium uppercase tracking-widest"
            style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}
          >
            Tarifs
          </p>
          <h2 className="text-3xl font-heading font-medium tracking-tight md:text-4xl" style={{ color: "var(--foreground)" }}>
            Simple, transparent, sans surprise.
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-lg"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
          >
            14 jours d&apos;essai gratuit sur tous les plans. Aucune carte bancaire requise.
          </p>

          <div ref={toggleRef} className="relative mt-8 inline-flex rounded-full p-1" style={{ backgroundColor: "#F2F0EB" }}>
            <motion.div
              className="pointer-events-none absolute top-1 bottom-1 rounded-full bg-white shadow-sm"
              initial={false}
              animate={{
                left: pill.x,
                width: Math.max(pill.w, 1),
                opacity: pill.w > 0 ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              type="button"
              ref={monthlyBtnRef}
              onClick={() => setAnnual(false)}
              className="relative z-10 rounded-full px-5 py-2.5 text-sm transition-colors"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: !annual ? 500 : 400,
                color: !annual ? "#1A1A1A" : "#8B887F",
              }}
            >
              Mensuel
            </button>
            <button
              type="button"
              ref={annualBtnRef}
              onClick={() => {
                if (!annual) {
                  setAnnual(true);
                }
              }}
              className="relative z-10 inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm transition-colors"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: annual ? 500 : 400,
                color: annual ? "#1A1A1A" : "#8B887F",
              }}
            >
              <span>Annuel</span>
              <motion.span
                key={badgeNonce}
                className="text-xs font-medium"
                style={{ color: "#7A1F2B" }}
                initial={{ scale: 1 }}
                animate={{ scale: badgeNonce > 0 && annual ? [1, 1.15, 1] : 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 16 }}
              >
                −20%
              </motion.span>
            </button>
          </div>
        </div>

        <motion.div
          ref={containerRef}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
          variants={containerVariants}
          initial={reducedMotion ? "show" : "hidden"}
          animate={showGrid ? "show" : "hidden"}
        >
          {PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              variants={cardVariants}
              className={`lawyeros-pricing-card relative flex flex-col rounded-md border bg-surface p-8 md:p-10 ${
                plan.highlighted ? "lawyeros-pricing-card--featured" : ""
              }`}
              style={{
                borderColor: plan.highlighted ? "#7A1F2B" : "#E5E2DB",
                boxShadow: plan.highlighted ? "0 8px 24px -8px rgba(122, 31, 43, 0.12)" : "none",
              }}
            >
              {plan.recommendedBadge && (
                <div
                  className="absolute -top-4 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-sm px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ backgroundColor: "var(--accent)", color: "#ffffff", fontFamily: "var(--font-body)" }}
                >
                  Recommandé
                </div>
              )}

              <div className="pb-6">
                <p
                  className="text-sm font-medium uppercase tracking-widest"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                >
                  {plan.name}
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-heading font-medium text-foreground">
                    <CountUp
                      value={annual ? plan.annualPrice : plan.monthlyPrice}
                      suffix="€"
                      duration={0.6}
                      decimals={0}
                      animateOnValueChange
                    />
                  </span>
                  <span className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                    /mois
                  </span>
                </div>
                {annual && (
                  <p className="mt-1 text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                    Facturé annuellement ({annualTotalEuros(plan)}€/an)
                  </p>
                )}
                <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                  {plan.description}
                </p>
              </div>

              <div className="flex-1 pb-6">
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0"
                        viewBox="0 0 16 16"
                        fill="none"
                        style={{ color: "var(--accent)" }}
                      >
                        <path
                          d="M3 8l3.5 3.5L13 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {plan.highlighted ? (
                  <Link
                    href="/signup"
                    className="block w-full rounded-md py-3 text-center text-sm font-medium text-white transition-[transform,box-shadow] duration-[250ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1F2B] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] [&:hover]:-translate-y-px [&:hover]:shadow-[0_8px_20px_-8px_rgba(0,0,0,0.15)]"
                    style={{
                      backgroundColor: "#1A1A1A",
                      fontFamily: "var(--font-body)",
                      transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                      fontWeight: 500,
                    }}
                  >
                    {plan.cta} — 14 jours gratuits
                  </Link>
                ) : (
                  <Link
                    href="/signup"
                    className="lawyeros-pricing-cta-ghost block w-full rounded-md border bg-transparent py-3 text-center text-sm font-medium text-foreground transition-[background-color] duration-[250ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1F2B] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                    style={{
                      borderColor: "#E5E2DB",
                      fontFamily: "var(--font-body)",
                      transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                      fontWeight: 500,
                    }}
                  >
                    {plan.cta} — 14 jours gratuits
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-8 text-center text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          Pas de carte bancaire. Pas d&apos;engagement. Annulation en 1 clic.
        </p>
      </div>
    </section>
  );
}
