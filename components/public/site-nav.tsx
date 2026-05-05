"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/expertises", label: "Expertises" },
  { href: "/associes", label: "Associés" },
  { href: "/deals", label: "Deals" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "rgba(248,247,244,0.95)",
        backdropFilter: "blur(8px)",
        borderColor: "var(--border)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-12 lg:px-20">
        {/* Logo */}
        <Link
          href="/"
          className="transition-colors hover:text-bordeaux"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "1rem",
            letterSpacing: "-0.01em",
            color: "var(--text-primary)",
          }}
        >
          Maison Aldéric &amp; Associés
        </Link>

        {/* Desktop nav */}
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

        {/* CTA + burger */}
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

      {/* Mobile menu */}
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
    </header>
  );
}
