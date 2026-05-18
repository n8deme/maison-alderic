"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/brand/logo";

const navLinks = [
  { href: "/demo/expertises", label: "Expertises" },
  { href: "/demo/associes", label: "Associés" },
  { href: "/demo/deals", label: "Deals" },
  { href: "/demo/insights", label: "Insights" },
  { href: "/demo/contact", label: "Contact" },
];

const SCROLL_THRESHOLD_PX = 80;

function useScrolled(threshold: number = SCROLL_THRESHOLD_PX) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const pathname = usePathname();

  return (
    <motion.header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: scrolled ? "rgba(248,247,244,0.72)" : "rgba(248,247,244,0)",
        backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
        borderBottomWidth: scrolled ? 1 : 0,
        borderBottomStyle: "solid",
        borderColor: "var(--border-subtle)",
        transition: "background-color 300ms ease, backdrop-filter 300ms ease, border-bottom-width 300ms ease",
      }}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-12 lg:px-20">
        <Link
          href="/demo"
          className="block shrink-0 text-[var(--text-primary)] transition-opacity hover:opacity-80"
        >
          <Logo variant="wordmark" className="h-10 w-auto md:h-12" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-bordeaux"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: 400,
                color: pathname.startsWith(link.href)
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/portail"
            className="hidden px-4 py-2 text-xs font-medium uppercase tracking-widest transition-colors hover:bg-bordeaux hover:text-white md:inline-block"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--bordeaux)",
              border: "1px solid var(--bordeaux)",
            }}
          >
            Espace client
          </Link>

          <button
            className="md:hidden p-1"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            style={{ color: "var(--text-primary)" }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="md:hidden border-t px-6 py-6 flex flex-col gap-5"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="transition-colors hover:text-bordeaux"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                color: "var(--text-primary)",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/portail"
            onClick={() => setOpen(false)}
            className="mt-2 self-start px-4 py-2 text-xs font-medium uppercase tracking-widest transition-colors hover:bg-bordeaux hover:text-white"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--bordeaux)",
              border: "1px solid var(--bordeaux)",
            }}
          >
            Espace client
          </Link>
        </div>
      )}
    </motion.header>
  );
}