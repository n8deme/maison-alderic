import type { ReactNode } from "react";
import { FileX } from "lucide-react";
import { cn } from "@/lib/utils";

export function DataTable({ children }: { children: ReactNode }) {
  return (
    <div
      className="overflow-hidden rounded-lg border border-[#E5E2DB] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function DataTableTable({ children, className }: { children: ReactNode; className?: string }) {
  return <table className={cn("w-full min-w-full border-collapse text-left", className)}>{children}</table>;
}

export function DataTableHead({ children }: { children: ReactNode }) {
  return <thead className="bg-[#F8F7F4]">{children}</thead>;
}

export function DataTableHeadRow({ children }: { children: ReactNode }) {
  return <tr className="border-b border-[#E5E2DB]">{children}</tr>;
}

export function DataTableHeadCell({
  children,
  className,
  align = "left",
}: {
  children: ReactNode;
  className?: string;
  align?: "left" | "right";
}) {
  return (
    <th
      className={cn(
        "px-6 py-3 text-left align-middle font-sans text-xs font-medium uppercase tracking-wider text-[#5C5A55]",
        align === "right" && "text-right",
        className,
      )}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {children}
    </th>
  );
}

export function DataTableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function DataTableRow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <tr
      className={cn(
        "border-b border-[#EFEDE6] bg-white last:border-b-0",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function DataTableCell({
  children,
  className,
  align = "left",
  mono,
  amount,
}: {
  children: ReactNode;
  className?: string;
  align?: "left" | "right";
  mono?: boolean;
  amount?: boolean;
}) {
  return (
    <td
      className={cn(
        "px-6 py-4 align-middle font-sans text-sm font-normal text-[#1A1A1A]",
        align === "right" && "text-right",
        mono && "font-mono text-xs text-[#5C5A55]",
        amount && "text-right tabular-nums [font-feature-settings:'tnum']",
        className,
      )}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {children}
    </td>
  );
}

export function DataTableEmptyState({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-16 text-center align-middle">
        <div className="flex flex-col items-center gap-2 text-[#8B887F]" style={{ fontFamily: "var(--font-body)" }}>
          <FileX className="h-8 w-8 opacity-70" aria-hidden />
          <p className="text-sm">Aucun résultat</p>
        </div>
      </td>
    </tr>
  );
}

export function dataTableActionLinkClass() {
  return "font-medium text-[#7A1F2B] no-underline hover:underline underline-offset-2";
}
