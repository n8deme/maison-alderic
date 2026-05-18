"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, CalendarDays, Euro, FolderOpen, UserPlus } from "lucide-react";
import { CountUp } from "@/components/lawyeros/count-up";

const ENTRY_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const STAGGER_S = 0.08;
const COUNT_DURATION = 1.5;
const ITEM_DURATION = 0.4;

export type DashboardKpiProps = {
  activeDossiers: number;
  newClientsMonth: number;
  rdvWeek: number;
  caMonth: number;
  overdueCount: number;
  /** Libellé montant déjà formaté (ex. Intl fr-BE), statique sous le compteur */
  overdueAmountLabel?: string;
};

function DelayedCountUp({
  value,
  index,
  decimals = 0,
  suffix = "",
  locale,
}: {
  value: number;
  index: number;
  decimals?: number;
  suffix?: string;
  locale?: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const [v, setV] = useState(() => (reduce ? value : 0));

  useEffect(() => {
    if (reduce) {
      setV(value);
      return;
    }
    setV(0);
    const id = window.setTimeout(() => setV(value), Math.round(index * STAGGER_S * 1000));
    return () => window.clearTimeout(id);
  }, [value, index, reduce]);

  return (
    <CountUp
      value={v}
      animateOnValueChange
      duration={COUNT_DURATION}
      decimals={decimals}
      suffix={suffix}
      locale={locale}
    />
  );
}

export function DashboardKpiCards({
  activeDossiers,
  newClientsMonth,
  rdvWeek,
  caMonth,
  overdueCount,
  overdueAmountLabel,
}: DashboardKpiProps) {
  const reduce = useReducedMotion() ?? false;

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : STAGGER_S,
        delayChildren: 0,
      },
    },
  };

  const itemVariants = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : ITEM_DURATION,
        ease: ENTRY_EASE,
      },
    },
  };

  const cards = [
    {
      key: "dossiers",
      icon: FolderOpen,
      label: "Dossiers actifs",
      stat: <DelayedCountUp value={activeDossiers} index={0} />,
      sub: null as string | null,
    },
    {
      key: "clients",
      icon: UserPlus,
      label: "Nouveaux clients (mois)",
      stat: <DelayedCountUp value={newClientsMonth} index={1} />,
      sub: null,
    },
    {
      key: "rdv",
      icon: CalendarDays,
      label: "RDV semaine",
      stat: <DelayedCountUp value={rdvWeek} index={2} />,
      sub: null,
    },
    {
      key: "ca",
      icon: Euro,
      label: "CA encaissé · YTD 2026",
      stat: <DelayedCountUp value={caMonth} index={3} decimals={2} suffix=" €" locale="fr-BE" />,
      sub: null,
    },
    {
      key: "overdue",
      icon: AlertTriangle,
      label: "Factures en retard",
      stat: <DelayedCountUp value={overdueCount} index={4} />,
      sub: overdueAmountLabel ?? null,
    },
  ];

  return (
    <motion.section
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <motion.article key={card.key} variants={itemVariants} className="h-full">
            <div className="kpi-card-dashboard flex h-full flex-col rounded-md border border-[#EFEDE6] bg-white p-6">
              <div className="mb-3">
                <Icon className="kpi-card-dashboard-icon h-4 w-4 shrink-0" aria-hidden />
              </div>
              <p
                className="text-4xl font-medium tracking-tight text-[#1A1A1A] [font-feature-settings:'tnum']"
                style={{ fontFamily: "var(--font-display)", fontVariantNumeric: "tabular-nums" }}
              >
                {card.stat}
              </p>
              <p className="mt-1 text-sm text-[#5C5A55]" style={{ fontFamily: "var(--font-body)" }}>
                {card.label}
              </p>
              {card.sub ? (
                <p className="mt-1 text-sm text-[#5C5A55]" style={{ fontFamily: "var(--font-body)" }}>
                  {card.sub}
                </p>
              ) : null}
            </div>
          </motion.article>
        );
      })}
    </motion.section>
  );
}
