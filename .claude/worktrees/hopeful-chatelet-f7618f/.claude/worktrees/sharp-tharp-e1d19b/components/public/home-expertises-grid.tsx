"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EXPERTISES = [
  {
    number: "01",
    title: "M&A",
    description:
      "Structuration buy-side et sell-side, négociations sensibles et exécution jusqu'au closing.",
    href: "/expertises#ma",
  },
  {
    number: "02",
    title: "Private Equity",
    description:
      "Accompagnement des fonds et dirigeants sur LBO, growth equity et opération de sortie.",
    href: "/expertises#pe",
  },
  {
    number: "03",
    title: "Contentieux",
    description:
      "Stratégie pré-contentieuse, arbitrage et défense sur litiges commerciaux complexes.",
    href: "/expertises#contentieux",
  },
  {
    number: "04",
    title: "Fiscal",
    description:
      "Pilotage fiscal transfrontalier, structurations et sécurisation des impacts transactionnels.",
    href: "/expertises#tax",
  },
] as const;

export function HomeExpertisesGrid() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <section
      className="px-6 py-16 md:px-12 md:py-24 lg:px-20 lg:py-32"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div className="mx-auto max-w-7xl space-y-14 md:space-y-16">
        <div className="space-y-4">
          <span className="text-xs font-medium uppercase tracking-widest text-text-muted">
            Domaines d&apos;intervention
          </span>
          <h2 className="text-4xl text-foreground md:text-5xl">Nos expertises</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {EXPERTISES.map((item, index) => (
            <motion.article
              key={item.title}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -5% 0px" }}
              transition={
                prefersReducedMotion
                  ? {}
                  : {
                      duration: 0.4,
                      delay: index * 0.035,
                      ease: [0.22, 1, 0.36, 1],
                    }
              }
            >
              <Link
                href={item.href}
                className="group relative flex h-full min-h-72 flex-col justify-between overflow-hidden rounded-sm border border-border bg-surface-alt p-7 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-bordeaux/50 hover:bg-surface hover:shadow-sm md:p-8"
              >
                {/* Bordure gauche bordeaux au hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 h-full w-0.5 origin-top scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100"
                  style={{ backgroundColor: "var(--bordeaux)" }}
                />

                <div className="space-y-5">
                  <span
                    className="block font-heading text-sm font-medium tracking-wide text-bordeaux transition-all duration-500 ease-out group-hover:text-lg"
                  >
                    {item.number}
                  </span>
                  <div className="space-y-3">
                    <h3 className="text-2xl text-foreground">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-text-secondary md:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-bordeaux">
                  En savoir plus
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}