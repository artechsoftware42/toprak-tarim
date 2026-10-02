"use client";

import Image from "next/image";

import Link from "next/link";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import type { MotionValue } from "framer-motion";

import { useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";
import { productsWithManaged } from "@/data/products";
import type { ProductFilter } from "@/data/products";
import type { ManagedProduct, ProductCategory } from "@/features/products/model";
import { ContentImage, ContentText, useSectionContent } from "@/features/home/content/HomeContent";
import { localizedHref, localizedProductHref, localizedSectionId } from "@/lib/site-routing";

const activitySteps = [
  {
    index: "01",

    title: "activity_step_1_title",

    emphasis: "activity_step_1_emphasis",

    label: "activity_step_1_label",

    description: "activity_step_1_description",
  },

  {
    index: "02",

    title: "activity_step_2_title",

    emphasis: "activity_step_2_emphasis",

    label: "activity_step_2_label",

    description: "activity_step_2_description",
  },

  {
    index: "03",

    title: "activity_step_3_title",

    emphasis: "activity_step_3_emphasis",

    label: "activity_step_3_label",

    description: "activity_step_3_description",
  },

  {
    index: "04",

    title: "activity_step_4_title",

    emphasis: "activity_step_4_emphasis",

    label: "activity_step_4_label",

    description: "activity_step_4_description",
  },
];

const journeySteps = [
  {
    index: "01",

    eyebrow: "journey_step_1_eyebrow",

    title: "journey_step_1_title",

    emphasis: "journey_step_1_emphasis",

    description: "journey_step_1_description",

    x: 430,

    anchorY: 396,

    textY: 90,

    side: "top",
  },

  {
    index: "02",

    eyebrow: "journey_step_2_eyebrow",

    title: "journey_step_2_title",

    emphasis: "journey_step_2_emphasis",

    description: "journey_step_2_description",

    x: 1050,

    anchorY: 532,

    textY: 545,

    side: "bottom",
  },

  {
    index: "03",

    eyebrow: "journey_step_3_eyebrow",

    title: "journey_step_3_title",

    emphasis: "journey_step_3_emphasis",

    description: "journey_step_3_description",

    x: 1690,

    anchorY: 308,

    textY: 50,

    side: "top",
  },

  {
    index: "04",

    eyebrow: "journey_step_4_eyebrow",

    title: "journey_step_4_title",

    emphasis: "journey_step_4_emphasis",

    description: "journey_step_4_description",

    x: 2330,

    anchorY: 506,

    textY: 542,

    side: "bottom",
  },

  {
    index: "05",

    eyebrow: "journey_step_5_eyebrow",

    title: "journey_step_5_title",

    emphasis: "journey_step_5_emphasis",

    description: "journey_step_5_description",

    x: 2980,

    anchorY: 326,

    textY: 60,

    side: "top",
  },

  {
    index: "06",

    eyebrow: "journey_step_6_eyebrow",

    title: "journey_step_6_title",

    emphasis: "journey_step_6_emphasis",

    description: "journey_step_6_description",

    x: 3650,

    anchorY: 486,

    textY: 530,

    side: "bottom",
  },
] as const;

const journeyPath = `

  M 0 430



  C 120 432,

    205 402,

    300 396



  C 350 393,

    390 394,

    430 396



  C 610 404,

    735 510,

    900 528



  C 950 534,

    1000 535,

    1050 532



  C 1240 520,

    1355 340,

    1535 312



  C 1590 304,

    1640 305,

    1690 308



  C 1865 316,

    1995 472,

    2170 501



  C 2225 510,

    2280 509,

    2330 506



  C 2515 494,

    2650 352,

    2830 330



  C 2885 323,

    2930 323,

    2980 326



  C 3165 337,

    3290 463,

    3460 483



  C 3525 491,

    3590 490,

    3650 486



  C 3830 475,

    3970 408,

    4200 418

`;

const COMPACT_LAYOUT_QUERY = "(max-width: 767px)";

function subscribeToLayout(callback: () => void) {
  const media = window.matchMedia(COMPACT_LAYOUT_QUERY);

  media.addEventListener("change", callback);

  return () => media.removeEventListener("change", callback);
}

function getCompactLayout() {
  return window.matchMedia(COMPACT_LAYOUT_QUERY).matches;
}

function getServerCompactLayout() {
  return true;
}

export default function ActivitiesPage({ managedProducts = [], categories = [] }: { managedProducts?: ManagedProduct[]; categories?: ProductCategory[] }) {
  const { locale } = useSectionContent("activityPage");
  const reduceMotion = Boolean(useReducedMotion());

  const compactLayout = useSyncExternalStore(
    subscribeToLayout,

    getCompactLayout,

    getServerCompactLayout,
  );

  const staticLayout = reduceMotion || compactLayout;

  return (
    <main lang={locale} className="overflow-x-clip bg-[#F5F3EC] text-[#171915]">
      <ActivitiesHero staticLayout={staticLayout} />

      <ActivitiesIntro />

      <ActivitiesJourney staticLayout={staticLayout} />

      <ProductsSection managedProducts={managedProducts} categories={categories} />
    </main>
  );
}

function ActivitiesHero({ staticLayout }: { staticLayout: boolean }) {
  const { text, locale } = useSectionContent("activityPage");
  const sectionRef = useRef<HTMLElement>(null);

  const clipId = `activities-frame-${useId().replace(/:/g, "")}`;

  const { scrollYProgress } = useScroll({
    target: sectionRef,

    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.07]);

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#F5F3EC]"
      aria-label={text("hero_aria")}
    >
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        className="pointer-events-none absolute"
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d="M0 0 H1 V0.945 C1 0.978 0.985 1 0.96 1 H0.62 C0.588 1 0.573 0.925 0.5 0.925 C0.427 0.925 0.412 1 0.38 1 H0.04 C0.015 1 0 0.978 0 0.945 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="relative">
        <div
          className="relative isolate flex min-h-[500px] flex-col overflow-hidden bg-[#15231A] text-white md:min-h-[620px] lg:min-h-[700px]"
          style={{
            clipPath: `url(#${clipId})`,

            WebkitClipPath: `url(#${clipId})`,
          }}
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 -z-30"
            style={{
              scale: staticLayout ? 1 : imageScale,
            }}
          >
            <ContentImage
              section="activityPage"
              slot="hero"
              src="/about-bg.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>

          <div className="absolute inset-0 -z-20 bg-[#07130B]/40" />

          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,17,10,0.22)_0%,rgba(7,17,10,0.04)_34%,rgba(7,17,10,0.82)_100%)]" />

          <div className="flex items-center justify-between gap-5 px-5 pt-[112px] sm:px-8 md:px-12 md:pt-[132px] lg:px-16">
            <nav aria-label={text("breadcrumb_aria")}>
              <ol className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.05em] text-white/85 md:gap-3 md:text-xs">
                <li>
                  <Link
                    href={localizedHref("/", locale)}
                    className="cursor-pointer transition-colors hover:text-white"
                  >
                    <ContentText section="activityPage" field="home_label" />
                  </Link>
                </li>

                <li className="text-white/45">→</li>

                <li aria-current="page"><ContentText section="activityPage" field="activities_label" /></li>
              </ol>
            </nav>

            <span className="hidden text-[9px] font-medium uppercase tracking-[0.25em] text-white/65 sm:block md:text-[10px]">
              <ContentText section="activityPage" field="hero_meta" />
            </span>
          </div>

          <motion.div
            style={{
              y: staticLayout ? 0 : contentY,
            }}
            className="flex flex-1 flex-col justify-end px-5 pb-24 pt-16 sm:px-8 md:px-12 md:pb-28 lg:px-16 lg:pb-32"
          >
            <div className="mx-auto w-full max-w-[1760px]">
              <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#F4A245]">
                <ContentText section="activityPage" field="hero_eyebrow" />
              </span>

              <h1 className="mt-6 max-w-[1500px] text-[clamp(3.4rem,10vw,10rem)] font-medium leading-[0.84] tracking-[-0.075em]">
                <ContentText section="activityPage" field="hero_title_1" />
                <br />
                <span className="text-white/55"><ContentText section="activityPage" field="hero_title_2" /></span>
              </h1>

              <div className="mt-10 grid gap-8 border-t border-white/20 pt-6 md:grid-cols-12">
                <p className="max-w-[310px] text-[10px] font-medium uppercase leading-6 tracking-[0.2em] text-white/50 md:col-span-3">
                  <ContentText section="activityPage" field="hero_summary" />
                </p>

                <p className="max-w-[720px] text-base leading-8 text-white/78 md:col-span-6 md:col-start-7 md:text-lg md:leading-9">
                  <ContentText section="activityPage" field="hero_description" />
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 flex h-[5%] -translate-x-1/2 items-center justify-center text-[#1D6847]">
          <FiArrowDown className="text-lg md:text-xl" />
        </div>
      </div>
    </section>
  );
}

