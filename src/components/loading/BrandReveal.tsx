"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import logo from "@/assets/logo.png";
import motif from "@/assets/motif.png";

const MIN_DURATION = 1700;
const FAILSAFE_DURATION = 5000;
const EXIT_DURATION = 1600;

type BrandRevealProps = {
  mediaReady: boolean;
  loadingProgress: number;
  onExitStart: () => void;
  onComplete: () => void;
};

type LogoTarget = {
  x: number;
  y: number;
  scale: number;
};

export default function BrandReveal({
  mediaReady,
  loadingProgress,
  onExitStart,
  onComplete,
}: BrandRevealProps) {
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [minimumPassed, setMinimumPassed] = useState(false);
  const [failsafePassed, setFailsafePassed] = useState(false);
  const [displayedProgress, setDisplayedProgress] = useState(0);


  const [logoTarget, setLogoTarget] = useState<LogoTarget>({
    x: 0,
    y: 0,
    scale: 1,
  });

  const logoRef = useRef<HTMLDivElement | null>(null);
  const displayedProgressRef = useRef(0);

  const exitStartedRef = useRef(false);
  const completionTimerRef = useRef<number | null>(null);
  useEffect(() => () => {
    if (completionTimerRef.current !== null) window.clearTimeout(completionTimerRef.current);
    const target = document.querySelector<HTMLElement>("[data-header-logo-target]");
    if (target) target.style.opacity = "1";
  }, []);

  /* =========================================================
     ENTER
  ========================================================== */

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setEntered(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const from = displayedProgressRef.current;
    const target = Math.max(from, Math.min(100, loadingProgress));

    if (target === from) return;

    const startedAt = performance.now();
    const duration = Math.max(220, Math.min(1400, (target - from) * 14));
    let frame = 0;

    const update = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const next = progress === 1
        ? target
        : Math.floor(from + (target - from) * progress);

      if (next !== displayedProgressRef.current) {
        displayedProgressRef.current = next;
        setDisplayedProgress(next);
      }

      if (progress < 1) frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [loadingProgress]);

  /* =========================================================
     MINIMUM + FAILSAFE
  ========================================================== */

  useEffect(() => {
    const minimumTimer = window.setTimeout(() => {
      setMinimumPassed(true);
    }, MIN_DURATION);

    const failsafeTimer = window.setTimeout(() => {
      setFailsafePassed(true);
    }, FAILSAFE_DURATION);

    return () => {
      window.clearTimeout(minimumTimer);
      window.clearTimeout(failsafeTimer);
    };
  }, []);

  /* =========================================================
     PREVENT SCROLL
  ========================================================== */

  useEffect(() => {
    const preventScroll = (event: Event) => {
      event.preventDefault();
    };

    const preventKeyboardScroll = (
      event: KeyboardEvent
    ) => {
      if (
        [
          "Space",
          "ArrowUp",
          "ArrowDown",
          "PageUp",
          "PageDown",
          "Home",
          "End",
        ].includes(event.code)
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener(
      "wheel",
      preventScroll,
      {
        passive: false,
      }
    );

    window.addEventListener(
      "touchmove",
      preventScroll,
      {
        passive: false,
      }
    );

    window.addEventListener(
      "keydown",
      preventKeyboardScroll
    );

    return () => {
      window.removeEventListener(
        "wheel",
        preventScroll
      );

      window.removeEventListener(
        "touchmove",
        preventScroll
      );

      window.removeEventListener(
        "keydown",
        preventKeyboardScroll
      );
    };
  }, []);

  /* =========================================================
     EXIT
  ========================================================== */

  useEffect(() => {
    if (!minimumPassed) return;

    if (
      !failsafePassed &&
      (!mediaReady || displayedProgress < loadingProgress)
    ) {
      return;
    }

    if (exitStartedRef.current) {
      return;
    }

    exitStartedRef.current = true;

    const source =
      logoRef.current?.getBoundingClientRect();

    const headerLogo =
      document.querySelector<HTMLElement>(
        "[data-header-logo-target]"
      );

    const target =
      headerLogo?.getBoundingClientRect();

    if (source && target && headerLogo) {
      setLogoTarget({
        x:
          target.left +
          target.width / 2 -
          (source.left +
            source.width / 2),

        y:
          target.top +
          target.height / 2 -
          (source.top +
            source.height / 2),

        scale:
          target.width /
          source.width,
      });

      headerLogo.style.opacity = "0";
    }

    setExiting(true);

    onExitStart();

    completionTimerRef.current =
      window.setTimeout(() => {
        if (headerLogo) {
          headerLogo.style.opacity = "1";
        }

        onComplete();
      }, EXIT_DURATION);

  }, [
    minimumPassed,
    mediaReady,
    failsafePassed,
    loadingProgress,
    displayedProgress,
    onExitStart,
    onComplete,
  ]);

  /* =========================================================
     LOGO ARRIVAL
  ========================================================== */

  const handleLogoArrival = () => {
    if (!exiting) return;

    const headerLogo =
      document.querySelector<HTMLElement>(
        "[data-header-logo-target]"
      );

    if (headerLogo) {
      headerLogo.style.opacity = "1";
    }
  };

  return (
    <div
      aria-hidden="true"
      className="
        fixed inset-0
        z-[9999]
        overflow-hidden
      "
    >
      {/* =====================================================
          TOP PANEL
      ====================================================== */}

      <motion.div
        initial={false}
        animate={{
          y: exiting
            ? "-100%"
            : "0%",
        }}
        transition={{
          delay: exiting
            ? 0.56
            : 0,

          duration: 0.96,

          ease: [
            0.76,
            0,
            0.24,
            1,
          ],
        }}
        className="
          absolute
          left-0
          top-0

          h-[calc(50%+1px)]
          w-full

          bg-[#000000]

          will-change-transform
        "
      />

      {/* =====================================================
          BOTTOM PANEL
      ====================================================== */}

      <motion.div
        initial={false}
        animate={{
          y: exiting
            ? "100%"
            : "0%",
        }}
        transition={{
          delay: exiting
            ? 0.56
            : 0,

          duration: 0.96,

          ease: [
            0.76,
            0,
            0.24,
            1,
          ],
        }}
        className="
          absolute
          bottom-0
          left-0

          h-[calc(50%+1px)]
          w-full

          bg-[#000000]

          will-change-transform
        "
      />

      {/* =====================================================
          RIGHT MOTIF
          
          Tam ekran yüksekliğinde.
          Sağ kenardan biraz içeride.
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          x: 18,
        }}
        animate={{
          opacity:
            entered && !exiting
              ? 0.22
              : 0,

          x:
            entered && !exiting
              ? 0
              : 18,
        }}
        transition={{
          duration: exiting
            ? 0.2
            : 0.9,

          delay:
            entered &&
            !exiting
              ? 0.25
              : 0,

          ease: [
            0.16,
            1,
            0.3,
            1,
          ],
        }}
        className="
          pointer-events-none

          absolute
          right-[4vw]
          top-0
          z-10

          h-full
        "
      >
        <Image
          src={motif}
          alt=""
          priority
          draggable={false}
          className="
            h-full
            w-auto

            select-none
            object-contain
          "
        />
      </motion.div>

      {/* =====================================================
          TOP COPY
      ====================================================== */}

      <motion.p
        initial={{
          opacity: 0,
          y: -4,
        }}
        animate={{
          opacity:
            entered && !exiting
              ? 0.25
              : 0,

          y:
            entered && !exiting
              ? 0
              : -4,
        }}
        transition={{
          duration: exiting
            ? 0.18
            : 0.6,

          delay:
            entered &&
            !exiting
              ? 0.2
              : 0,

          ease: [
            0.16,
            1,
            0.3,
            1,
          ],
        }}
        className="
          absolute
          left-1/2
          top-8
          z-20

          -translate-x-1/2

          whitespace-nowrap

          text-[8px]
          font-medium
          uppercase
          tracking-[0.38em]
          text-white

          md:top-10
          md:text-[9px]
        "
      >
        DOĞADAN GELECEĞE
      </motion.p>

      {/* =====================================================
          LOGO
      ====================================================== */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          z-50

          -translate-x-1/2
          -translate-y-1/2
        "
      >
        <motion.div
          ref={logoRef}
          initial={{
            opacity: 0,
            scale: 0.96,
            x: 0,
            y: 0,
          }}
          animate={
            exiting
              ? {
                  x: logoTarget.x,
                  y: logoTarget.y,
                  scale:
                    logoTarget.scale,
                  opacity: 1,
                }
              : {
                  x: 0,
                  y: 0,

                  scale: entered
                    ? 1
                    : 0.96,

                  opacity: entered
                    ? 1
                    : 0,
                }
          }
          transition={
            exiting
              ? {
                  duration: 1.15,

                  ease: [
                    0.19,
                    1,
                    0.22,
                    1,
                  ],
                }
              : {
                  duration: 0.75,

                  ease: [
                    0.16,
                    1,
                    0.3,
                    1,
                  ],
                }
          }
          onAnimationComplete={
            handleLogoArrival
          }
          className="will-change-transform"
        >
          <Image
            src={logo}
            alt=""
            priority
            draggable={false}
            className="
              h-auto
              w-[140px]

              select-none
              object-contain

              md:w-[165px]
            "
          />
        </motion.div>
      </div>

      {/* =====================================================
          LOADING
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 6,
        }}
        animate={{
          opacity:
            entered && !exiting
              ? 1
              : 0,

          y:
            entered && !exiting
              ? 0
              : 6,
        }}
        transition={{
          duration: exiting
            ? 0.16
            : 0.65,

          delay:
            entered &&
            !exiting
              ? 0.32
              : 0,

          ease: [
            0.16,
            1,
            0.3,
            1,
          ],
        }}
        className="
          absolute
          left-1/2
          top-[calc(50%+88px)]
          z-30

          -translate-x-1/2

          text-center

          md:top-[calc(50%+102px)]
        "
      >
        <p
          className="
            text-[8px]
            font-medium
            uppercase
            tracking-[0.34em]
            text-white/25
          "
        >
          Yükleniyor
        </p>

        <div
          className="
            mt-2

            flex
            items-baseline
            justify-center
            gap-1.5

            font-mono
            tabular-nums
          "
        >
          <span
            className="
              min-w-[34px]

              text-right

              text-[24px]
              font-normal
              leading-none
              tracking-[-0.06em]
              text-white/75

              md:text-[26px]
            "
          >
            %{displayedProgress}
          </span>

          <span
            className="
              text-[9px]
              font-normal
              tracking-[0.08em]
              text-white/25
            "
          >
            / 100
          </span>
        </div>
      </motion.div>

      {/* =====================================================
          SLOGAN
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 6,
        }}
        animate={{
          opacity:
            entered && !exiting
              ? 1
              : 0,

          y:
            entered && !exiting
              ? 0
              : 6,
        }}
        transition={{
          duration: exiting
            ? 0.18
            : 0.6,

          delay:
            entered &&
            !exiting
              ? 0.38
              : 0,

          ease: [
            0.16,
            1,
            0.3,
            1,
          ],
        }}
        className="
          absolute
          bottom-8
          left-1/2
          z-20

          -translate-x-1/2

          whitespace-nowrap

          md:bottom-10
        "
      >
        <p
          className="
            text-[9px]
            font-medium
            uppercase
            tracking-[0.24em]
            text-white/30

            sm:text-[10px]
          "
        >
          Bereket topraktan gelir.
        </p>
      </motion.div>

      {/* =====================================================
          REVEAL LINE
      ====================================================== */}

      {exiting && (
        <div
          className="
            pointer-events-none

            absolute
            left-0
            top-1/2
            z-40

            h-px
            w-full

            -translate-y-1/2
          "
        >
          <motion.div
            initial={{
              scaleX: 0,
              opacity: 1,
            }}
            animate={{
              scaleX: 1,
              opacity: 0,
            }}
            transition={{
              scaleX: {
                delay: 0.18,
                duration: 0.38,

                ease: [
                  0.76,
                  0,
                  0.24,
                  1,
                ],
              },

              opacity: {
                delay: 0.56,
                duration: 0.14,
                ease: "linear",
              },
            }}
            style={{
              transformOrigin:
                "center center",
            }}
            className="
              h-full
              w-full

              bg-white/55

              will-change-transform
            "
          />
        </div>
      )}
    </div>
  );
}
