"use client";

import Link from "next/link";
import Image from "next/image";
import { getAvocatPhoto } from "@/lib/avocats-photos";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  CircleCheck,
  Clock3,
  Download,
  Euro,
  FileText,
  MessageCircle,
  Receipt,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

type Status = "active" | "pending" | "archived" | "won" | "lost";

type DashboardDossier = {
  id: string;
  reference: string;
  title: string;
  status: Status;
  nextAction: string;
  nextActionDate: string | null;
  progressPct: number;
  leadAvocat: { id: string; full_name: string; slug: string | null } | null;
};

type ActivityItem = {
  id: string;
  title: string;
  status: string;
  created_at: string;
  dossier: { id: string; title: string; reference: string } | null;
};

type DashboardPremiumProps = {
  firstName: string;
  todayLabel: string;
  stats: {
    activeDossiers: number;
    pendingActions: number;
    recentDocuments: number;
    billedThisMonth: number;
    activeTrend: string | null;
  };
  activity: ActivityItem[];
  dossiers: DashboardDossier[];
};

function relativeTimeFr(iso: string) {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = Math.max(0, now - then);
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) return "À l'instant";
  if (hours < 24) return "Récemment";
  const date = new Date(iso);
  return new Intl.DateTimeFormat("fr-BE", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function formatShortDate(iso: string | null) {
  if (!iso) return "Date à confirmer";
  return new Intl.DateTimeFormat("fr-BE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function formatEur(value: number) {
  return new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR" }).format(value);
}

function statusBadge(status: Status) {
  if (status === "won") return { label: "Clos", cls: "text-green-700 bg-green-100" };
  if (status === "pending") return { label: "En attente", cls: "text-orange-700 bg-orange-100" };
  if (status === "active") return { label: "En cours", cls: "text-amber-700 bg-amber-100" };
  return { label: "Archive", cls: "text-text-secondary bg-surface-alt" };
}

export function DashboardPremium({
  firstName,
  todayLabel,
  stats,
  activity,
  dossiers,
}: DashboardPremiumProps) {
  const reduce = useReducedMotion();

  const cards = [
    {
      key: "active",
      icon: CircleCheck,
      value: String(stats.activeDossiers),
      label: "Dossiers actifs",
      trend: null,
    },
    {
      key: "pending",
      icon: Clock3,
      value: String(stats.pendingActions),
      label: "Actions en attente",
      trend: "2 prioritaires",
    },
    {
      key: "docs",
      icon: FileText,
      value: String(stats.recentDocuments),
      label: "Documents récents",
      trend: "7 derniers jours",
    },
    {
      key: "billed",
      icon: Euro,
      value: formatEur(stats.billedThisMonth),
      label: "Facturé ce mois",
      trend: null,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl p-6 md:p-8">
      <section className="py-8 md:py-12">
        <p className="text-sm text-text-secondary">{todayLabel}</p>
        <h1 className="mt-2 text-4xl text-foreground md:text-5xl">Bonjour {firstName}</h1>
        <p className="mt-3 text-base text-text-secondary">Vos dossiers en un coup d'oeil.</p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.article
              key={card.key}
              className="rounded-lg border border-border bg-surface p-5"
              initial={reduce ? {} : { opacity: 0, y: 12 }}
              whileInView={reduce ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={reduce ? {} : { duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduce ? {} : { scale: 1.02 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <Icon className="h-5 w-5 text-bordeaux" />
                {card.trend ? <span className="text-xs text-text-muted">{card.trend}</span> : <span />}
              </div>
              <p className="tabular text-4xl font-medium text-foreground">{card.value}</p>
              <p className="mt-2 text-sm text-text-secondary">{card.label}</p>
            </motion.article>
          );
        })}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <article className="rounded-lg border border-border bg-surface p-6 xl:col-span-8">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl text-foreground">Activité récente</h3>
            <Link href="/portail/dossiers" className="text-sm text-bordeaux">
              Voir tout →
            </Link>
          </div>
          <div className="space-y-2">
            {activity.length === 0 ? (
              <p className="text-sm text-text-muted">Aucune activité récente.</p>
            ) : (
              activity.map((item) => {
                const icon =
                  item.status === "completed"
                    ? CheckCircle2
                    : item.status === "in_progress"
                      ? Clock3
                      : item.status === "pending"
                        ? AlertCircle
                        : FileText;
                const Icon = icon;
                return (
                  <Link
                    key={item.id}
                    href={item.dossier ? `/portail/dossiers/${item.dossier.id}` : "/portail/dossiers"}
                    className="flex items-start gap-3 rounded-sm p-3 transition-colors hover:bg-surface-alt"
                  >
                    <Icon className="mt-0.5 h-4 w-4 text-bordeaux" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-foreground">{item.title}</p>
                      <p className="text-xs text-text-secondary">
                        {item.dossier?.title ?? "Dossier"} · {relativeTimeFr(item.created_at)}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </article>

        <article className="rounded-lg border border-bordeaux/20 bg-bordeaux/5 p-6 xl:col-span-4">
          <h3 className="mb-4 text-xl text-foreground">Actions rapides</h3>
          <div className="space-y-2">
            {[
              { href: "/portail/messages", label: "Nouveau message", icon: MessageCircle },
              { href: "/portail/rdv", label: "Planifier RDV", icon: Calendar },
              { href: "/portail/facturation", label: "Voir mes factures", icon: Receipt },
              { href: "/portail/documents", label: "Télécharger doc", icon: Download },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-bordeaux"
                >
                  <Icon className="h-4 w-4" />
                  {action.label}
                </Link>
              );
            })}
          </div>
        </article>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl text-foreground">Vos dossiers en cours</h3>
          <Link href="/portail/dossiers" className="text-sm text-bordeaux">
            Voir tous →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {dossiers.length === 0 ? (
            <div className="rounded-sm border border-border bg-surface p-8 text-center">
              <svg viewBox="0 0 120 72" className="mx-auto h-16 w-24 text-text-muted" aria-hidden="true">
                <rect x="8" y="14" width="104" height="50" rx="6" fill="currentColor" opacity="0.12" />
                <path d="M8 28h104" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                <circle cx="22" cy="22" r="3" fill="currentColor" opacity="0.45" />
                <circle cx="33" cy="22" r="3" fill="currentColor" opacity="0.3" />
              </svg>
              <p className="mt-4 text-sm text-text-secondary">Aucun dossier en cours.</p>
              <Link
                href="/contact"
                className="mt-4 inline-flex rounded-sm border border-bordeaux px-4 py-2 text-xs font-medium uppercase tracking-wide text-bordeaux transition-colors hover:bg-bordeaux hover:text-white"
              >
                Contacter le cabinet
              </Link>
            </div>
          ) : (
            dossiers.map((dossier, index) => {
              const badge = statusBadge(dossier.status);
              return (
                <motion.article
                  key={dossier.id}
                  className="rounded-lg border border-border bg-surface p-5 flex flex-col"
                  initial={reduce ? {} : { opacity: 0, y: 10 }}
                  whileInView={reduce ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={reduce ? {} : { duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className={`rounded-sm px-2 py-1 text-[10px] uppercase tracking-wide ${badge.cls}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs text-text-muted">{dossier.reference}</span>
                  </div>

                  <p className="text-xl text-foreground">{dossier.title}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Image
                      src={getAvocatPhoto(dossier.leadAvocat?.slug ?? "")}
                      alt={dossier.leadAvocat?.full_name ?? "Avocat"}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <p className="text-sm text-text-secondary">
                      {dossier.leadAvocat?.full_name ?? "Avocat référent"}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-text-muted">
                      {dossier.nextAction} · {formatShortDate(dossier.nextActionDate)}
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-alt">
                      <div className="h-full rounded-full bg-bordeaux" style={{ width: `${dossier.progressPct}%` }} />
                    </div>
                  </div>

                  <Link href={`/portail/dossiers/${dossier.id}`} className="mt-auto pt-4 inline-flex items-center gap-1 text-sm text-bordeaux">
                    Voir détails <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </motion.article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
