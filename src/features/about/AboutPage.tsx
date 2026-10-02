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
import { createContext, Fragment, useContext, useId, useRef, useSyncExternalStore } from "react";
import { FiArrowDown } from "react-icons/fi";
import { plainText, type HomeSection, type RichText } from "@/features/home/content/model";
import { useHomeLocale } from "@/features/home/content/LocaleProvider";
import { ContentImage } from "@/features/home/content/HomeContent";
import { localizedHref, localizedSectionId } from "@/lib/site-routing";

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function smoothstep(start: number, end: number, value: number) {
  if (start === end) {
    return value >= end ? 1 : 0;
  }

  const t = clamp01((value - start) / (end - start));

  return t * t * (3 - 2 * t);
}

type AboutContentContextValue = {
  content: HomeSection;
  locale: "tr" | "en";
};
const AboutContentContext = createContext<AboutContentContextValue | null>(null);

function useAboutContent() {
  const value = useContext(AboutContentContext);
  if (!value) throw new Error("About content is unavailable.");
  const runs = (field: string): RichText => value.content.content[value.locale][field] || [{ text: "" }];
  return { ...value, runs, text: (field: string) => plainText(runs(field)) };
}

function AboutText({ field }: { field: string }) {
  const { runs } = useAboutContent();
  return runs(field).map((run, index) => (
    <Fragment key={`${field}-${index}`}>
      <span style={{ fontWeight: run.bold ? 700 : undefined, fontStyle: run.italic ? "italic" : undefined, color: run.color }}>{run.text}</span>
    </Fragment>
  ));
}

type GeneralInformationItem = { index: string; title: string[]; body: string[] };

// Preserve the desktop composition on laptop-height viewports.
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

