"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, FolderOpen, FileText, MessageSquare,
  Receipt, Calendar, User, Menu, X,
} from "lucide-react";

type Profile = { full_name: string | null; company: string | null; email: string };

const NAV = [
  { href: "/portail",             label: "Tableau de bord", icon: LayoutDashboard, exact: true  },
  { href: "/portail/dossiers",    label: "Mes dossiers",    icon: FolderOpen,       exact: false },
  { href: "/portail/documents",   label: "Documents",       icon: FileText,         exact: false },
  { href: "/portail/messages",    label: "Messages",        icon: MessageSquare,    exact: false },
  { href: "/portail/facturation", label: "Facturation",     icon: Receipt,          exact: false },
  { href: "/portail/rdv",         label: "Rendez-vous",     icon: Calendar,         exact: false },
  { href: "/portail/profil",      label: "Mon profil",      icon: User,             exact: false },
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

function PortailSidebar({
  profile,
  unreadCount,
  signOutAction,
  pathname,
  onClose,
  orgLogo,
  orgName,
}: {
  profile: Profile;
  unreadCount: number;
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-border">
        <div>
          <div>
            <OrgLogo orgLogo={orgLogo} orgName={orgName} />
          </div>
          <p
            className="text-[10px] uppercase tracking-widest mt-0.5"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            Portail client
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="p-1 -mr-1 rounded-sm transition-colors hover:bg-surface-alt"
          >
            <X className="w-4 h-4 text-text-muted" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-colors",
                active
                  ? "bg-surface font-medium text-foreground"
                  : "text-text-secondary hover:bg-surface hover:text-foreground"
              )}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                  style={{ backgroundColor: "var(--bordeaux)" }}
                />
              )}
              <Icon
                className="w-4 h-4 shrink-0"
                style={{ color: active ? "var(--bordeaux)" : "var(--text-muted)" }}
              />
              <span className="flex-1">{item.label}</span>
              {item.href === "/portail/messages" && unreadCount > 0 && (
                <span
                  className="inline-flex items-center justify-center text-[10px] font-medium min-w-[16px] h-4 px-1 rounded-full tabular-nums"
                  style={{ backgroundColor: "var(--bordeaux)", color: "#fff" }}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div
            className="w-7 h-7 rounded-sm flex items-center justify-center shrink-0 text-[11px] font-semibold"
            style={{ backgroundColor: "var(--surface-alt)", color: "var(--text-secondary)" }}
          >
            {getInitials(profile.full_name, profile.email)}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-medium truncate leading-tight"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}
            >
              {profile.full_name ?? profile.email}
            </p>
            {profile.company && (
              <p
                className="text-[10px] truncate leading-tight"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
              >
                {profile.company}
              </p>
            )}
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              title="Se déconnecter"
              aria-label="Se déconnecter"
              className="p-1 rounded-sm transition-colors hover:bg-surface-alt"
            >
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ color: "var(--text-muted)" }}
              >
                <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function PortailShell({
  profile,
  unreadCount,
  signOutAction,
  orgLogo,
  orgName,
  children,
}: {
  profile: Profile;
  unreadCount: number;
  signOutAction: () => Promise<void>;
  orgLogo: string | null;
  orgName: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const sidebarProps = { profile, unreadCount, signOutAction, pathname, onClose: () => setMobileOpen(false), orgLogo, orgName };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 self-start hidden max-h-[100dvh] lg:flex w-60 shrink-0 flex-col border-r border-border bg-background">
        <div className="flex h-full max-h-[100dvh] min-h-0 flex-col overflow-hidden">
          <PortailSidebar {...sidebarProps} />
        </div>
      </aside>

      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 lg:hidden"
            style={{ backgroundColor: "rgba(26,26,26,0.3)" }}
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex flex-col w-60 border-r border-border bg-background lg:hidden">
            <PortailSidebar {...sidebarProps} />
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile topbar */}
        <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-3 border-b border-border bg-surface px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            className="p-1 -ml-1 rounded-sm transition-colors hover:bg-surface-alt"
          >
            <Menu className="w-5 h-5 text-text-muted" />
          </button>
          <span>
            <OrgLogo orgLogo={orgLogo} orgName={orgName} />
          </span>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}