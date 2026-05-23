"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Calendar,
  Receipt,
  FileText,
  User,
  Menu,
  X,
  ShieldAlert,
  ClipboardList,
  ScrollText,
  Settings,
} from "lucide-react";

type Profile = { full_name: string | null; email: string };

const NAV = [
  { href: "/portail-avocat",             label: "Dashboard",  icon: LayoutDashboard, exact: true  },
  { href: "/portail-avocat/dossiers",    label: "Dossiers",   icon: FolderOpen,      exact: false },
  { href: "/portail-avocat/clients",     label: "Clients",    icon: Users,           exact: false },
  { href: "/portail-avocat/agenda",      label: "Agenda",     icon: Calendar,        exact: false },
  { href: "/portail-avocat/facturation", label: "Facturation",icon: Receipt,         exact: false },
  { href: "/portail-avocat/documents",   label: "Documents",  icon: FileText,        exact: false },
  { href: "/portail-avocat/conflits",    label: "Conflits",   icon: ShieldAlert,     exact: false },
  { href: "/portail-avocat/intake",      label: "Intake",       icon: ClipboardList, exact: false },
  { href: "/portail-avocat/audit",       label: "Audit",        icon: ScrollText,    exact: false },
  { href: "/portail-avocat/settings",    label: "Paramètres",   icon: Settings,      exact: false },
  { href: "/portail-avocat/profil",      label: "Mon profil",   icon: User,          exact: false },
];

function getInitials(name: string | null, email: string) {
  if (name) return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return email[0]?.toUpperCase() ?? "?";
}

function OrgLogo({ orgLogo, orgName }: { orgLogo: string | null; orgName: string }) {
  if (orgLogo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={orgLogo} alt={orgName} className="h-9 w-auto object-contain" />
    );
  }
  return (
    <span className="text-lg font-heading font-medium tracking-tight" style={{ color: "var(--foreground)" }}>
      Lawyer<span style={{ color: "var(--accent)" }}>OS</span>
    </span>
  );
}

function Sidebar({
  profile,
  signOutAction,
  pathname,
  onClose,
  orgLogo,
  orgName,
}: {
  profile: Profile;
  signOutAction: () => Promise<void>;
  pathname: string;
  onClose?: () => void;
  orgLogo: string | null;
  orgName: string;
}) {
  function isActive(item: { href: string; exact: boolean }) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-5 py-5">
        <div>
          <OrgLogo orgLogo={orgLogo} orgName={orgName} />
        </div>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-[10px] uppercase tracking-widest text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
            Portail avocat
          </p>
          <span
            className="rounded-sm px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider"
            style={{ backgroundColor: "rgba(122,31,43,0.1)", color: "var(--bordeaux)" }}
          >
            AVOCAT
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="absolute right-3 top-3 rounded-sm p-1 transition-colors hover:bg-surface-alt"
          >
            <X className="h-4 w-4 text-text-muted" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "relative flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors",
                active ? "bg-surface font-medium text-foreground" : "text-text-secondary hover:bg-surface hover:text-foreground"
              )}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full" style={{ backgroundColor: "var(--bordeaux)" }} />
              )}
              <Icon className="h-4 w-4 shrink-0" style={{ color: active ? "var(--bordeaux)" : "var(--text-muted)" }} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-[11px] font-semibold" style={{ backgroundColor: "var(--surface-alt)", color: "var(--text-secondary)" }}>
            {getInitials(profile.full_name, profile.email)}
          </div>
          <p className="flex-1 truncate text-xs font-medium" style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>
            {profile.full_name ?? profile.email}
          </p>
          <form action={signOutAction}>
            <button type="submit" aria-label="Se déconnecter" className="rounded-sm p-1 transition-colors hover:bg-surface-alt" title="Se deconnecter">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)" }}>
                <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function PortailAvocatShell({
  profile,
  signOutAction,
  orgLogo,
  orgName,
  children,
}: {
  profile: Profile;
  signOutAction: () => Promise<void>;
  orgLogo: string | null;
  orgName: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const sidebarProps = { profile, signOutAction, pathname, onClose: () => setMobileOpen(false), orgLogo, orgName };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 self-start hidden max-h-[100dvh] w-64 shrink-0 flex-col border-r border-border bg-background lg:flex">
        <div className="flex h-full max-h-[100dvh] min-h-0 flex-col overflow-hidden">
          <Sidebar {...sidebarProps} />
        </div>
      </aside>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 lg:hidden" style={{ backgroundColor: "rgba(26,26,26,0.3)" }} onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-background lg:hidden">
            <Sidebar {...sidebarProps} />
          </aside>
        </>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-3 border-b border-border bg-surface px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            className="rounded-sm p-1 -ml-1 transition-colors hover:bg-surface-alt"
          >
            <Menu className="h-5 w-5 text-text-muted" />
          </button>
          <span>
            <OrgLogo orgLogo={orgLogo} orgName={orgName} />
          </span>
          <span
            className="rounded-sm px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider"
            style={{ backgroundColor: "rgba(122,31,43,0.1)", color: "var(--bordeaux)" }}
          >
            AVOCAT
          </span>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