export default function AboutPage({ content }: { content: HomeSection }) {
  const { locale } = useHomeLocale();
  const reduceMotion = Boolean(useReducedMotion());
  const compactLayout = useSyncExternalStore(
    subscribeToLayout,
    getCompactLayout,
    getServerCompactLayout,
  );
  const compactOrReducedMotion = reduceMotion || compactLayout;

  // The archive keeps the story and general-information scroll scenes active
  // on mobile. Only the operating-system reduced-motion preference makes them
  // static; compact screens affect the cinematic hero alone.
  const staticSections = reduceMotion;

  const storyRef = useRef<HTMLElement>(null);

  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"],
  });

  const plantPath = useTransform(storyProgress, [0.08, 0.82], [0, 1]);

  const leafOneScale = useTransform(storyProgress, [0.22, 0.32], [0, 1]);

  const leafTwoScale = useTransform(storyProgress, [0.42, 0.52], [0, 1]);

  const leafThreeScale = useTransform(storyProgress, [0.63, 0.73], [0, 1]);

  const statementOneOpacity = useTransform(
    storyProgress,
    [0.04, 0.16, 0.28],
    [0, 1, 0.25],
  );

  const statementTwoOpacity = useTransform(
    storyProgress,
    [0.26, 0.42, 0.57],
    [0.25, 1, 0.25],
  );

  const statementThreeOpacity = useTransform(
    storyProgress,
    [0.55, 0.7, 0.88],
    [0.25, 1, 1],
  );

  const storyNumberY = useTransform(storyProgress, [0, 1], ["0%", "-20%"]);

  return (
    <AboutContentContext.Provider value={{ content, locale }}>
    <main lang={locale} className="overflow-x-clip bg-[#F5F3EC] text-[#171915]">
      <CinematicHero compactLayout={compactOrReducedMotion} />

      <section
        id={localizedSectionId("about", locale)}
        ref={storyRef}
        className={`relative scroll-mt-24 bg-[#F4F1E9] ${staticSections ? "" : "h-[250svh]"}`}
      >
        {locale === "tr" && <span id="about-us" aria-hidden="true" className="absolute left-0 top-0" />}
        <div
          className={
            staticSections
              ? "relative min-h-[560px] overflow-hidden"
              : "sticky top-0 h-[100svh] overflow-hidden"
          }
        >
          <div className="mx-auto grid h-full max-w-[1760px] grid-cols-1 md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative z-10 flex min-w-0 flex-col justify-between gap-12 px-5 pb-12 pt-24 md:px-10 md:pb-[clamp(2rem,7svh,4rem)] md:pt-[clamp(5rem,11svh,7rem)] lg:px-16 lg:pb-20">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#1D6847]">01</span>

                  <span className="h-px w-10 bg-black/20" />

                  <span className="text-[10px] font-medium uppercase tracking-[0.27em] text-black/45">
                    <AboutText field="story_section_label" />
                  </span>
                </div>

                <h2 className="mt-8 max-w-[760px] text-[clamp(2.65rem,5.2vw,7.2rem)] font-medium leading-[0.92] tracking-[-0.065em]">
                  <AboutText field="story_title_1" />
                  <span className="text-[#1D6847]"> <AboutText field="story_title_accent" /> </span>
                  <AboutText field="story_title_3" />
                </h2>
              </div>

              <div className="max-w-xl">
                <p className="text-base leading-8 text-black/55 md:text-lg">
                  <AboutText field="story_description" />
                </p>
              </div>
            </div>

            <div className="relative hidden overflow-hidden md:block">
              <motion.span
                style={{
                  y: reduceMotion ? 0 : storyNumberY,
                }}
                className="pointer-events-none absolute -right-5 top-[8%] text-[25vw] font-medium leading-none tracking-[-0.1em] text-black/[0.035]"
              >
                01
              </motion.span>

              <svg
                viewBox="0 0 500 760"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  d="M251 753C252 668 240 629 250 574C263 500 314 474 293 390C276 322 210 303 219 226C226 162 281 133 272 57"
                  stroke="#171915"
                  strokeOpacity="0.08"
                  strokeWidth="2"
                />

                <motion.path
                  d="M251 753C252 668 240 629 250 574C263 500 314 474 293 390C276 322 210 303 219 226C226 162 281 133 272 57"
                  stroke="#1D6847"
                  strokeWidth="4"
                  strokeLinecap="round"
                  style={{
                    pathLength: reduceMotion ? 1 : plantPath,
                  }}
                />

                <motion.g
                  style={{
                    scale: reduceMotion ? 1 : leafOneScale,
                    transformOrigin: "272px 558px",
                  }}
                >
                  <path
                    d="M271 558C303 512 357 500 386 514C357 548 316 568 271 558Z"
                    fill="#1D6847"
                  />

                  <path
                    d="M272 558C314 538 346 525 384 515"
                    stroke="#F4F1E9"
                    strokeOpacity="0.4"
                    strokeWidth="1"
                  />
                </motion.g>

                <motion.g
                  style={{
                    scale: reduceMotion ? 1 : leafTwoScale,
                    transformOrigin: "265px 386px",
                  }}
                >
                  <path
                    d="M266 386C222 343 168 340 139 357C174 390 217 402 266 386Z"
                    fill="#1D6847"
                  />

                  <path
                    d="M265 386C222 370 185 363 141 357"
                    stroke="#F4F1E9"
                    strokeOpacity="0.4"
                    strokeWidth="1"
                  />
                </motion.g>

                <motion.g
                  style={{
                    scale: reduceMotion ? 1 : leafThreeScale,
                    transformOrigin: "225px 210px",
                  }}
                >
                  <path
                    d="M224 211C250 163 299 142 329 150C307 192 270 217 224 211Z"
                    fill="#F07D00"
                  />

                  <path
                    d="M225 210C265 184 293 166 328 151"
                    stroke="#F4F1E9"
                    strokeOpacity="0.45"
                    strokeWidth="1"
                  />
                </motion.g>

                <circle cx="251" cy="749" r="8" fill="#F07D00" />
              </svg>

              <div className="absolute inset-x-[8%] bottom-[8%] top-[8%]">
                <motion.div
                  style={{
                    opacity: reduceMotion ? 1 : statementOneOpacity,
                  }}
                  className="absolute right-0 top-[51%] max-w-[min(42%,260px)]"
                >
                  <span className="mb-3 block text-[10px] uppercase tracking-[0.26em] text-[#1D6847]">
                    <AboutText field="statement_1_label" />
                  </span>

                  <p className="text-[clamp(1rem,1.45vw,1.5rem)] font-medium leading-tight tracking-[-0.035em]">
                    <AboutText field="statement_1_text" />
                  </p>
                </motion.div>

                <motion.div
                  style={{
                    opacity: reduceMotion ? 1 : statementTwoOpacity,
                  }}
                  className="absolute left-0 top-[30%] max-w-[min(42%,270px)]"
                >
                  <span className="mb-3 block text-[10px] uppercase tracking-[0.26em] text-[#1D6847]">
                    <AboutText field="statement_2_label" />
                  </span>

                  <p className="text-[clamp(1rem,1.45vw,1.5rem)] font-medium leading-tight tracking-[-0.035em]">
                    <AboutText field="statement_2_text" />
                  </p>
                </motion.div>

                <motion.div
                  style={{
                    opacity: reduceMotion ? 1 : statementThreeOpacity,
                  }}
                  className="absolute right-[4%] top-[9%] max-w-[min(42%,280px)]"
                >
                  <span className="mb-3 block text-[10px] uppercase tracking-[0.26em] text-[#F07D00]">
                    <AboutText field="statement_3_label" />
                  </span>

                  <p className="text-[clamp(1rem,1.45vw,1.5rem)] font-medium leading-tight tracking-[-0.035em]">
                    <AboutText field="statement_3_text" />
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-0 right-[-72px] block h-[58svh] min-h-[390px] w-[330px] opacity-[0.72] sm:right-[-48px] sm:h-[62svh] sm:w-[360px] md:hidden">
              <svg viewBox="0 0 300 500" fill="none" className="h-full w-full">
                <motion.path
                  d="M143 500C141 413 171 374 151 303C135 244 93 228 116 157C132 108 182 82 177 10"
                  stroke="#1D6847"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{
                    pathLength: reduceMotion ? 1 : plantPath,
                  }}
                />
              </svg>
            </div>
          </div>
        </div>
      </section>
      <GeneralInformation reduceMotion={staticSections} />
      <VisionMission reduceMotion={staticSections} />
      <ClosingSlogan reduceMotion={reduceMotion} />
    </main>
    </AboutContentContext.Provider>
  );
}

