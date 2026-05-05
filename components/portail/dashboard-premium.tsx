"use client";

import Link from "next/link";
import Image from "next/image";
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
  leadAvocat: { full_name: string; avatar_url: string | null } | null;
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
  };
  activity: ActivityItem[];
  dossiers: DashboardDossier[];
};

function relativeTimeFr(iso: string) {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = Math.max(0, now - then);
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) return "à l'instant";
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "hier";
  return `il y a ${days} jours`;
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
      trend: "+12% ce mois",
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
      trend: "Suivi mensuel",
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
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={reduce ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduce ? {} : { scale: 1.02 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <Icon className="h-5 w-5 text-bordeaux" />
                <span className="text-xs text-text-muted">{card.trend}</span>
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
            <p className="rounded-sm border border-border bg-surface p-5 text-sm text-text-muted">
              Aucun dossier en cours.
            </p>
          ) : (
            dossiers.map((dossier, index) => {
              const badge = statusBadge(dossier.status);
              return (
                <motion.article
                  key={dossier.id}
                  className="rounded-lg border border-border bg-surface p-5"
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  whileInView={reduce ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className={`rounded-sm px-2 py-1 text-[10px] uppercase tracking-wide ${badge.cls}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs text-text-muted">{dossier.reference}</span>
                  </div>

                  <p className="text-xl text-foreground">{dossier.title}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-8 w-8 overflow-hidden rounded-full border border-border bg-surface-alt">
                      {dossier.leadAvocat?.avatar_url ? (
                        <Image
                          src={dossier.leadAvocat.avatar_url}
                          alt={dossier.leadAvocat.full_name}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
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

                  <Link href={`/portail/dossiers/${dossier.id}`} className="mt-4 inline-flex items-center gap-1 text-sm text-bordeaux">
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
