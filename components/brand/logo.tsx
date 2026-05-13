import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "wordmark" | "mark";
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ variant = "wordmark", className, width, height }: LogoProps) {
  const src = variant === "wordmark" ? "/logo.svg" : "/mark.svg";
  const defaultW = variant === "wordmark" ? 200 : 40;
  const defaultH = variant === "wordmark" ? 40 : 40;

  return (
    <Image
      src={src}
      alt="Maison Aldéric & Associés"
      width={width ?? defaultW}
      height={height ?? defaultH}
      priority
      className={cn("h-auto", className)}
    />
  );
}
