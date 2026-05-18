"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type DossiersFiltersAvocat = { id: string; full_name: string };

const DEBOUNCE_MS = 300;

const selectBase =
  "min-w-[160px] max-w-[200px] rounded-md border bg-white px-3 py-2 font-sans text-sm text-[#1A1A1A] outline-none transition-[border-color] duration-150 focus:outline-none focus:ring-2 focus:ring-[#7A1F2B] focus:ring-offset-1 focus:ring-offset-white";

const inputBase =
  "w-full rounded-md border bg-white py-2 pl-9 pr-3 font-sans text-sm text-[#1A1A1A] outline-none transition-[border-color] duration-150 focus:outline-none focus:ring-2 focus:ring-[#7A1F2B] focus:ring-offset-1 focus:ring-offset-white";

function filterFieldClass(active: boolean, extra?: string) {
  return cn(extra, active ? "border-[#7A1F2B]" : "border-[#E5E2DB]");
}

function buildPath(status: string, type: string, avocat: string, q: string) {
  const p = new URLSearchParams();
  if (status && status !== "all") p.set("status", status);
  if (type && type !== "all") p.set("type", type);
  if (avocat && avocat !== "all") p.set("avocat", avocat);
  const qt = q.trim();
  if (qt) p.set("q", qt);
  const qs = p.toString();
  return qs ? `/portail-avocat/dossiers?${qs}` : "/portail-avocat/dossiers";
}

export function DossiersFiltersForm({
  initialStatus,
  initialType,
  initialAvocat,
  initialQ,
  avocats,
}: {
  initialStatus: string;
  initialType: string;
  initialAvocat: string;
  initialQ: string;
  avocats: DossiersFiltersAvocat[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus || "all");
  const [type, setType] = useState(initialType || "all");
  const [avocat, setAvocat] = useState(initialAvocat || "all");
  const [q, setQ] = useState(initialQ ?? "");

  useEffect(() => {
    setStatus(initialStatus || "all");
    setType(initialType || "all");
    setAvocat(initialAvocat || "all");
    setQ(initialQ ?? "");
  }, [initialStatus, initialType, initialAvocat, initialQ]);

  const stateRef = useRef({ status, type, avocat, q });
  stateRef.current = { status, type, avocat, q };

  useEffect(() => {
    const urlQ = initialQ ?? "";
    if (q === urlQ) return;
    const id = window.setTimeout(() => {
      const s = stateRef.current;
      router.push(buildPath(s.status, s.type, s.avocat, s.q));
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [q, initialQ, router]);

  const hasActive =
    status !== "all" || type !== "all" || avocat !== "all" || q.trim() !== "";

  function pushNow(next: { status: string; type: string; avocat: string; q: string }) {
    router.push(buildPath(next.status, next.type, next.avocat, next.q));
  }

  return (
    <form
      method="GET"
      action="/portail-avocat/dossiers"
      className="mb-4 flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        pushNow({ status, type, avocat, q });
      }}
    >
      <select
        name="status"
        value={status}
        aria-label="Filtrer par statut"
        onChange={(e) => {
          const v = e.target.value;
          setStatus(v);
          pushNow({ status: v, type, avocat, q });
        }}
        className={filterFieldClass(status !== "all", selectBase)}
        style={{ fontFamily: "var(--font-body)" }}
      >
        <option value="all">Statut : tous</option>
        <option value="active">Actif</option>
        <option value="pending">En attente</option>
        <option value="archived">Archivé</option>
        <option value="won">Clôturé</option>
        <option value="lost">Perdu</option>
      </select>
      <select
        name="type"
        value={type}
        aria-label="Filtrer par type"
        onChange={(e) => {
          const v = e.target.value;
          setType(v);
          pushNow({ status, type: v, avocat, q });
        }}
        className={filterFieldClass(type !== "all", selectBase)}
        style={{ fontFamily: "var(--font-body)" }}
      >
        <option value="all">Type : tous</option>
        <option value="M&A">M&A</option>
        <option value="Litigation">Litigation</option>
        <option value="Tax">Tax</option>
        <option value="Corporate">Corporate</option>
        <option value="PE">PE</option>
        <option value="Restructuring">Restructuring</option>
      </select>
      <select
        name="avocat"
        value={avocat}
        aria-label="Filtrer par avocat"
        onChange={(e) => {
          const v = e.target.value;
          setAvocat(v);
          pushNow({ status, type, avocat: v, q });
        }}
        className={filterFieldClass(avocat !== "all", selectBase)}
        style={{ fontFamily: "var(--font-body)" }}
      >
        <option value="all">Avocat : tous</option>
        {avocats.map((a) => (
          <option key={a.id} value={a.id}>
            {a.full_name}
          </option>
        ))}
      </select>
      <div className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8B887F]"
          aria-hidden
        />
        <input
          name="q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher par titre ou numéro"
          autoComplete="off"
          className={filterFieldClass(q.trim() !== "", inputBase)}
          style={{ fontFamily: "var(--font-body)" }}
        />
      </div>
      {hasActive ? (
        <Link
          href="/portail-avocat/dossiers"
          className="ml-auto shrink-0 cursor-pointer text-xs font-medium text-[#7A1F2B] no-underline hover:underline"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Effacer les filtres
        </Link>
      ) : null}
    </form>
  );
}
