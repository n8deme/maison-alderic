"use client";

import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export type ClientCardData = {
  id: string;
  fullName: string;
  email: string | null;
  activeCount: number;
  lastDossier: { reference: string; title: string } | null;
};

function stopCardNavigate(e: MouseEvent) {
  e.stopPropagation();
}

function ClientProfileButton({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={stopCardNavigate}
      className={className}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {children}
    </Link>
  );
}

export function ClientCard({ id, fullName, email, activeCount, lastDossier }: ClientCardData) {
  const router = useRouter();
  const profileHref = `/portail-avocat/clients/${id}`;
  const nouveauHref = `/portail-avocat/dossiers/nouveau?client_id=${encodeURIComponent(id)}`;

  function goProfile() {
    router.push(profileHref);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goProfile();
    }
  }

  const displayName = fullName || "Client";

  return (
    <div
      tabIndex={0}
      aria-label={`${displayName}, afficher le profil client`}
      onClick={goProfile}
      onKeyDown={onKeyDown}
      className={cn(
        "client-card-portail cursor-pointer rounded-md border border-[#EFEDE6] bg-white p-6 outline-none md:p-8",
        "focus-visible:ring-2 focus-visible:ring-[#7A1F2B] focus-visible:ring-offset-2",
      )}
    >
      <div>
        <h2
          className="text-xl font-medium tracking-tight text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {displayName}
        </h2>
        <p className="mt-1 text-sm text-[#5C5A55]" style={{ fontFamily: "var(--font-body)" }}>
          {email ?? "—"}
        </p>
        <div className="mt-4 space-y-1">
          <p className="text-sm text-[#5C5A55]" style={{ fontFamily: "var(--font-body)" }}>
            Dossiers actifs : {activeCount}
          </p>
          <p className="text-sm text-[#5C5A55]" style={{ fontFamily: "var(--font-body)" }}>
            Dernier dossier :{" "}
            {lastDossier ? (
              <>
                <span className="font-mono text-[#5C5A55]">{lastDossier.reference}</span>
                <span> — {lastDossier.title}</span>
              </>
            ) : (
              "Aucun"
            )}
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3 border-t border-[#EFEDE6] pt-4">
        <ClientProfileButton
          href={profileHref}
          className={cn(
            "inline-flex flex-1 items-center justify-center rounded-md bg-[#1A1A1A] px-4 py-2 text-sm font-medium text-white",
            "transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "hover:-translate-y-px hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
          )}
        >
          Voir profil
        </ClientProfileButton>
        <Link
          href={nouveauHref}
          onClick={stopCardNavigate}
          className={cn(
            "inline-flex flex-1 items-center justify-center rounded-md border border-[#E5E2DB] bg-transparent px-4 py-2 text-sm font-medium text-[#1A1A1A]",
            "transition-colors duration-200",
            "hover:bg-[#F8F7F4]",
          )}
          style={{ fontFamily: "var(--font-body)" }}
        >
          Nouveau dossier
        </Link>
      </div>
    </div>
  );
}
