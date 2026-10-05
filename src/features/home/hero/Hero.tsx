"use client";

import { ContentText, useSectionContent } from "@/features/home/content/HomeContent";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  type Variants,
} from "framer-motion";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useInitialLoading } from "@/components/loading/InitialLoading";

/* =========================================================
   CONFIG
========================================================= */

const SLIDE_DURATION = 10000;

/* =========================================================
   TYPES
========================================================= */

type Slide = {
  id: number;
  type: "video" | "image";
  src: string;
  eyebrow: string;
  title: string;
  description: string;
};

/* =========================================================
   SLIDES
========================================================= */

const slides: Slide[] = [
  {
    id: 2,
    type: "image",
    src: "/hero-1.png",
    eyebrow: "slide2_eyebrow",
    title: "slide2_title",
    description: "slide2_description",
  },
  {
    id: 3,
    type: "image",
    src: "/hero-2.png",
    eyebrow: "slide3_eyebrow",
    title: "slide3_title",
    description: "slide3_description",
  },
  {
    id: 1,
    type: "video",
    src: "/hero-vid3-web.webm",
    eyebrow: "slide1_eyebrow",
    title: "slide1_title",
    description: "slide1_description",
  },
];

const VIDEO_SLIDE_INDEX = slides.findIndex((slide) => slide.type === "video");

/* =========================================================
   MOTION VARIANTS
========================================================= */

const heroContentVariants: Variants = {
  hidden: {},

  visible: {
    transition: {
      delayChildren: 0.06,
      staggerChildren: 0.11,
    },
  },
};

const heroItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const heroTitleVariants: Variants = {
  hidden: {
    opacity: 0,
    y: "105%",
  },

  visible: {
    opacity: 1,
    y: "0%",

    transition: {
      duration: 1.05,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* =========================================================
   HERO
========================================================= */

export default function Hero() {
  const { section, text, locale } = useSectionContent("hero");
  const [failedMedia, setFailedMedia] = useState<Record<number, boolean>>({});
  const { opening: revealOpening, done: revealDone } = useInitialLoading();
  /* =======================================================
     SLIDER STATE
  ======================================================== */

  const [activeSlide, setActiveSlide] = useState(0);

  const [progress, setProgress] = useState(0);

  const [isPaused, setIsPaused] = useState(false);

  /* =======================================================
     REVEAL STATE
  ======================================================== */

  /* =======================================================
     REFS
  ======================================================== */

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const elapsedRef = useRef(0);

  const lastTickRef =
    useRef<number | null>(null);

  /**
   * Gerçek slide değişimini takip ediyor.
   *
   * Reveal bittikten sonra video'nun gereksiz yere
   * tekrar currentTime = 0 olmasını engelliyor.
   */
  const previousSlideRef = useRef(0);

  /* =======================================================
     SLIDER HELPERS
  ======================================================== */

  const resetSlideTimer = useCallback(() => {
    elapsedRef.current = 0;

    lastTickRef.current = null;

    setProgress(0);
  }, []);

  const nextSlide = useCallback(() => {
    setActiveSlide(
      (current) =>
        (current + 1) % slides.length
    );

    resetSlideTimer();
  }, [resetSlideTimer]);

  const previousSlide = useCallback(() => {
    setActiveSlide(
      (current) =>
        (current - 1 + slides.length) %
        slides.length
    );

    resetSlideTimer();
  }, [resetSlideTimer]);

  const goToSlide = useCallback(
    (index: number) => {
      if (index === activeSlide) {
        return;
      }

      setActiveSlide(index);

      resetSlideTimer();
    },
    [
      activeSlide,
      resetSlideTimer,
    ]
  );

  const togglePause = useCallback(() => {
    setIsPaused(
      (current) => !current
    );
  }, []);

  /* =======================================================
     REVEAL START

     Video burada başa SARILMIYOR.
     Direkt mevcut ilk frame'den play.
  ======================================================== */

  useEffect(() => {
    if (revealOpening && activeSlide === VIDEO_SLIDE_INDEX && !isPaused) {
      videoRef.current?.play().catch(() => {});
    }
  }, [activeSlide, revealOpening, isPaused]);

  /* =======================================================
     SLIDE TIMER
  ======================================================== */

  useEffect(() => {
    if (!revealDone || isPaused) {
      lastTickRef.current = null;

      return;
    }

    lastTickRef.current =
      performance.now();

    const interval =
      window.setInterval(() => {
        const now =
          performance.now();

        const previousTick =
          lastTickRef.current ??
          now;

        const delta =
          now - previousTick;

        elapsedRef.current +=
          delta;

        lastTickRef.current =
          now;

        const percentage =
          Math.min(
            (elapsedRef.current /
              SLIDE_DURATION) *
              100,
            100
          );

        setProgress(percentage);

        if (
          elapsedRef.current >=
          SLIDE_DURATION
        ) {
          window.clearInterval(
            interval
          );

          nextSlide();
        }
      }, 100);

    return () => {
      window.clearInterval(
        interval
      );

      lastTickRef.current =
        null;
    };
  }, [
    activeSlide,
    isPaused,
    revealDone,
    nextSlide,
  ]);

  /* =======================================================
     VIDEO — REAL SLIDE CHANGES ONLY

     Reveal complete olduğunda video tekrar başa sarılmaz.

     Sadece:
     video slide -> başka slide -> tekrar video slide

     durumunda 0'a döner.
  ======================================================== */

  useEffect(() => {
    if (!revealDone) {
      return;
    }

    const previousSlide =
      previousSlideRef.current;

    if (
      previousSlide ===
      activeSlide
    ) {
      return;
    }

    previousSlideRef.current =
      activeSlide;

    const video =
      videoRef.current;

    if (!video) return;

    if (activeSlide === VIDEO_SLIDE_INDEX) {
      video.currentTime = 0;

      if (!isPaused) {
        video
          .play()
          .catch(() => {});
      }

      return;
    }

    video.pause();
  }, [
    activeSlide,
    revealDone,
    isPaused,
  ]);

  /* =======================================================
     VIDEO PAUSE / PLAY

     currentTime'a dokunmaz.
  ======================================================== */

  useEffect(() => {
    if (!revealDone) {
      return;
    }

    if (activeSlide !== VIDEO_SLIDE_INDEX) {
      return;
    }

    const video =
      videoRef.current;

    if (!video) return;

    if (isPaused) {
      video.pause();
    } else {
      video
        .play()
        .catch(() => {});
    }
  }, [
    isPaused,
    activeSlide,
    revealDone,
  ]);

  /* =======================================================
     RENDER
  ======================================================== */

  return (
    <>
      <section
        lang={locale}
        className="
          relative
          h-[100svh]
          min-h-[650px]
          w-full
          overflow-hidden
          bg-black
        "
      >
        {/* =================================================
            MEDIA
        ================================================== */}

        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{
            scale:
              revealOpening ||
              revealDone
                ? 1
                : 1.018,
          }}
          transition={{
            duration: 1.7,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {slides.map(
            (slide, index) => {
              const isActive =
                activeSlide ===
                index;
              const externalMedia = failedMedia[slide.id] ? null : section.media?.[`slide${slide.id}`]?.externalUrl;
              const mediaSource = externalMedia || slide.src;

              return (
                <div
                  key={slide.id}
                  className={`
                    absolute inset-0

                    transition-opacity
                    duration-1000
                    ease-in-out

                    ${
                      isActive
                        ? "z-10 opacity-100"
                        : "pointer-events-none z-0 opacity-0"
                    }
                  `}
                >
                  {slide.type ===
                  "video" ? (
                    <video
                      ref={videoRef}
                      muted
                      loop
                      playsInline
                      preload={isActive || index === activeSlide + 1 ? "auto" : "metadata"}
                      controls={
                        false
                      }
                      disablePictureInPicture
                      src={externalMedia ? mediaSource : undefined}
                      onError={() => setFailedMedia(current => ({...current, [slide.id]: true}))}
                      className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                      "
                    >
                      {!externalMedia && <><source src="/hero-vid3-web-small.webm" media="(max-width: 767px)" type="video/webm" /><source src={slide.src} type="video/webm" /></>}
                    </video>
                  ) : (
                    <Image
                      src={mediaSource}
                      onError={() => setFailedMedia(current => ({...current, [slide.id]: true}))}
                      alt=""
                      fill
                      unoptimized={Boolean(externalMedia && !externalMedia.startsWith("/api/media/"))}
                      draggable={
                        false
                      }
                      sizes="100vw"
                      className="object-cover"
                    />
                  )}
                </div>
              );
            }
          )}
        </motion.div>

        {/* =================================================
            OVERLAYS
        ================================================== */}

        <div className="pointer-events-none absolute inset-0 z-20 bg-black/15" />

        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[25%] bg-gradient-to-b from-black/30 to-transparent" />

        {/* =================================================
            HERO CONTENT
        ================================================== */}

        <div
          className="
            relative
            z-30
            mx-auto

            flex
            h-full
            w-full
            max-w-[1700px]
            flex-col

            px-5
            pb-8
            pt-28

            sm:px-8
            md:px-12
            lg:px-16
            xl:px-20
          "
        >
          {/* ===============================================
              MAIN
          ================================================ */}

          <div className="flex flex-1 items-center">
            <div className="w-full">
              <AnimatePresence mode="wait">
                {revealDone && (
                  <motion.div
                    key={
                      activeSlide
                    }
                    variants={
                      heroContentVariants
                    }
                    initial="hidden"
                    animate="visible"
                    exit={{
                      opacity: 0,
                      y: -10,

                      transition: {
                        duration: 0.28,
                        ease: "easeOut",
                      },
                    }}
                    className="
                      relative
                      z-10

                      max-w-[950px]

                      lg:max-w-[720px]
                      xl:max-w-[850px]
                    "
                  >
                    {/* =======================================
                        EYEBROW
                    ======================================== */}

                    <motion.div
                      variants={
                        heroItemVariants
                      }
                      className="mb-6 flex items-center gap-4"
                    >
                      <motion.span
                        initial={{
                          scaleX: 0,
                        }}
                        animate={{
                          scaleX: 1,
                        }}
                        transition={{
                          delay: 0.16,
                          duration: 0.8,
                          ease: [
                            0.16,
                            1,
                            0.3,
                            1,
                          ],
                        }}
                        style={{
                          transformOrigin:
                            "left",
                        }}
                        className="
                          h-px
                          w-10
                          bg-white/70
                          md:w-14
                        "
                      />

                      <span
                        className="
                          text-[10px]
                          font-medium
                          uppercase
                          tracking-[0.3em]
                          text-white/75
                          md:text-xs
                        "
                      >
                        <ContentText section="hero" field={slides[activeSlide].eyebrow} />
                      </span>
                    </motion.div>

                    {/* =======================================
                        TITLE
                    ======================================== */}

                    <div className="overflow-hidden pb-[0.08em]">
                      <motion.h1
                        variants={
                          heroTitleVariants
                        }
                        className="
                          max-w-[950px]

                          text-[clamp(3.5rem,7vw,8rem)]
                          font-medium
                          leading-[0.88]
                          tracking-[-0.06em]
                          text-white
                        "
                      >
                        <ContentText section="hero" field={slides[activeSlide].title} />
                      </motion.h1>
                    </div>

                    {/* =======================================
                        DESCRIPTION
                    ======================================== */}

                    <motion.p
                      variants={
                        heroItemVariants
                      }
                      className="
                        mt-7
                        max-w-[520px]

                        text-sm
                        leading-7
                        text-white/70

                        md:mt-9
                        md:text-base
                      "
                    >
                      <ContentText section="hero" field={slides[activeSlide].description} />
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ===============================================
              BOTTOM CONTROLS
          ================================================ */}

          <motion.div
            initial={false}
            animate={
              revealDone
                ? {
                    opacity: 1,
                    y: 0,
                  }
                : {
                    opacity: 0,
                    y: 16,
                  }
            }
            transition={{
              delay:
                revealDone
                  ? 0.35
                  : 0,

              duration: 0.9,

              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
            }}
            className="
              flex
              items-end
              justify-between
              gap-6

              border-t
              border-white/20

              pt-5

              md:pt-6
            "
          >
            {/* =============================================
                INDICATORS
            ============================================== */}

            <div className="flex w-full max-w-[580px] gap-3 sm:gap-5">
              {slides.map(
                (
                  slide,
                  index
                ) => {
                  const isActive =
                    activeSlide ===
                    index;

                  return (
                    <button
                      key={
                        slide.id
                      }
                      type="button"
                      onClick={() =>
                        goToSlide(
                          index
                        )
                      }
                      aria-label={`${
                        index + 1
                      }. ${text("slideLabel")}`}
                      className="group flex-1 cursor-pointer text-left"
                    >
                      <div className="relative h-px w-full overflow-hidden bg-white/25">
                        {isActive && (
                          <span
                            className="absolute inset-y-0 left-0 bg-white"
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        )}

                        {!isActive && (
                          <span
                            className="
                              absolute
                              inset-y-0
                              left-0

                              w-0

                              bg-white/70

                              transition-all
                              duration-500

                              group-hover:w-full
                            "
                          />
                        )}
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <span
                          className={`font-mono text-[10px] tracking-[0.15em] ${
                            isActive
                              ? "text-white"
                              : "text-white/40"
                          }`}
                        >
                          0
                          {index +
                            1}
                        </span>

                        {isActive &&
                          isPaused && (
                            <span className="h-1 w-1 rounded-full bg-white/60" />
                          )}
                      </div>
                    </button>
                  );
                }
              )}
            </div>

            {/* =============================================
                BUTTONS
            ============================================== */}

            <div className="flex shrink-0 items-center gap-2">
              {/* PREVIOUS */}

              <button
                type="button"
                onClick={
                  previousSlide
                }
                aria-label={text("previous")}
                className="
                  flex
                  h-11
                  w-11
                  cursor-pointer
                  items-center
                  justify-center

                  rounded-full

                  border
                  border-white/30

                  text-white

                  transition-all
                  duration-300

                  hover:border-white
                  hover:bg-white
                  hover:text-black

                  sm:h-12
                  sm:w-12
                "
              >
                <ArrowLeft />
              </button>

              {/* PAUSE */}

              <button
                type="button"
                onClick={
                  togglePause
                }
                aria-label={
                  isPaused
                    ? text("play")
                    : text("pause")
                }
                aria-pressed={
                  isPaused
                }
                className={`
                  flex
                  h-11
                  w-11
                  cursor-pointer
                  items-center
                  justify-center

                  rounded-full
                  border

                  transition-all
                  duration-300

                  sm:h-12
                  sm:w-12

                  ${
                    isPaused
                      ? "border-white bg-white text-black"
                      : "border-white/30 text-white hover:border-white hover:bg-white hover:text-black"
                  }
                `}
              >
                {isPaused ? (
                  <PlayIcon />
                ) : (
                  <PauseIcon />
                )}
              </button>

              {/* NEXT */}

              <button
                type="button"
                onClick={
                  nextSlide
                }
                aria-label={text("next")}
                className="
                  flex
                  h-11
                  w-11
                  cursor-pointer
                  items-center
                  justify-center

                  rounded-full

                  border
                  border-white/30

                  text-white

                  transition-all
                  duration-300

                  hover:border-white
                  hover:bg-white
                  hover:text-black

                  sm:h-12
                  sm:w-12
                "
              >
                <ArrowRight />
              </button>
            </div>
          </motion.div>
        </div>

        {/* =================================================
            COUNTER
        ================================================== */}

        <motion.div
          initial={false}
          animate={
            revealDone
              ? {
                  opacity: 1,
                  x: 0,
                }
              : {
                  opacity: 0,
                  x: 12,
                }
          }
          transition={{
            delay:
              revealDone
                ? 0.5
                : 0,

            duration: 0.85,

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
            right-8
            top-1/2
            z-30

            hidden
            -translate-y-1/2

            lg:block
          "
        >
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xl text-white">
              0
              {activeSlide + 1}
            </span>

            <span className="font-mono text-[10px] text-white/40">
              / 0
              {slides.length}
            </span>
          </div>
        </motion.div>
      </section>

      {/* =================================================
          BRAND REVEAL
      ================================================== */}


    </>
  );
}

/* =========================================================
   ICONS
========================================================= */

function ArrowLeft() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M19 12H5M5 12L11 6M5 12L11 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12H19M19 12L13 6M19 12L13 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 7V17M15 7V17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 7.8V16.2C9 17.13 10.02 17.7 10.81 17.21L17.56 13.01C18.31 12.54 18.31 11.46 17.56 10.99L10.81 6.79C10.02 6.3 9 6.87 9 7.8Z"
        fill="currentColor"
      />
    </svg>
  );
}