function ActivitiesIntro() {
  const { text } = useSectionContent("activityPage");
  return (
    <section className="relative bg-[#F5F3EC]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-3vw] top-[7%] hidden select-none xl:block"
      >
        <span className="block text-[clamp(8rem,14vw,17rem)] font-medium leading-none tracking-[-0.09em] text-[#1D6847]/[0.022]">
          01
        </span>
      </div>

      <div className="mx-auto max-w-[1760px] px-5 sm:px-8 md:px-12 lg:px-16">
        <div className="grid items-start gap-14 py-24 md:py-28 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20 lg:py-32">
          <div className="lg:sticky lg:top-[140px] lg:self-start">
            <SectionLabel index="01" title={<ContentText section="activityPage" field="intro_label" />} />

            <motion.h2
              initial={{
                opacity: 0,

                y: 22,
              }}
              whileInView={{
                opacity: 1,

                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.9,

                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-8 max-w-[600px] text-[clamp(1.85rem,3.05vw,3.65rem)] font-medium leading-[1] tracking-[-0.05em]"
            >
              <ContentText section="activityPage" field="intro_title_1" />
              <span className="text-[#1D6847]"> <ContentText section="activityPage" field="intro_title_accent" /> </span>
              <ContentText section="activityPage" field="intro_title_3" />
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.9,

                delay: 0.08,

                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-7 max-w-[470px] text-[15px] leading-7 text-black/50 md:text-base md:leading-8"
            >
              <ContentText section="activityPage" field="intro_description" />
            </motion.p>
          </div>

          <div className="relative">
            <div className="mb-2 flex items-center justify-between border-b border-black/10 pb-4">
              <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-black/28">
                <ContentText section="activityPage" field="intro_system_label" />
              </span>

              <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#1D6847]/65">
                <ContentText section="activityPage" field="intro_system_count" />
              </span>
            </div>

            {activitySteps.map((step, index) => (
              <motion.article
                key={step.index}
                initial={{
                  opacity: 0,

                  y: 20,
                }}
                whileInView={{
                  opacity: 1,

                  y: 0,
                }}
                viewport={{
                  once: true,

                  amount: 0.24,
                }}
                transition={{
                  duration: 0.95,

                  delay: index * 0.07,

                  ease: [0.16, 1, 0.3, 1],
                }}
                className="

                  group

                  relative

                  grid

                  min-h-[245px]

                  overflow-hidden

                  border-b

                  border-black/10

                  py-9



                  md:min-h-[275px]

                  md:grid-cols-[minmax(0,1fr)_115px]

                  md:gap-8



                  lg:min-h-[305px]

                  lg:grid-cols-[minmax(0,1fr)_140px]

                  lg:gap-10

                "
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(29,104,71,0)_0%,rgba(29,104,71,0)_62%,rgba(29,104,71,0.03)_100%)] opacity-0 transition-opacity duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100" />

                <div className="relative z-10 flex flex-col justify-center">
                  <span className="text-[10px] font-semibold text-[#1D6847]">
                    {step.index}
                  </span>

                  <h3 className="mt-4 text-[clamp(1.5rem,2.15vw,2.55rem)] font-medium leading-[1.02] tracking-[-0.04em]">
                    {text(step.title)}

                    <span className="ml-2 text-[#1D6847] transition-colors duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-[#F07D00]">
                      {text(step.emphasis)}
                    </span>
                  </h3>

                  <p className="mt-4 max-w-[590px] text-[14px] leading-7 text-black/46 md:text-[15px] md:leading-8">
                    {text(step.description)}
                  </p>
                </div>

                <div className="relative z-10 hidden items-center justify-end md:flex">
                  <div className="relative flex h-[68%] w-full items-center justify-end border-l border-black/[0.065] pl-5 transition-colors duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-[#F07D00]/20">
                    <span
                      aria-hidden="true"
                      className="

                        absolute

                        left-0

                        top-1/2

                        h-px

                        w-7

                        origin-left

                        -translate-y-1/2

                        scale-x-0

                        bg-[#F07D00]



                        transition-transform

                        duration-[1200ms]

                        ease-[cubic-bezier(0.16,1,0.3,1)]



                        group-hover:scale-x-100

                      "
                    />

                    <div className="flex flex-col items-end">
                      <span
                        aria-hidden="true"
                        className="

                          text-[clamp(3.4rem,4.5vw,5.3rem)]

                          font-medium

                          leading-[0.82]

                          tracking-[-0.075em]

                          text-black/[0.04]



                          transition-[color,transform]

                          duration-[2000ms]

                          ease-[cubic-bezier(0.22,0.61,0.36,1)]



                          group-hover:-translate-x-0.5

                          group-hover:text-[#1D6847]/[0.09]

                        "
                      >
                        {step.index}
                      </span>

                      <span className="mt-4 text-[8px] font-semibold uppercase tracking-[0.23em] text-black/26 transition-colors duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-[#F07D00]/85">
                        {text(step.label)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ActivitiesJourney({ staticLayout }: { staticLayout: boolean }) {
  if (staticLayout) {
    return <ActivitiesJourneyMobile />;
  }

  return <ActivitiesJourneyDesktop />;
}

function JourneyEndButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative mt-8 inline-flex cursor-pointer items-center gap-4 overflow-hidden border border-white/18 bg-white/[0.055] px-5 py-3.5 text-left backdrop-blur-md transition-[border-color,background-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#F07D00]/50 hover:bg-white/[0.09]"
    >
      <span className="relative z-10 text-[9px] font-semibold uppercase tracking-[0.23em] text-white/72 transition-colors duration-700 group-hover:text-white">
        <ContentText section="activityPage" field="journey_skip_label" />
      </span>
      <span className="relative z-10 flex h-7 w-7 items-center justify-center border border-white/15 bg-black/15 text-[#F07D00] transition-[transform,border-color,background-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0.5 group-hover:border-[#F07D00]/45 group-hover:bg-[#F07D00]/10">
        <FiArrowDown className="text-sm transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0.5" />
      </span>
      <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#F07D00] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
    </button>
  );
}

function ActivitiesJourneyDesktop() {
  const { text, locale } = useSectionContent("activityPage");
  const sectionRef = useRef<HTMLElement>(null);

  const handleSkipToJourneyEnd = () => {
    const section = sectionRef.current;
    if (!section) return;

    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: Math.max(0, sectionTop + section.offsetHeight - window.innerHeight),
      behavior: "smooth",
    });
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,

    offset: ["start start", "end end"],
  });

  const journeyX = useTransform(
    scrollYProgress,

    [0, 0.05, 0.77, 0.88],

    ["0px", "0px", "-3300px", "-3580px"],
  );

  const journeySceneX = useTransform(
    scrollYProgress,

    [0.855, 0.89, 0.965, 1],

    ["0vw", "-5vw", "-88vw", "-128vw"],
  );

  const journeySceneOpacity = useTransform(
    scrollYProgress,

    [0, 0.95, 0.98, 1],

    [1, 1, 0.82, 0],
  );

  const orangePathLength = useTransform(scrollYProgress, [0.03, 0.8], [0, 1]);

  const finalOpacity = useTransform(
    scrollYProgress,

    [0.94, 0.975, 1],

    [0, 0.35, 1],
  );

  const finalY = useTransform(scrollYProgress, [0.94, 1], [55, 0]);

  const finalScale = useTransform(scrollYProgress, [0.94, 1], [0.97, 1]);

  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.045, 1]);

  return (
    <section
      id={localizedSectionId("production", locale)}
      ref={sectionRef}
      className="relative h-[760vh] scroll-mt-24 bg-[#0A0C09]"
      aria-label={text("journey_aria")}
    >
      {locale === "tr" && <span id="production" aria-hidden="true" className="absolute left-0 top-0" />}
      <div className="sticky top-0 h-[100svh] min-h-[620px] overflow-hidden bg-[#0A0C09] text-white">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            scale: backgroundScale,
          }}
        >
          <Image
            src="/activity-bg.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>

        <div className="absolute inset-0 bg-black/[0.08]" />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,5,3,0.98)_0%,rgba(3,5,3,0.97)_18%,rgba(3,5,3,0.93)_27%,rgba(3,5,3,0.78)_35%,rgba(3,5,3,0.53)_44%,rgba(3,5,3,0.34)_55%,rgba(3,5,3,0.26)_70%,rgba(3,5,3,0.23)_100%)]" />

        <div className="absolute inset-y-0 left-0 w-[41vw] bg-[linear-gradient(90deg,rgba(0,0,0,0.50)_0%,rgba(0,0,0,0.34)_68%,rgba(0,0,0,0)_100%)]" />

        <div className="absolute inset-y-0 right-0 w-[32vw] bg-[linear-gradient(270deg,rgba(0,0,0,0.20)_0%,rgba(0,0,0,0.08)_58%,rgba(0,0,0,0)_100%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0)_38%,rgba(0,0,0,0.20)_100%)]" />

        <motion.div
          className="absolute inset-0 z-20"
          style={{
            x: journeySceneX,

            opacity: journeySceneOpacity,
          }}
        >
          <div className="absolute inset-y-0 left-0 z-40 flex w-[38vw] min-w-[420px] max-w-[680px] items-center">
            <div className="w-full pl-[clamp(2.5rem,5vw,6rem)] pr-[clamp(2rem,4vw,5rem)]">
              <SectionLabel index="02" title={<ContentText section="activityPage" field="journey_label" />} dark />

              <h2 className="mt-9 max-w-[590px] text-[clamp(2.7rem,4.2vw,5.4rem)] font-medium leading-[0.91] tracking-[-0.065em]">
                <ContentText section="activityPage" field="journey_title_1" />
                <br />
                <span className="text-white/43"><ContentText section="activityPage" field="journey_title_2" /></span>
                <br />
                <ContentText section="activityPage" field="journey_title_3" />
              </h2>

              <p className="mt-8 max-w-[430px] text-[clamp(0.88rem,1vw,1.05rem)] leading-[1.85] text-white/48">
                <ContentText section="activityPage" field="journey_description" />
              </p>

              <div className="mt-11 flex items-center gap-4">
                <span className="text-[9px] font-semibold uppercase tracking-[0.27em] text-white/34">
                  <ContentText section="activityPage" field="journey_scroll_hint" />
                </span>

                <span className="h-px w-16 bg-white/16" />
              </div>

              <JourneyEndButton onClick={handleSkipToJourneyEnd} />
            </div>
          </div>

          <div
            className="absolute inset-0 z-30 overflow-hidden"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, transparent 27%, rgba(0,0,0,0.02) 30%, rgba(0,0,0,0.10) 33%, rgba(0,0,0,0.30) 37%, rgba(0,0,0,0.65) 42%, rgba(0,0,0,0.92) 47%, black 51%, black 100%)",

              maskImage:
                "linear-gradient(to right, transparent 0%, transparent 27%, rgba(0,0,0,0.02) 30%, rgba(0,0,0,0.10) 33%, rgba(0,0,0,0.30) 37%, rgba(0,0,0,0.65) 42%, rgba(0,0,0,0.92) 47%, black 51%, black 100%)",
            }}
          >
            <motion.div
              className="absolute left-[54vw] top-1/2 h-[760px] w-[4200px] -translate-y-1/2"
              style={{
                x: journeyX,
              }}
            >
              <svg
                aria-hidden="true"
                className="absolute inset-0 h-full w-full overflow-visible"
                viewBox="0 0 4200 760"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d={journeyPath}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />

                <path
                  d={journeyPath}
                  stroke="rgba(255,255,255,0.30)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />

                <motion.path
                  d={journeyPath}
                  stroke="#F07D00"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  style={{
                    pathLength: orangePathLength,
                  }}
                />
              </svg>

              {journeySteps.map((step, index) => (
                <JourneyPoint
                  key={`journey-point-${step.index}`}
                  step={step}
                  index={index}
                  scrollYProgress={scrollYProgress}
                />
              ))}

              {journeySteps.map((step, index) => (
                <JourneyStep
                  key={step.index}
                  step={step}
                  index={index}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </motion.div>
          </div>

          <div className="absolute bottom-9 right-[4vw] z-40 hidden items-center gap-4 lg:flex">
            <span className="text-[9px] font-medium uppercase tracking-[0.24em] text-white/34">
              <ContentText section="activityPage" field="journey_progress_label" />
            </span>

            <div className="relative h-px w-28 overflow-hidden bg-white/20">
              <motion.div
                className="absolute inset-y-0 left-0 w-full origin-left bg-[#F07D00]"
                style={{
                  scaleX: scrollYProgress,
                }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center px-[6vw]"
          style={{
            opacity: finalOpacity,

            y: finalY,

            scale: finalScale,
          }}
        >
          <div className="max-w-[1100px] text-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#F07D00]">
              <ContentText section="activityPage" field="journey_final_label" />
            </span>

            <h2 className="mt-8 text-[clamp(4rem,7.2vw,9rem)] font-medium leading-[0.85] tracking-[-0.075em]">
              <ContentText section="activityPage" field="journey_final_title_1" />
              <br />
              <span className="text-white/58"><ContentText section="activityPage" field="journey_final_title_2" /></span>
            </h2>

            <p className="mx-auto mt-9 max-w-[650px] text-[clamp(0.95rem,1.05vw,1.15rem)] leading-[1.9] text-white/56">
              <ContentText section="activityPage" field="journey_final_description" />
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function JourneyPoint({
  step,

  index,

  scrollYProgress,
}: {
  step: (typeof journeySteps)[number];

  index: number;

  scrollYProgress: MotionValue<number>;
}) {
  const centerProgress = 0.105 + index * 0.119;

  const passiveStart = Math.max(0, centerProgress - 0.17);

  const activeStart = Math.max(0, centerProgress - 0.045);

  const activeEnd = Math.min(1, centerProgress + 0.075);

  const passiveEnd = Math.min(1, centerProgress + 0.22);

  const squareBackground = useTransform(
    scrollYProgress,

    [passiveStart, activeStart, activeEnd, passiveEnd],

    [
      "rgba(255,255,255,0.18)",

      "rgba(240,125,0,1)",

      "rgba(240,125,0,1)",

      "rgba(255,255,255,0.18)",
    ],
  );

  const squareBorder = useTransform(
    scrollYProgress,

    [passiveStart, activeStart, activeEnd, passiveEnd],

    [
      "rgba(255,255,255,0.36)",

      "rgba(255,177,91,1)",

      "rgba(255,177,91,1)",

      "rgba(255,255,255,0.36)",
    ],
  );

  const squareScale = useTransform(
    scrollYProgress,

    [passiveStart, centerProgress, passiveEnd],

    [0.8, 1.12, 0.8],
  );

  const glowOpacity = useTransform(
    scrollYProgress,

    [passiveStart, activeStart, activeEnd, passiveEnd],

    [0, 0.6, 0.6, 0],
  );

  return (
    <motion.div
      className="pointer-events-none absolute z-30"
      style={{
        left: step.x,

        top: step.anchorY,

        x: "-50%",

        y: "-50%",

        scale: squareScale,
      }}
    >
      <motion.div
        className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 bg-[#F07D00]/25 blur-lg"
        style={{
          opacity: glowOpacity,
        }}
      />

      <motion.div
        className="relative flex h-[20px] w-[20px] items-center justify-center border backdrop-blur-md"
        style={{
          borderColor: squareBorder,

          backgroundColor: "rgba(8,11,8,0.84)",
        }}
      >
        <motion.div
          className="h-[8px] w-[8px]"
          style={{
            backgroundColor: squareBackground,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

function JourneyStep({
  step,

  index,

  scrollYProgress,
}: {
  step: (typeof journeySteps)[number];

  index: number;

  scrollYProgress: MotionValue<number>;
}) {
  const { text } = useSectionContent("activityPage");
  const centerProgress = 0.105 + index * 0.119;

  const outerStart = Math.max(0, centerProgress - 0.2);

  const strongStart = Math.max(0, centerProgress - 0.055);

  const strongEnd = Math.min(1, centerProgress + 0.1);

  const outerEnd = Math.min(1, centerProgress + 0.29);

  const opacity = useTransform(
    scrollYProgress,

    [outerStart, strongStart, strongEnd, outerEnd],

    [0.58, 1, 1, 0.6],
  );

  const scale = useTransform(
    scrollYProgress,

    [outerStart, centerProgress, outerEnd],

    [0.985, 1, 0.99],
  );

  const textY = useTransform(
    scrollYProgress,

    [outerStart, centerProgress, outerEnd],

    [step.side === "top" ? 7 : -7, 0, step.side === "top" ? -2 : 2],
  );

  const headingColor = useTransform(
    scrollYProgress,

    [outerStart, strongStart, strongEnd, outerEnd],

    [
      "rgba(255,255,255,0.72)",

      "rgba(255,255,255,1)",

      "rgba(255,255,255,1)",

      "rgba(255,255,255,0.70)",
    ],
  );

  const descriptionColor = useTransform(
    scrollYProgress,

    [outerStart, strongStart, strongEnd, outerEnd],

    [
      "rgba(255,255,255,0.55)",

      "rgba(255,255,255,0.82)",

      "rgba(255,255,255,0.82)",

      "rgba(255,255,255,0.54)",
    ],
  );

  const orangeColor = useTransform(
    scrollYProgress,

    [outerStart, strongStart, strongEnd, outerEnd],

    [
      "rgba(240,125,0,0.72)",

      "rgba(240,125,0,1)",

      "rgba(240,125,0,1)",

      "rgba(240,125,0,0.70)",
    ],
  );

  const cardBackground = useTransform(
    scrollYProgress,

    [outerStart, strongStart, strongEnd, outerEnd],

    [
      "rgba(5,8,5,0.48)",

      "rgba(5,8,5,0.66)",

      "rgba(5,8,5,0.66)",

      "rgba(5,8,5,0.48)",
    ],
  );

  const cardBorder = useTransform(
    scrollYProgress,

    [outerStart, strongStart, strongEnd, outerEnd],

    [
      "rgba(255,255,255,0.08)",

      "rgba(255,255,255,0.16)",

      "rgba(255,255,255,0.16)",

      "rgba(255,255,255,0.08)",
    ],
  );

  return (
    <motion.article
      className="absolute w-[clamp(300px,23vw,400px)]"
      style={{
        left: step.x,

        top: step.textY,

        opacity,

        scale,

        y: textY,
      }}
    >
      <motion.div
        className="

          relative

          overflow-hidden

          border

          px-6

          py-6

          backdrop-blur-[10px]

          md:px-7

          md:py-7

        "
        style={{
          backgroundColor: cardBackground,

          borderColor: cardBorder,

          boxShadow:
            "0 20px 60px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.035)_0%,rgba(255,255,255,0)_45%,rgba(0,0,0,0.16)_100%)]" />

        <motion.div
          className="absolute bottom-0 left-0 top-0 w-[2px]"
          style={{
            backgroundColor: orangeColor,
          }}
        />

        <div className="relative z-10">
          <motion.div
            className="flex items-center gap-3"
            style={{
              color: orangeColor,
            }}
          >
            <span className="text-[10px] font-semibold tracking-[0.16em]">
              {step.index}
            </span>

            <span className="h-px w-8 bg-current opacity-60" />

            <span className="text-[9px] font-medium uppercase tracking-[0.2em]">
              {text(step.eyebrow)}
            </span>
          </motion.div>

          <motion.h3
            className="mt-4 text-[clamp(1.7rem,2.25vw,2.9rem)] font-medium leading-[0.96] tracking-[-0.05em]"
            style={{
              color: headingColor,
            }}
          >
            {text(step.title)}

            <br />

            <motion.span
              style={{
                color: orangeColor,
              }}
            >
              {text(step.emphasis)}
            </motion.span>
          </motion.h3>

          <motion.p
            className="mt-5 max-w-[350px] text-[clamp(0.78rem,0.85vw,0.92rem)] leading-[1.75]"
            style={{
              color: descriptionColor,
            }}
          >
            {text(step.description)}
          </motion.p>
        </div>
      </motion.div>
    </motion.article>
  );
}

function ActivitiesJourneyMobile() {
  const { locale } = useSectionContent("activityPage");
  const finalRef = useRef<HTMLDivElement>(null);
  const journeyTrackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: mobileJourneyProgress } = useScroll({
    target: journeyTrackRef,
    offset: ["start 0.82", "end 0.28"],
  });

  const mobileLineScale = useTransform(
    mobileJourneyProgress,
    [0.02, 0.96],
    [0, 1],
  );

  const handleSkipToJourneyEnd = () => {
    finalRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <section id={localizedSectionId("production", locale)} className="relative scroll-mt-24 overflow-hidden bg-[#090C09] text-white">
      {locale === "tr" && <span id="production" aria-hidden="true" className="absolute left-0 top-0" />}
      <div className="absolute inset-0">
        <Image
          src="/activity-bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-black/50" />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.48)_30%,rgba(0,0,0,0.42)_58%,rgba(0,0,0,0.70)_100%)]" />

      <div className="relative z-10 px-5 py-24 sm:px-8 sm:py-28">
        <SectionLabel index="02" title={<ContentText section="activityPage" field="journey_label" />} dark />

        <h2 className="mt-9 max-w-[520px] text-[clamp(2.7rem,12vw,4.7rem)] font-medium leading-[0.9] tracking-[-0.06em]">
          <ContentText section="activityPage" field="journey_title_1" />
          <br />
          <span className="text-white/45"><ContentText section="activityPage" field="journey_title_2" /></span>
          <br />
          <ContentText section="activityPage" field="journey_title_3" />
        </h2>

        <p className="mt-7 max-w-[480px] text-sm leading-7 text-white/52 sm:text-base sm:leading-8">
          <ContentText section="activityPage" field="journey_description" />
        </p>

        <JourneyEndButton onClick={handleSkipToJourneyEnd} />

        <div ref={journeyTrackRef} className="relative mt-24 sm:mt-28">
          {/* MOBILE JOURNEY — CONTINUOUS VERTICAL PATH */}
          <div className="pointer-events-none absolute bottom-[42px] left-[27px] top-[42px] z-0 w-[2px] bg-white/[0.16] sm:left-[31px]">
            <motion.div
              className="absolute inset-0 origin-top bg-[#F07D00] shadow-[0_0_18px_rgba(240,125,0,0.35)]"
              style={{ scaleY: mobileLineScale }}
            />
          </div>

          <div className="relative z-10">
            {journeySteps.map((step, index) => (
              <MobileJourneyStep
                key={step.index}
                step={step}
                index={index}
                progress={mobileJourneyProgress}
                isLast={index === journeySteps.length - 1}
              />
            ))}
          </div>
        </div>

        <motion.div
          ref={finalRef}
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 0.9,
          }}
          className="pb-10 pt-32 sm:pt-36"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#F07D00]">
            <ContentText section="activityPage" field="journey_final_label" />
          </span>

          <h2 className="mt-7 text-[clamp(3.2rem,14vw,5.8rem)] font-medium leading-[0.87] tracking-[-0.07em]">
            <ContentText section="activityPage" field="journey_final_title_1" />
            <br />
            <span className="text-white/54"><ContentText section="activityPage" field="journey_final_title_2" /></span>
          </h2>

          <p className="mt-7 max-w-[520px] text-sm leading-7 text-white/52 sm:text-base sm:leading-8">
            <ContentText section="activityPage" field="journey_final_description" />
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function MobileJourneyStep({
  step,
  index,
  progress,
  isLast,
}: {
  step: (typeof journeySteps)[number];
  index: number;
  progress: MotionValue<number>;
  isLast: boolean;
}) {
  const { text } = useSectionContent("activityPage");
  const lastIndex = Math.max(1, journeySteps.length - 1);
  const centerProgress = 0.08 + (index / lastIndex) * 0.82;
  const passiveStart = Math.max(0, centerProgress - 0.16);
  const activeStart = Math.max(0.01, centerProgress - 0.05);
  const activeEnd = Math.min(0.98, centerProgress + 0.08);
  const passiveEnd = Math.min(1, centerProgress + 0.2);

  const nodeBackground = useTransform(
    progress,
    [passiveStart, activeStart, activeEnd, passiveEnd],
    [
      "rgba(255,255,255,0.16)",
      "rgba(240,125,0,1)",
      "rgba(240,125,0,1)",
      "rgba(255,255,255,0.16)",
    ],
  );

  const nodeBorder = useTransform(
    progress,
    [passiveStart, activeStart, activeEnd, passiveEnd],
    [
      "rgba(255,255,255,0.30)",
      "rgba(255,177,91,1)",
      "rgba(255,177,91,1)",
      "rgba(255,255,255,0.30)",
    ],
  );

  const nodeScale = useTransform(
    progress,
    [passiveStart, centerProgress, passiveEnd],
    [0.84, 1.12, 0.88],
  );

  const glowOpacity = useTransform(
    progress,
    [passiveStart, activeStart, activeEnd, passiveEnd],
    [0, 0.65, 0.65, 0],
  );

  const cardOpacity = useTransform(
    progress,
    [passiveStart, activeStart, activeEnd, passiveEnd],
    [0.55, 1, 1, 0.64],
  );

  const cardY = useTransform(
    progress,
    [passiveStart, centerProgress, passiveEnd],
    [18, 0, -5],
  );

  const cardBackground = useTransform(
    progress,
    [passiveStart, activeStart, activeEnd, passiveEnd],
    [
      "rgba(5,8,5,0.46)",
      "rgba(5,8,5,0.68)",
      "rgba(5,8,5,0.68)",
      "rgba(5,8,5,0.48)",
    ],
  );

  const cardBorder = useTransform(
    progress,
    [passiveStart, activeStart, activeEnd, passiveEnd],
    [
      "rgba(255,255,255,0.08)",
      "rgba(255,255,255,0.17)",
      "rgba(255,255,255,0.17)",
      "rgba(255,255,255,0.09)",
    ],
  );

  const accentOpacity = useTransform(
    progress,
    [passiveStart, activeStart, activeEnd, passiveEnd],
    [0.55, 1, 1, 0.62],
  );

  return (
    <article
      className={`relative grid grid-cols-[54px_minmax(0,1fr)] gap-4 sm:grid-cols-[62px_minmax(0,1fr)] sm:gap-5 ${
        isLast ? "pb-4" : "pb-16 sm:pb-20"
      }`}
    >
      <div className="relative flex justify-center pt-9 sm:pt-10">
        <motion.div
          aria-hidden="true"
          className="absolute top-[28px] h-12 w-12 rounded-full bg-[#F07D00]/20 blur-xl sm:top-[32px]"
          style={{ opacity: glowOpacity }}
        />

        <motion.div
          aria-hidden="true"
          className="relative z-20 flex h-[20px] w-[20px] items-center justify-center border bg-[#090C09] shadow-[0_10px_28px_rgba(0,0,0,0.28)]"
          style={{
            borderColor: nodeBorder,
            scale: nodeScale,
          }}
        >
          <motion.div
            className="h-[8px] w-[8px]"
            style={{ backgroundColor: nodeBackground }}
          />
        </motion.div>
      </div>

      <motion.div
        className="min-w-0"
        style={{
          opacity: cardOpacity,
          y: cardY,
        }}
      >
        <motion.div
          className="relative overflow-hidden border px-5 py-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-md sm:px-6 sm:py-7"
          style={{
            backgroundColor: cardBackground,
            borderColor: cardBorder,
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.035)_0%,transparent_55%,rgba(0,0,0,0.16)_100%)]" />

          <motion.div
            className="absolute bottom-0 left-0 top-0 w-[2px] bg-[#F07D00]"
            style={{ opacity: accentOpacity }}
          />

          <div className="relative z-10">
            <motion.div
              className="flex items-center gap-3 text-[#F07D00]"
              style={{ opacity: accentOpacity }}
            >
              <span className="text-[10px] font-semibold tracking-[0.15em]">
                {step.index}
              </span>

              <span className="h-px w-7 bg-current opacity-60" />

              <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/54">
                {text(step.eyebrow)}
              </span>
            </motion.div>

            <h3 className="mt-4 text-[clamp(1.7rem,8vw,2.8rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
              {text(step.title)}
              <br />
              <span className="text-[#F07D00]">{text(step.emphasis)}</span>
            </h3>

            <p className="mt-5 max-w-[430px] text-[13px] leading-7 text-white/66 min-[390px]:text-sm sm:text-base sm:leading-8">
              {text(step.description)}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </article>
  );
}

function ProductsSection({ managedProducts, categories }: { managedProducts: ManagedProduct[]; categories: ProductCategory[] }) {
  const { text, locale } = useSectionContent("activityPage");
  const [activeFilter, setActiveFilter] = useState<ProductFilter>("all");
  const products = productsWithManaged(managedProducts);
  const filters = [{ id: "all", label: text("products_filter_1") }, ...categories.map(category => ({ id: category.id, label: category.name[locale] }))];

  const visibleProducts =
    activeFilter === "all"
      ? products
      : products.filter(product => (product.managed ? product.managed.copy[locale].name : product.category) === activeFilter);

  return (
    <section id={localizedSectionId("products", locale)} className="relative scroll-mt-24 overflow-hidden bg-[#F5F3EC] py-24 sm:py-28 lg:py-36">
      {locale === "tr" && <span id="products" aria-hidden="true" className="absolute left-0 top-0" />}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 whitespace-nowrap text-[clamp(7rem,18vw,20rem)] font-medium leading-none tracking-[-0.09em] text-black/[0.025]"
      >
        <ContentText section="activityPage" field="products_background" />
      </div>

      <div className="relative mx-auto max-w-[1760px] px-5 sm:px-8 md:px-12 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <SectionLabel index="03" title={<ContentText section="activityPage" field="products_label" />} />

            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 max-w-[860px] text-[clamp(2.8rem,5.6vw,6.6rem)] font-medium leading-[0.88] tracking-[-0.07em]"
            >
              <ContentText section="activityPage" field="products_title_1" />
              <br />
              <span className="text-[#1D6847]"><ContentText section="activityPage" field="products_title_2" /></span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="lg:col-span-4 lg:col-start-9 lg:pb-2"
          >
            <p className="max-w-[560px] text-[15px] leading-7 text-black/48 md:text-base md:leading-8">
              <ContentText section="activityPage" field="products_description" />
            </p>
          </motion.div>
        </div>

        <div className="mt-14 flex flex-col gap-8 border-t border-black/[0.08] pt-6 lg:mt-20 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-8"
            role="tablist"
            aria-label={text("products_filters_aria")}
          >
            {filters.map((filter, index) => {
              const isActive = activeFilter === filter.id;

              return (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`group relative flex cursor-pointer items-baseline gap-2 py-2 text-left transition-colors duration-300 ${
                    isActive
                      ? "text-[#171915]"
                      : "text-black/35 hover:text-black/70"
                  }`}
                >
                  <span
                    className={`text-[9px] font-semibold tracking-[0.12em] transition-colors duration-300 ${
                      isActive
                        ? "text-[#F07D00]"
                        : "text-black/20 group-hover:text-black/40"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="text-sm font-medium tracking-[-0.02em] sm:text-[15px]">
                    {filter.label}
                  </span>

                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#1D6847] transition-all duration-500 ease-out ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <span className="hidden text-[10px] font-medium uppercase tracking-[0.24em] text-black/25 lg:block">
            <ContentText section="activityPage" field="products_filter_hint" />
          </span>
        </div>

        <motion.div
          layout
          className="mt-8 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-5 lg:mt-10 lg:grid-cols-4 lg:gap-x-6"
        >
          {visibleProducts.map((product, index) => {
            const contentIndex = products.findIndex(item => item.id === product.id) + 1;
            const managedCopy = product.managed?.copy[locale];
            const productName = managedCopy?.name ?? text(`product_${contentIndex}_name`);
            const productDescription = managedCopy?.description ?? text(`product_${contentIndex}_description`);
            const productHref = product.managed ? `${locale === "tr" ? "/faaliyetler" : "/en/activities"}/${product.managed.slug[locale]}` : localizedProductHref(product.slug, locale);
            return (
            <motion.article
              layout
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                duration: 0.5,
                delay: index * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="min-w-0"
            >
              <Link
                href={productHref}
                aria-label={`${productName} ${text("product_aria_suffix")}`}
                className="group block cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-[#E8E4D9] sm:aspect-[5/6]">
                  <div className="absolute inset-0 scale-[1.001] will-change-transform transition-transform duration-[3000ms] ease-[cubic-bezier(0.45,0,0.55,1)] group-hover:scale-[1.045]">
                    <ContentImage
                      section="activityPage"
                      slot={`product${contentIndex}`}
                      src={product.image}
                      alt={productName}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover brightness-[0.84] saturate-[0.92] transition-[filter] duration-[2200ms] ease-[cubic-bezier(0.45,0,0.55,1)] group-hover:brightness-[0.98] group-hover:saturate-100"
                    />
                  </div>

                  <div className="pointer-events-none absolute inset-0 bg-black/20 transition-colors duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-black/8" />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,6,0.08)_18%,rgba(5,10,6,0.14)_50%,rgba(5,10,6,0.80)_100%)] opacity-90 transition-opacity duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100" />
                  <div className="pointer-events-none absolute inset-0 -translate-x-[10%] bg-[linear-gradient(120deg,rgba(255,255,255,0)_35%,rgba(255,255,255,0.07)_50%,rgba(255,255,255,0)_65%)] opacity-0 transition-[opacity,transform] duration-[2200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[5%] group-hover:opacity-60" />

                  <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
                    <div className="flex items-end justify-between gap-5">
                      <div>
                        <span className="block text-[9px] font-semibold uppercase tracking-[0.22em] text-white/50 transition-[transform,color] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:text-white/65">
                          <ContentText section="activityPage" field="products_brand" />
                        </span>

                        <h3 className="mt-2 text-[clamp(1.7rem,2.2vw,2.7rem)] font-medium leading-none tracking-[-0.055em] text-white transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
                          {managedCopy ? productName : <ContentText section="activityPage" field={`product_${contentIndex}_name`} />}
                        </h3>
                      </div>

                      <div className="hidden shrink-0 translate-y-7 items-center gap-2 self-end pb-0.5 text-white/88 opacity-0 transition-[opacity,transform] duration-[1300ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-200 sm:flex">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] sm:text-[11px]">
                          <ContentText section="activityPage" field="product_cta" />
                        </span>
                        <FiArrowUpRight className="text-[17px] transition-transform duration-[1300ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:delay-200" />
                      </div>

                    </div>
                  </div>

                  <div className="pointer-events-none absolute right-5 top-5 text-[10px] font-semibold tracking-[0.14em] text-white/55 sm:right-6 sm:top-6">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4 px-1">
                  <p className="max-w-[240px] text-[13px] leading-6 text-black/38 transition-colors duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-black/58">
                    {managedCopy ? productDescription : <ContentText section="activityPage" field={`product_${contentIndex}_description`} />}
                  </p>

                  <span className="group/action flex shrink-0 items-center gap-1.5 text-[12px] font-medium text-[#1D6847] transition-colors group-hover:text-[#F07D00] sm:hidden">
                    <ContentText section="activityPage" field="inspect_label" />
                    <FiArrowUpRight className="text-sm transition-transform duration-300 group-hover/action:translate-x-0.5 group-hover/action:-translate-y-0.5" />
                  </span>

                </div>
              </Link>
            </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function SectionLabel({
  index,

  title,

  dark = false,
}: {
  index: string;

  title: ReactNode;

  dark?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`text-xs font-semibold ${
          dark ? "text-[#F07D00]" : "text-[#1D6847]"
        }`}
      >
        {index}
      </span>

      <span className={`h-px w-10 ${dark ? "bg-white/20" : "bg-black/20"}`} />

      <span
        className={`text-[10px] font-medium uppercase tracking-[0.28em] ${
          dark ? "text-white/42" : "text-black/42"
        }`}
      >
        {title}
      </span>
    </div>
  );
}
