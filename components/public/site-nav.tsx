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
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
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
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: 400,
                color: pathname.startsWith(link.href)
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
                transition: "color 150ms",
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
            className="hidden md:inline-block text-xs font-medium tracking-widest uppercase px-4 py-2 transition-colors"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--bordeaux)",
              border: "1px solid var(--bordeaux)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--bordeaux)";
              (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--bordeaux)";
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
            className="mt-2 text-xs font-medium tracking-widest uppercase px-4 py-2 self-start"
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
