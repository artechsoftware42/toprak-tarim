"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

type HeroIntroProps = {
  isAppReady: boolean;
  onComplete: () => void;
};

type Phase = "intro" | "expand" | "open";

const REVEAL_EVENT = "toprak-brand-reveal-complete";

const MINIMUM_INTRO_TIME = 3000;
const LINE_EXPAND_TIME = 550;
const LOGO_MOVE_TIME = 1.45;
const CURTAIN_MOVE_TIME = 1.3;
const SPLIT_OFFSET = 64;

export default function HeroIntro({ isAppReady, onComplete }: HeroIntroProps) {
  const revealStartedRef = useRef(false);

  const [phase, setPhase] = useState<Phase>("intro");

  const [logoVisible, setLogoVisible] = useState(false);

  const [lineVisible, setLineVisible] = useState(false);

  const [captionVisible, setCaptionVisible] = useState(false);

  const [minimumTimePassed, setMinimumTimePassed] = useState(false);

  const [isVisible, setIsVisible] = useState(true);

  const [handoff, setHandoff] = useState(false);

  const [logoWidth, setLogoWidth] = useState<number | null>(null);

  const [target, setTarget] = useState({
    x: 0,
    y: 0,
  });

  const measureHeaderLogo = useCallback(() => {
    const headerLogo = document.querySelector<HTMLElement>(
      "[data-header-logo-target]",
    );

    if (!headerLogo) return;

    const rect = headerLogo.getBoundingClientRect();

    setLogoWidth(rect.width);

    setTarget({
      x: rect.left + rect.width / 2 - window.innerWidth / 2,

      y: rect.top + rect.height / 2 - window.innerHeight / 2,
    });
  }, []);

  useEffect(() => {
    measureHeaderLogo();

    window.addEventListener("resize", measureHeaderLogo);

    return () => {
      window.removeEventListener("resize", measureHeaderLogo);
    };
  }, [measureHeaderLogo]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const logoTimer = window.setTimeout(() => {
      setLogoVisible(true);
    }, 120);

    const lineTimer = window.setTimeout(() => {
      setLineVisible(true);
    }, 650);

    const captionTimer = window.setTimeout(() => {
      setCaptionVisible(true);
    }, 1150);

    const minimumTimer = window.setTimeout(() => {
      setMinimumTimePassed(true);
    }, MINIMUM_INTRO_TIME);

    return () => {
      window.clearTimeout(logoTimer);
      window.clearTimeout(lineTimer);
      window.clearTimeout(captionTimer);
      window.clearTimeout(minimumTimer);

      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!minimumTimePassed) return;
    if (!isAppReady) return;
    if (revealStartedRef.current) return;

    revealStartedRef.current = true;

    measureHeaderLogo();

    setCaptionVisible(false);

    const expandTimer = window.setTimeout(() => {
      setPhase("expand");
    }, 250);

    const openTimer = window.setTimeout(() => {
      setPhase("open");
    }, 250 + LINE_EXPAND_TIME);

    return () => {
      window.clearTimeout(expandTimer);
      window.clearTimeout(openTimer);
    };
  }, [minimumTimePassed, isAppReady, measureHeaderLogo]);

  useEffect(() => {
    if (phase !== "open") return;

    const handoffTimer = window.setTimeout(() => {
      document.documentElement.dataset.brandRevealComplete = "true";

      window.dispatchEvent(new Event(REVEAL_EVENT));

      setHandoff(true);
    }, 1380);

    const finishTimer = window.setTimeout(() => {
      document.body.style.overflow = "";

      setIsVisible(false);
      onComplete();
    }, 1520);

    return () => {
      window.clearTimeout(handoffTimer);
      window.clearTimeout(finishTimer);
    };
  }, [phase, onComplete]);

  if (!isVisible) return null;

  const splitPosition = `calc(50% + ${SPLIT_OFFSET}px)`;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute left-0 top-0 w-full bg-[#090a09]"
        style={{
          height: splitPosition,
        }}
        initial={false}
        animate={{
          y: phase === "open" ? "-100%" : "0%",
        }}
        transition={{
          duration: CURTAIN_MOVE_TIME,
          ease: [0.76, 0, 0.24, 1],
        }}
      />

      <motion.div
        className="absolute bottom-0 left-0 w-full bg-[#090a09]"
        style={{
          top: splitPosition,
        }}
        initial={false}
        animate={{
          y: phase === "open" ? "100%" : "0%",
        }}
        transition={{
          duration: CURTAIN_MOVE_TIME,
          ease: [0.76, 0, 0.24, 1],
        }}
      />

      <motion.div
        className="
          pointer-events-none
          absolute
          inset-0
          z-10
          bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.075)_0%,rgba(235,235,235,0.035)_22%,rgba(200,200,200,0.012)_40%,transparent_62%)]
        "
        initial={false}
        animate={{
          opacity: phase === "open" ? 0 : 1,
        }}
        transition={{
          duration: 0.7,
        }}
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-40
          flex
          items-center
          justify-center
        "
      >
        <motion.div
          style={{
            width: logoWidth ?? undefined,
          }}
          className={logoWidth ? "" : "w-[140px] md:w-[165px]"}
          initial={{
            opacity: 0,
            y: 12,
            scale: 0.98,
          }}
          animate={
            phase === "open"
              ? {
                  x: target.x,
                  y: target.y,
                  scale: 1,
                  opacity: handoff ? 0 : 1,
                }
              : {
                  x: 0,
                  y: 0,
                  scale: 1,
                  opacity: logoVisible ? 1 : 0,
                }
          }
          transition={
            phase === "open"
              ? {
                  x: {
                    duration: LOGO_MOVE_TIME,
                    ease: [0.16, 1, 0.3, 1],
                  },
                  y: {
                    duration: LOGO_MOVE_TIME,
                    ease: [0.16, 1, 0.3, 1],
                  },
                  opacity: {
                    duration: 0.08,
                  },
                }
              : {
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }
          }
        >
          <Image
            src="/logo.png"
            alt="Toprak Tarım"
            width={180}
            height={70}
            priority
            unoptimized
            draggable={false}
            className="h-auto w-full select-none object-contain"
          />
        </motion.div>
      </div>

      <motion.div
        className="
          pointer-events-none
          absolute
          left-0
          z-30
          h-px
          w-full
          origin-center
          bg-white/45
        "
        style={{
          top: splitPosition,
        }}
        initial={{
          scaleX: 0,
          opacity: 0,
        }}
        animate={{
          scaleX: !lineVisible ? 0 : phase === "intro" ? 0.17 : 1,

          opacity: phase === "open" ? 0 : lineVisible ? 1 : 0,
        }}
        transition={{
          scaleX: {
            duration: phase === "expand" ? LINE_EXPAND_TIME / 1000 : 1.05,

            ease: [0.16, 1, 0.3, 1],
          },

          opacity: {
            duration: phase === "open" ? 0.22 : 0.5,
          },
        }}
      />

      <motion.p
        className="
          pointer-events-none
          absolute
          left-1/2
          z-30
          -translate-x-1/2
          whitespace-nowrap
          text-center
          text-[13px]
          font-medium
          tracking-[0.16em]
          text-white/75
          md:text-[15px]
        "
        style={{
          top: `calc(${splitPosition} + 24px)`,

          fontFamily: '"familjen", "familjen Fallback", sans-serif',
        }}
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: captionVisible ? 1 : 0,

          y: captionVisible ? 0 : 8,
        }}
        transition={{
          duration: 0.75,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        Bereket Topraktan Gelir
      </motion.p>
    </div>
  );
}
