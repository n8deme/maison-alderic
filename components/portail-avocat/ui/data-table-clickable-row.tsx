"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function DataTableClickableRow({
  href,
  children,
  className,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel: string;
}) {
  const router = useRouter();

  function go() {
    router.push(href);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTableRowElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go();
    }
  }

  return (
    <tr
      role="link"
      tabIndex={0}
      aria-label={ariaLabel}
      className={cn(
        "cursor-pointer border-b border-[#EFEDE6] bg-white transition-[background-color] duration-150 ease-in-out last:border-b-0 hover:bg-[#F8F7F4] outline-none focus-visible:bg-[#F8F7F4] focus-visible:ring-2 focus-visible:ring-[#7A1F2B]/25 focus-visible:ring-offset-2",
        className,
      )}
      onClick={go}
      onKeyDown={onKeyDown}
    >
      {children}
    </tr>
  );
}