function CinematicHero({ compactLayout }: { compactLayout: boolean }) {
  const { text, locale } = useAboutContent();
  const sectionRef = useRef<HTMLElement>(null);
  const clipId = `hero-frame-${useId().replace(/:/g, "")}`;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  return (
    <section
      ref={sectionRef}
      aria-label={text("hero_aria")}
      className="relative w-full bg-[#F4F1E9]"
    >
      {/* A single responsive silhouette: rounded bottom corners and a central rise. */}
      <svg
        aria-hidden="true"
        focusable="false"
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

      <div className="relative w-full">
        <div
          className="relative isolate flex min-h-[440px] flex-col overflow-hidden bg-[#17241A] text-white md:min-h-[520px] lg:min-h-[580px]"
          style={{
            clipPath: `url(#${clipId})`,
            WebkitClipPath: `url(#${clipId})`,
          }}
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 -z-20"
            style={{ scale: compactLayout ? 1 : imageScale }}
          >
            <ContentImage
              section="aboutPage"
              slot="hero"
              src="/hero3.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-black/25"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,17,11,0.28)_0%,rgba(8,17,11,0.05)_35%,rgba(8,17,11,0.8)_100%)]"
          />

          <div className="flex items-center justify-between gap-4 px-5 pt-[112px] sm:px-8 md:px-12 md:pt-[132px] lg:px-16">
            <nav aria-label={text("breadcrumb_aria")} className="min-w-0">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold tracking-[0.04em] text-white/90 sm:gap-x-3 md:text-xs">
                <li>
                  <Link
                    href={localizedHref("/", locale)}
                    className="inline-flex min-h-11 cursor-pointer items-center hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <AboutText field="home_label" />
                  </Link>
                </li>
                <li aria-hidden="true" className="text-white/60">
                  →
                </li>
                <li>
                  <Link
                    href={localizedHref("/about#about-us", locale)}
                    aria-current="page"
                    className="inline-flex min-h-11 cursor-pointer items-center hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <AboutText field="about_label" />
                  </Link>
                </li>
              </ol>
            </nav>
            <span className="text-[9px] uppercase tracking-[0.16em] text-white/75 md:text-[10px]">
              <AboutText field="since_label" />
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center px-5 pb-20 pt-10 md:pb-24 md:pt-12">
            <h1 className="whitespace-nowrap text-center text-[clamp(2rem,13.5vw,12rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-white/90">
              <AboutText field="hero_word" />
            </h1>
            <p className="mx-auto mt-5 max-w-[80%] text-center text-[9px] font-medium uppercase leading-5 tracking-[0.22em] text-white/85 md:mt-7 md:text-[10px] md:tracking-[0.35em]">
              <AboutText field="hero_tagline" />
            </p>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 flex h-[5%] -translate-x-1/2 items-center justify-center text-[#24734D]"
        >
          <FiArrowDown className="text-lg md:text-xl" />
        </div>
      </div>
      <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-5 sm:px-8 md:px-12 md:pb-16 lg:px-16">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.26em] text-[#24734D]">
          <AboutText field="hero_section_label" />
        </p>
        <h2 className="mx-auto mt-5 max-w-[900px] text-center text-[clamp(2rem,4.5vw,4.5rem)] font-medium leading-[1.08] tracking-[-0.05em] text-[#30362F]">
          <AboutText field="intro_title_1" />
          <br />
          <span className="text-[#24734D]"><AboutText field="intro_title_2" /></span>
        </h2>

        <div className="mt-9 grid gap-8 border-t border-[#24734D]/20 pt-7 md:mt-12 md:grid-cols-[0.6fr_1.4fr] md:gap-14">
          <div className="flex items-center gap-5 md:items-start">
            <span className="text-[clamp(2.75rem,5vw,4.5rem)] font-medium leading-none tracking-[-0.065em] text-[#24734D]">
              <AboutText field="start_year" />
            </span>
            <p className="max-w-[160px] text-xs leading-6 text-[#535A50] md:pt-1">
              <AboutText field="start_year_description" />
            </p>
          </div>
          <div className="max-w-[740px]">
            <p className="text-base leading-8 text-[#3E453B] md:text-lg md:leading-9">
              <AboutText field="intro_description" />
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-semibold uppercase leading-5 tracking-[0.13em] text-[#24734D] md:text-[11px]">
              <span><AboutText field="intro_tag_1" /></span>
              <span><AboutText field="intro_tag_2" /></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GeneralInformation({ reduceMotion }: { reduceMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { text } = useAboutContent();
  const generalInformation: GeneralInformationItem[] = Array.from({ length: 4 }, (_, index) => {
    const number = index + 1;
    return {
      index: String(number).padStart(2, "0"),
      title: [text(`history_${number}_title_1`), text(`history_${number}_title_2`)],
      body: [text(`history_${number}_body_1`), text(`history_${number}_body_2`), text(`history_${number}_body_3`)],
    };
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const count = generalInformation.length;

  const position = useTransform(
    scrollYProgress,
    (progress) => progress * (count - 1),
  );

  if (reduceMotion) {
    return (
      <section className="bg-[#111210] px-5 py-28 text-white md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1180px]">
          <span className="text-[10px] uppercase tracking-[0.34em] text-white/45">
            <AboutText field="general_label" />
          </span>

          <div className="mt-16">
            {generalInformation.map((item) => (
              <article
                key={item.index}
                className="border-t border-white/10 py-14"
              >
                <span className="text-xl font-semibold text-[#3F9B70]">
                  {item.index}
                </span>

                <div className="mt-8">
                  {item.title.map((line) => (
                    <h3
                      key={line}
                      className="text-[clamp(1.8rem,5vw,2.25rem)] font-normal leading-[1.12] tracking-[-0.05em] md:text-6xl"
                    >
                      {line}
                    </h3>
                  ))}
                </div>

                <div className="mt-8 space-y-2">
                  {item.body.map((line) => (
                    <p
                      key={line}
                      className="text-base leading-8 text-white/75 md:text-lg"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[470svh] bg-[#111210] text-[#F5F5F2] sm:h-[485svh] md:h-[500svh]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="relative mx-auto h-full max-w-[1180px] px-5 md:px-10">
          <div className="absolute left-5 right-5 top-[clamp(68px,10svh,92px)] z-[90] sm:top-[clamp(76px,11svh,104px)] md:left-10 md:right-10 md:top-[clamp(90px,14svh,134px)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/45">
                <AboutText field="general_label" />
              </span>

              <span className="hidden text-[9px] uppercase tracking-[0.3em] text-white/25 sm:block">
                <AboutText field="general_period" />
              </span>
            </div>
          </div>
          <div className="absolute left-5 top-[clamp(124px,17svh,150px)] z-[100] sm:top-[clamp(132px,18svh,166px)] md:left-10 md:top-[clamp(155px,23svh,214px)]">
            <RollingIndex position={position} />
          </div>

          <div className="absolute inset-0">
            {generalInformation.map((item, index) => (
              <GeneralInformationLayer
                key={item.index}
                item={item}
                index={index}
                position={position}
              />
            ))}
          </div>

          <div className="absolute bottom-7 left-5 right-5 z-[100] flex items-center justify-between border-t border-white/10 pt-4 md:left-10 md:right-10">
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/20">
              <AboutText field="general_period" />
            </span>

            <div className="flex items-center gap-3">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/25">
                <AboutText field="scroll_label" />
              </span>

              <FiArrowDown className="text-xs text-white/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RollingIndex({ position }: { position: MotionValue<number> }) {
  const digitY = useTransform(position, (value) => `${-value}em`);

  return (
    <div className="flex items-start text-[clamp(1.4rem,2vw,2rem)] font-semibold leading-none tracking-[0.08em] text-[#3F9B70]">
      <span className="block h-[1em] shrink-0">0</span>
      <div className="relative h-[1em] w-[0.72em] overflow-hidden">
        <motion.div
          style={{
            y: digitY,
          }}
          className="absolute left-0 top-0 flex flex-col will-change-transform"
        >
          <span className="block h-[1em]">1</span>

          <span className="block h-[1em]">2</span>

          <span className="block h-[1em]">3</span>

          <span className="block h-[1em]">4</span>
        </motion.div>
      </div>
    </div>
  );
}

function GeneralInformationLayer({
  item,
  index,
  position,
}: {
  item: GeneralInformationItem;
  index: number;
  position: MotionValue<number>;
}) {
  const local = useTransform(position, (value) => value - index);
  const y = useTransform(local, (value) => {
    if (value >= 0) {
      return 0;
    }

    return `min(${lerp(62, 0, smoothstep(-1, 0, value))}svh, 520px)`;
  });

  const opacity = useTransform(local, (value) => {
    if (value >= 0.98) return 0;
    if (value >= 0) return 1;
    return smoothstep(-0.92, -0.52, value);
  });

  return (
    <motion.article
      style={{
        y,
        opacity,
        zIndex: 20 + index,
      }}
      className="absolute left-5 right-5 top-[clamp(190px,29svh,255px)] md:left-10 md:right-10 md:top-[clamp(205px,30svh,290px)]"
    >
      <div className="max-w-[1080px]">
        <div>
          {item.title.map((line, lineIndex) => (
            <GeneralInfoLine
              key={`${item.index}-title-${lineIndex}`}
              text={line}
              type="title"
              lineIndex={lineIndex}
              lineCount={item.title.length}
              local={local}
            />
          ))}
        </div>
        <div className="mt-[clamp(0.9rem,2.6svh,1.75rem)] max-w-[1020px] sm:mt-[clamp(1rem,3svh,2rem)] md:mt-[clamp(1rem,4svh,2.5rem)]">
          {item.body.map((line, lineIndex) => (
            <GeneralInfoLine
              key={`${item.index}-body-${lineIndex}`}
              text={line}
              type="body"
              lineIndex={lineIndex}
              lineCount={item.body.length}
              local={local}
            />
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function GeneralInfoLine({
  text,
  type,
  lineIndex,
  lineCount,
  local,
}: {
  text: string;
  type: "title" | "body";
  lineIndex: number;
  lineCount: number;
  local: MotionValue<number>;
}) {
  const reversed = lineCount - 1 - lineIndex;

  const start =
    type === "body" ? 0.03 + reversed * 0.065 : 0.35 + reversed * 0.1;

  const grayEnd = start + 0.18;

  const disappearEnd = start + 0.31;

  const color = useTransform(local, (value) => {
    const fade = smoothstep(start, grayEnd, value);

    if (type === "title") {
      const channel = Math.round(lerp(245, 88, fade));

      return `rgb(${channel}, ${channel}, ${channel})`;
    }

    const channel = Math.round(lerp(150, 60, fade));

    return `rgb(${channel}, ${channel}, ${channel})`;
  });

  const opacity = useTransform(local, (value) => {
    if (value <= grayEnd) {
      return 1;
    }

    return 1 - smoothstep(grayEnd, disappearEnd, value);
  });

  const blur = useTransform(local, (value) => {
    const amount = smoothstep(grayEnd, disappearEnd, value);

    return `blur(${lerp(0, 1.6, amount)}px)`;
  });

  if (type === "title") {
    return (
      <motion.h3
        style={{
          color,
          opacity,
          filter: blur,
        }}
        className="text-[clamp(1.78rem,8.2vw,2.35rem)] font-normal leading-[1.02] tracking-[-0.052em] sm:text-[clamp(2rem,6.2vw,3rem)] md:text-[clamp(2.1rem,4.3vw,5.35rem)]"
      >
        {text}
      </motion.h3>
    );
  }

  return (
    <motion.p
      style={{
        color,
        opacity,
        filter: blur,
      }}
      className="text-[clamp(0.92rem,4.1vw,1.08rem)] leading-[1.48] tracking-[-0.018em] sm:text-[clamp(1rem,2.7vw,1.2rem)] sm:leading-[1.52] md:text-[clamp(1.05rem,1.65vw,1.55rem)] md:leading-[1.55]"
    >
      {text}
    </motion.p>
  );
}

function VisionMission({ reduceMotion }: { reduceMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { locale } = useAboutContent();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const missionX = useTransform(scrollYProgress, (progress) => {
    if (reduceMotion) {
      return "0%";
    }

    return `${lerp(100, 0, smoothstep(0.18, 0.83, progress))}%`;
  });

  if (reduceMotion) {
    return (
      <section className="bg-[#F5F3EC] px-5 py-28 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1760px]">
          <VisionStatic />

          <MissionStatic />
        </div>
      </section>
    );
  }

  return (
    <section id={localizedSectionId("vision", locale)} ref={sectionRef} className="relative h-[215svh] scroll-mt-24 bg-[#F5F3EC]">
      {locale === "tr" && <span id="vision" aria-hidden="true" className="pointer-events-none absolute left-0 top-0" />}
      <span id={localizedSectionId("mission", locale)} aria-hidden="true" className="pointer-events-none absolute left-0 top-[110svh] scroll-mt-24" />
      {locale === "tr" && <span id="mision" aria-hidden="true" className="pointer-events-none absolute left-0 top-[110svh]" />}
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0 bg-[#F5F3EC]">
          <div className="mx-auto flex h-full max-w-[1760px] flex-col px-5 pb-12 pt-[clamp(82px,13svh,120px)] md:px-10 md:pb-16 md:pt-[clamp(90px,14svh,136px)] lg:px-16 lg:pb-20">
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#1D6847]">03</span>

              <span className="h-px w-10 bg-black/20" />

              <span className="text-[10px] uppercase tracking-[0.3em] text-black/45">
                <AboutText field="vision_mission_label" />
              </span>
            </div>

            <div className="flex flex-1 items-center">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#1D6847]">
                  <AboutText field="vision_index" />
                </span>

                <h2 className="mt-7 max-w-[1450px] text-[clamp(3rem,7vw,10rem)] font-medium leading-[0.84] tracking-[-0.08em]">
                  <AboutText field="vision_title_1" />
                  <br />
                  <AboutText field="vision_title_2" />
                  <br />
                  <span className="text-[#1D6847]"><AboutText field="vision_title_accent" /></span>
                </h2>
              </div>
            </div>

            <div className="grid gap-8 border-t border-black/12 pt-6 md:grid-cols-12">
              <span className="text-[10px] uppercase tracking-[0.28em] text-black/35 md:col-span-3">
                <AboutText field="vision_caption" />
              </span>

              <p className="max-w-[720px] text-base leading-8 text-black/50 md:text-lg md:col-span-6 md:col-start-7">
                <AboutText field="vision_description" />
              </p>
            </div>
          </div>
        </div>

        <motion.div
          style={{
            x: missionX,
          }}
          className="absolute inset-0 z-30 bg-[#111210] text-white will-change-transform"
        >
          <div className="absolute bottom-0 left-0 top-0 w-[3px]" />

          <div className="mx-auto flex h-full max-w-[1760px] flex-col px-5 pb-12 pt-[clamp(82px,13svh,120px)] md:px-10 md:pb-16 md:pt-[clamp(90px,14svh,136px)] lg:px-16 lg:pb-20">
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#F07D00]">03</span>

              <span className="h-px w-10 bg-white/20" />

              <span className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                <AboutText field="vision_mission_label" />
              </span>
            </div>

            <div className="flex flex-1 items-center">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#F07D00]">
                  <AboutText field="mission_index" />
                </span>

                <h2 className="mt-7 max-w-[1450px] text-[clamp(3rem,7vw,10rem)] font-medium leading-[0.84] tracking-[-0.08em]">
                  <AboutText field="mission_title_1" />
                  <br />
                  <AboutText field="mission_title_2" />
                  <br />
                  <span className="text-[#F07D00]"><AboutText field="mission_title_accent" /></span>
                </h2>
              </div>
            </div>

            <div className="grid gap-8 border-t border-white/15 pt-6 md:grid-cols-12">
              <span className="text-[10px] uppercase tracking-[0.28em] text-white/35 md:col-span-3">
                <AboutText field="mission_caption" />
              </span>

              <p className="max-w-[720px] text-base leading-8 text-white/50 md:text-lg md:col-span-6 md:col-start-7">
                <AboutText field="mission_description" />
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
function VisionStatic() {
  const { locale } = useAboutContent();
  return (
    <article id={localizedSectionId("vision", locale)} className="relative scroll-mt-24 border-t border-black/10 py-16">
      {locale === "tr" && <span id="vision" aria-hidden="true" className="absolute left-0 top-0" />}
      <span className="text-[10px] uppercase tracking-[0.3em] text-[#1D6847]">
        <AboutText field="vision_index" />
      </span>

      <h2 className="mt-6 text-[clamp(2rem,6vw,5rem)] font-medium leading-[1.08] tracking-[-0.05em]">
        <AboutText field="vision_title_1" /> <AboutText field="vision_title_2" /> <AboutText field="vision_title_accent" />
      </h2>
      <p className="mt-7 max-w-3xl text-base leading-8 text-[#464942] md:text-lg">
        <AboutText field="vision_description" />
      </p>
    </article>
  );
}

function MissionStatic() {
  const { locale } = useAboutContent();
  return (
    <article id={localizedSectionId("mission", locale)} className="relative scroll-mt-24 border-t border-black/10 py-16">
      {locale === "tr" && <span id="mision" aria-hidden="true" className="absolute left-0 top-0" />}
      <span className="text-[10px] uppercase tracking-[0.3em] text-[#F07D00]">
        <AboutText field="mission_index" />
      </span>

      <h2 className="mt-6 text-[clamp(2rem,6vw,5rem)] font-medium leading-[1.08] tracking-[-0.05em]">
        <AboutText field="mission_title_1" /> <AboutText field="mission_title_2" /> <AboutText field="mission_title_accent" />
      </h2>
      <p className="mt-7 max-w-3xl text-base leading-8 text-[#464942] md:text-lg">
        <AboutText field="mission_description" />
      </p>
    </article>
  );
}

function ClosingSlogan({ reduceMotion }: { reduceMotion: boolean }) {
  const { text } = useAboutContent();
  const words = [text("slogan_word_1"), text("slogan_word_2"), text("slogan_word_3")];
  let letterStart = 0;
  const sloganWords = words.map(word => {
    const result = { text: word, start: letterStart };
    letterStart += Array.from(word).length;
    return result;
  });
  const letterCount = Math.max(1, letterStart);
  const sectionRef = useRef<HTMLElement>(null);
  // Begin as the section enters the upper third of the viewport.
  // Finish at its bottom so every letter can reveal without a footer.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.35", "end end"],
  });
  const { scrollYProgress: parallaxProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(parallaxProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="closing-slogan"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-white text-black"
    >
      {/* Desktop: the same fixed-background parallax as the contact reference. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 hidden bg-cover bg-center bg-no-repeat md:block"
        style={{
          backgroundImage: "url('/hero3.png')",
          backgroundAttachment: reduceMotion ? "scroll" : "fixed",
        }}
      />
      {/* Mobile: larger scroll travel with enough overscan to hide the edges. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-[40%] inset-x-0 -z-20 md:hidden"
        style={{ y: reduceMotion ? 0 : imageY }}
      >
        <Image
          src="/hero3.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-white/80"
      />

      <div className="mx-auto flex w-full max-w-[1760px] flex-1 flex-col px-5 pb-7 pt-8 md:px-10 md:pb-9 md:pt-12 lg:px-16">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/20 pb-5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#24734D] md:text-[11px]">
            <AboutText field="closing_brand" />
          </span>
          <span className="text-[9px] uppercase tracking-[0.16em] text-black/55 md:text-[10px]">
            <AboutText field="since_label" />
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center py-20 text-center md:py-24">
          <div className="mb-8 flex items-center justify-center gap-4 md:mb-10">
            <span aria-hidden="true" className="h-px w-9 bg-[#24734D]/45" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#24734D] md:text-xs">
              <AboutText field="motto_label" />
            </span>
            <span aria-hidden="true" className="h-px w-9 bg-[#24734D]/45" />
          </div>

          <h2
            id="closing-slogan"
            className="w-full max-w-[1500px] text-[clamp(1.75rem,10.5vw,8.5rem)] font-medium leading-[1.08] tracking-[-0.055em] lg:text-[clamp(4rem,6.8vw,8.5rem)]"
          >
            <span className="sr-only">{words.join(" ")}</span>
            <span
              aria-hidden="true"
              className="flex flex-wrap items-baseline justify-center gap-x-[0.23em] gap-y-[0.06em]"
            >
              {sloganWords.map((word) => (
                <span key={word.text} className="whitespace-nowrap">
                  {Array.from(word.text).map((letter, index) => (
                    <SloganLetter
                      key={`${word.text}-${index}`}
                      letter={letter}
                      index={word.start + index}
                      progress={scrollYProgress}
                      reduceMotion={reduceMotion}
                      letterCount={letterCount}
                      targetColor={
                        letter === "."
                          ? "#F07D00"
                          : word === sloganWords[1] && index < 6
                            ? "#24734D"
                            : "#353735"
                      }
                    />
                  ))}
                </span>
              ))}
            </span>
          </h2>

          <p className="mt-8 max-w-[620px] text-base font-medium leading-8 text-[#353735] md:mt-10 md:text-lg md:leading-9">
            <AboutText field="slogan_description" />
          </p>

          <div className="mt-9 w-full max-w-[340px] md:mt-10">
            <SloganContactButton />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-t border-black/15 pt-5 text-center text-[9px] uppercase tracking-[0.18em] text-black/55 sm:justify-between md:text-[10px]">
          <span><AboutText field="closing_bottom_1" /></span>
          <span><AboutText field="closing_bottom_2" /></span>
        </div>
      </div>
    </section>
  );
}

function SloganContactButton() {
  const { text, locale } = useAboutContent();
  return (
    <Link
      href={localizedHref("/contact", locale)}
      aria-label={text("contact_button_aria")}
      className="group relative inline-flex min-h-14 w-full max-w-full cursor-pointer items-center justify-between gap-3 overflow-visible border-b-2 border-[#24734D] py-4 text-[#242824] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24734D]"
    >
      <span
        aria-hidden="true"
        className="relative block min-h-[24px] min-w-0 flex-1 overflow-hidden"
      >
        <span className="absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(0.6875rem,2.8vw,0.8125rem)] font-bold uppercase tracking-[0.08em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-6 group-hover:opacity-0 group-focus-visible:-translate-x-6 group-focus-visible:opacity-0 motion-reduce:transition-none">
          <AboutText field="contact_button" />
        </span>
        <span className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-7 whitespace-nowrap text-[clamp(0.6875rem,2.8vw,0.8125rem)] font-bold uppercase tracking-[0.04em] text-[#24734D] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none">
          <AboutText field="contact_button_hover" />
        </span>
      </span>
      <span className="flex h-6 w-6 shrink-0 items-center justify-center transition-colors duration-500 group-hover:text-[#24734D] group-focus-visible:text-[#24734D] motion-reduce:transition-none">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="h-[18px] w-[18px] -rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[3px] group-hover:rotate-0 group-focus-visible:translate-x-[3px] group-focus-visible:rotate-0 motion-reduce:transition-none"
        >
          <path
            d="M5 12H19"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M14 7L19 12L14 17"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#24734D] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
      />
    </Link>
  );
}

function SloganLetter({
  letter,
  index,
  progress,
  reduceMotion,
  letterCount,
  targetColor,
}: {
  letter: string;
  index: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
  letterCount: number;
  targetColor: string;
}) {
  const start = 0.05 + (index / letterCount) * 0.9;
  const end = 0.05 + ((index + 1) / letterCount) * 0.9;
  const color = useTransform(progress, [start, end], ["#969B97", targetColor]);

  return (
    <motion.span style={{ color: reduceMotion ? targetColor : color }}>
      {letter}
    </motion.span>
  );
}
