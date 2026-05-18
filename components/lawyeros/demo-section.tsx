"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const IMAGE_WIDTH = 1300;
const IMAGE_HEIGHT = 943;
const FRAME_MAX_W = 1100;
/** Hauteur d’affichage pour next/image à largeur 1100 (ratio fichier source) */
const DISPLAY_HEIGHT = Math.round((FRAME_MAX_W * IMAGE_HEIGHT) / IMAGE_WIDTH);

const SHADOW_REST =
  "0 20px 60px -20px rgba(0, 0, 0, 0.15), 0 8px 24px -8px rgba(0, 0, 0, 0.08)";
const SHADOW_HOVER =
  "0 30px 80px -20px rgba(122, 31, 43, 0.25), 0 12px 32px -8px rgba(0, 0, 0, 0.12)";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const spring = { stiffness: 150, damping: 20 };

export function DemoSection() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [tiltAllowed, setTiltAllowed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const apply = () => setTiltAllowed(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const tiltActive = tiltAllowed && !prefersReduced;

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const targetRy = useTransform(mouseX, [0, 1], [5, -5]);
  const targetRx = useTransform(mouseY, [0, 1], [-5, 5]);
  const rotateY = useSpring(targetRy, spring);
  const rotateX = useSpring(targetRx, spring);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tiltActive || !frameRef.current) return;
      const rect = frameRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
    },
    [tiltActive, mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return (
    <section
      id="demo"
      className="px-6 py-32 md:px-12 md:py-40 lg:px-20"
      style={{ backgroundColor: "var(--surface-alt)" }}
    >
      <div className="mx-auto max-w-7xl text-center">
        <p
          className="text-xs font-medium uppercase tracking-widest"
          style={{
            color: "#8B887F",
            fontFamily: "var(--font-body)",
          }}
        >
          Démo live
        </p>

        <h2 className="mt-4 max-w-4xl mx-auto text-4xl font-heading font-medium tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Testez le portail. Aucune inscription requise.
        </h2>

        <p
          className="mx-auto mt-6 max-w-2xl text-lg font-normal"
          style={{ color: "#5C5A55", fontFamily: "var(--font-body)" }}
        >
          Connectez-vous en un clic avec un compte démo pré-configuré. Vous êtes Aldéric Vermeulen, associé fondateur, et
          vous découvrez vraiment l&apos;outil — pas une vidéo, pas un mockup.
        </p>

        <div className="relative mx-auto mt-16 max-w-[1100px]" style={{ perspective: "1500px" }}>
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(ellipse 68% 58% at 50% 44%, rgb(122, 31, 43) 0%, transparent 72%)",
              opacity: isHovered ? 0.15 : 0.08,
              filter: "blur(80px)",
              transition: "opacity 400ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            aria-hidden
          />

          <motion.div
            ref={frameRef}
            className="browser-frame overflow-hidden rounded-[12px] border bg-surface"
            style={{
              borderColor: "#E5E2DB",
              transformStyle: "preserve-3d",
              rotateX: tiltActive ? rotateX : 0,
              rotateY: tiltActive ? rotateY : 0,
            }}
            animate={{ boxShadow: isHovered ? SHADOW_HOVER : SHADOW_REST }}
            transition={{ boxShadow: { duration: 0.4, ease: EASE } }}
            onMouseMove={tiltActive ? handleMouseMove : undefined}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="browser-titlebar flex h-9 items-center border-b px-4"
              style={{
                backgroundColor: "#F2F0EB",
                borderColor: "#E5E2DB",
                gap: "12px",
                paddingLeft: "16px",
                paddingRight: "16px",
              }}
            >
              <div className="browser-dots flex shrink-0" style={{ gap: "8px" }}>
                <span className="dot dot-red h-3 w-3 rounded-full" style={{ backgroundColor: "#FF5F57" }} />
                <span className="dot dot-yellow h-3 w-3 rounded-full" style={{ backgroundColor: "#FEBC2E" }} />
                <span className="dot dot-green h-3 w-3 rounded-full" style={{ backgroundColor: "#28C840" }} />
              </div>
              <div className="browser-url text-left text-sm font-mono" style={{ color: "#8B887F" }}>
                lawyeros.app/portail-avocat
              </div>
            </div>

            <div className="browser-content w-full bg-white">
              <Image
                src="/lawyeros/dashboard-demo.png"
                alt="Dashboard avocat Maison Aldéric - portail LawyerOS"
                width={FRAME_MAX_W}
                height={DISPLAY_HEIGHT}
                className="h-auto w-full object-cover"
                priority
                sizes="(min-width: 1100px) 1100px, 100vw"
              />
            </div>
          </motion.div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/portail-avocat?__tenant=maison-alderic"
            className="inline-flex rounded-md px-8 py-4 text-base font-medium text-white transition-[transform,box-shadow] duration-[250ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1F2B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2F0EB] [&:hover]:-translate-y-0.5 [&:hover]:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)]"
            style={{
              backgroundColor: "#1A1A1A",
              fontFamily: "var(--font-body)",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            Vue avocat →
          </Link>
          <Link
            href="/portail?__tenant=maison-alderic"
            className="inline-flex rounded-md px-8 py-4 text-base font-medium text-white transition-[transform,box-shadow] duration-[250ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1F2B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2F0EB] [&:hover]:-translate-y-0.5 [&:hover]:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)]"
            style={{
              backgroundColor: "#1A1A1A",
              fontFamily: "var(--font-body)",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            Vue client →
          </Link>
        </div>
      </div>
    </section>
  );
}
