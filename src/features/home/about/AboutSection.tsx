"use client";

import { ContentText, ContentImage } from "@/features/home/content/HomeContent";
import { useHomeLocale } from "@/features/home/content/LocaleProvider";
import { localizedHref } from "@/lib/site-routing";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import hero3 from "@/assets/hero3.png";
import hero4 from "@/assets/hero4.png";
import icon from "@/assets/icon.png";

const HEADER_HEIGHT = "88px";

function SoftDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative h-[2px] w-full ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(23,26,22,0.025) 0%, rgba(23,26,22,0.075) 18%, rgba(23,26,22,0.13) 50%, rgba(23,26,22,0.075) 82%, rgba(23,26,22,0.025) 100%)",
          clipPath:
            "polygon(0% 44%, 16% 41%, 38% 31%, 50% 18%, 62% 31%, 84% 41%, 100% 44%, 100% 56%, 84% 59%, 62% 69%, 50% 82%, 38% 69%, 16% 59%, 0% 56%)",
        }}
      />
    </div>
  );
}

function SoftVerticalDivider({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative h-full w-[2px] ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(23,26,22,0.025) 0%, rgba(23,26,22,0.075) 18%, rgba(23,26,22,0.13) 50%, rgba(23,26,22,0.075) 82%, rgba(23,26,22,0.025) 100%)",
          clipPath:
            "polygon(44% 0%, 41% 16%, 31% 38%, 18% 50%, 31% 62%, 41% 84%, 44% 100%, 56% 100%, 59% 84%, 69% 62%, 82% 50%, 69% 38%, 59% 16%, 56% 0%)",
        }}
      />
    </div>
  );
}

  function SectionLabel({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="flex items-center gap-3.5">
        <span
          className="relative block h-[8px] w-[27px] shrink-0"
          aria-hidden="true"
        >
          <span
            className="absolute left-0 top-[1px] h-[1px] w-[27px]"
            style={{
              background:
                "linear-gradient(90deg, rgba(36,115,77,0.28), rgba(36,115,77,0.8), rgba(36,115,77,0.2))",
            }}
          />

          <span
            className="absolute bottom-[1px] left-[7px] h-[1px] w-[20px]"
            style={{
              background:
                "linear-gradient(90deg, rgba(36,115,77,0.12), rgba(36,115,77,0.44), rgba(36,115,77,0.1))",
            }}
          />
        </span>

        <span className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[#171A16]">
          {children}
        </span>
      </div>
    );
  }

function RotatingSeal({ pathId }: { pathId: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={
        reduceMotion
          ? undefined
          : {
              scale: 1.09,
            }
      }
      transition={{
        scale: {
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      className="
        relative
        aspect-square
        h-full
        w-full
        origin-center
        overflow-visible
        will-change-transform
      "
    >
      {/* INNER GUIDE */}

      <div className="pointer-events-none absolute inset-[8%] rounded-full border border-black/[0.055]" />

      {/* ROTATING TEXT */}

      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-[5%] h-[90%] w-[90%] overflow-visible"
        animate={
          reduceMotion
            ? undefined
            : {
                rotate: 360,
              }
        }
        transition={{
          rotate: {
            duration: 24,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        style={{
          willChange: "transform",
        }}
        aria-hidden="true"
      >
        <defs>
          <path
            id={pathId}
            d="
              M 100, 100
              m -73, 0
              a 73,73 0 1,1 146,0
              a 73,73 0 1,1 -146,0
            "
          />
        </defs>

        <text
          fill="#39362F"
          fontSize="10.2"
          fontWeight="700"
          letterSpacing="3.2"
        >
          <textPath href={`#${pathId}`}><ContentText section="about" field="toprak_tarim_2001_konya_toprak_tarim" svg /></textPath>
        </text>
      </motion.svg>

      <div
        className="
          absolute
          left-1/2
          top-1/2
          flex
          h-[42%]
          w-[42%]
          -translate-x-1/2
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-black/[0.055]
          shadow-[0_10px_40px_rgba(35,32,27,0.055)]
        "
      >
        <div className="relative h-[52%] w-[52%]">
          <ContentImage section="about" slot="seal" src={icon}
            alt="Toprak Tarım" altField="image_brand_alt"
            fill
            sizes="100px"
            className="object-contain"
          />
        </div>
      </div>
    </motion.div>
  );
}

function AboutButton() {
  const { locale } = useHomeLocale();
  return (
    <Link
      href={localizedHref("/about", locale)}
      className="
        group
        relative
        inline-flex
        w-full
        max-w-[300px]
        items-center
        justify-between
        overflow-visible
        pb-4
        text-[#171A16]
      "
    >
      {/* TEXT AREA */}
      <span className="relative block h-[20px] flex-1 overflow-hidden">
        {/* DEFAULT */}
        <span
          className="
            absolute
            left-0
            top-1/2
            -translate-y-1/2
            whitespace-nowrap
            text-[12px]
            font-semibold
            uppercase
            tracking-[0.17em]
            transition-all
            duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]

            group-hover:-translate-x-6
            group-hover:-translate-y-1/2
            group-hover:opacity-0
          "
        ><ContentText section="about" field="hakkimizda" /></span>

        {/* HOVER TEXT */}
        <span
          className="
            absolute
            left-0
            top-1/2
            translate-x-7
            -translate-y-1/2
            whitespace-nowrap
            text-[12px]
            font-semibold
            uppercase
            tracking-[0.15em]
            text-[#24734D]
            opacity-0
            transition-all
            duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]

            group-hover:translate-x-0
            group-hover:-translate-y-1/2
            group-hover:opacity-100
          "
        ><ContentText section="about" field="bizi_daha_yakindan_taniyin" /></span>
      </span>

      {/* ARROW */}
      <span
        className="
          ml-8
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          transition-colors
          duration-500
          group-hover:text-[#24734D]
        "
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="
            h-[18px]
            w-[18px]
            -rotate-45
            transition-transform
            duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]

            group-hover:rotate-0
            group-hover:translate-x-[3px]
          "
          aria-hidden="true"
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

      {/* BASE LINE */}
      <span className="absolute bottom-0 left-0 h-px w-full bg-black/[0.12]" />

      {/* HOVER LINE */}
      <span
        className="
          absolute
          bottom-0
          left-0
          h-px
          w-full
          origin-left
          scale-x-0
          bg-[#24734D]
          transition-transform
          duration-700
          ease-[cubic-bezier(0.22,1,0.36,1)]

          group-hover:scale-x-100
        "
      />
    </Link>
  );
}

function MobileAbout() {
  const { locale } = useHomeLocale();
  return (
    <section lang={locale} className="overflow-hidden bg-[#F4F1EA] text-[#171A16] min-[1280px]:hidden">
      {/* CHAPTER 01 */}
      <div className="mx-auto w-full max-w-[1180px] px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 md:px-10 md:pb-28 lg:px-12 lg:pt-24">
        <div>
          <div className="flex items-center justify-between gap-4">
            <SectionLabel><ContentText section="about" field="hakkimizda" /></SectionLabel>

            <span className="shrink-0 text-[8px] uppercase tracking-[0.18em] text-black/35 sm:text-[9px] sm:tracking-[0.2em]">
              01 / 03
            </span>
          </div>

          <SoftDivider className="mt-4" />
        </div>

        <div className="pt-9 sm:pt-11 md:pt-12 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 lg:pt-14">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:col-span-5 lg:pr-3"
          >
            <span className="text-[8px] font-semibold uppercase tracking-[0.24em] text-[#24734D] sm:text-[9px] sm:tracking-[0.26em]"><ContentText section="about" field="toprak_tarim" /></span>

            <h2 className="mt-4 max-w-[9ch] text-[clamp(3.15rem,14.2vw,5.1rem)] font-medium leading-[0.88] tracking-[-0.07em] sm:mt-5 sm:text-[clamp(4rem,10.5vw,6rem)] md:text-[clamp(4.7rem,8.4vw,6.7rem)] lg:text-[clamp(4.6rem,6.8vw,5.8rem)]"><ContentText section="about" field="topragin" /><br /><ContentText section="about" field="icinden" /><br /><span className="text-[#24734D]"><ContentText section="about" field="gelecege" /></span></h2>

            <div className="mt-9 hidden max-w-[470px] lg:block">
              <SoftDivider />

              <div className="grid grid-cols-[56px_1fr] gap-3 pt-5">
                <span className="pt-[2px] text-[9px] font-semibold tracking-[0.18em] text-[#24734D]">
                  ↳ 01
                </span>

                <p className="text-[13px] leading-[1.75] tracking-[-0.01em] text-black/55"><ContentText section="about" field="toprak_tarim_2001_yilinda_konya_ovasinda" /></p>
              </div>
            </div>
          </motion.div>

          <div className="mt-10 sm:mt-12 md:mt-14 lg:col-span-7 lg:mt-0">
            {/* MAIN IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.985 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="about-mobile-main-image relative aspect-[1.315/1] w-full overflow-hidden rounded-tl-[26%] rounded-br-[23%] sm:rounded-tl-[30%] sm:rounded-br-[26%] md:mx-auto md:max-w-[780px] md:rounded-tl-[32%] md:rounded-br-[28%] lg:max-w-none"
            >
              <motion.div
                initial={{ scale: 1.025 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0"
              >
                <ContentImage section="about" slot="primary" src={hero3} alt="Toprak Tarım üretim alanı" altField="image_primary_alt" fill priority sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 80px), (max-width: 1279px) 54vw, 32vw" className="object-cover object-center" />
              </motion.div>

              <div className="absolute inset-0 bg-black/[0.055]" />
            </motion.div>

            {/* LOWER VISUALS */}
            <div className="mx-auto mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4 md:max-w-[780px] md:gap-5 lg:max-w-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.75,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative aspect-square overflow-hidden rounded-tr-[42%] rounded-bl-[42%] sm:rounded-tr-[48%] sm:rounded-bl-[48%]"
              >
                <ContentImage section="about" slot="secondary" src={hero4} alt="Toprak Tarım tarımsal üretim" altField="image_secondary_alt" fill sizes="(max-width: 767px) calc(50vw - 26px), (max-width: 1023px) 360px, (max-width: 1279px) 27vw, 16vw" className="object-cover object-center" />

                <div className="absolute inset-0 bg-black/[0.055]" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="aspect-square"
              >
                <RotatingSeal pathId="mobile-about-seal-path" />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 md:mx-auto md:mt-14 md:max-w-[780px] lg:hidden">
          <SoftDivider />

          <div className="grid grid-cols-[42px_1fr] gap-2 pt-5 sm:grid-cols-[58px_1fr] sm:gap-3 md:grid-cols-[76px_1fr] md:pt-6">
            <span className="pt-[2px] text-[9px] font-semibold tracking-[0.18em] text-[#24734D] sm:text-[10px] sm:tracking-[0.2em]">
              ↳ 01
            </span>

            <p className="max-w-2xl text-[13px] leading-[1.75] tracking-[-0.01em] text-black/55 sm:text-[14px] md:text-[15px] md:leading-[1.8]"><ContentText section="about" field="toprak_tarim_2001_yilinda_konya_ovasinda" /></p>
          </div>
        </div>
      </div>

      {/* CHAPTER 02 */}
      <div className="rounded-t-[28px] bg-[#E9E4DA] sm:rounded-t-[36px]">
        <div className="mx-auto w-full max-w-[1180px] px-5 pb-20 pt-7 sm:px-8 sm:pb-24 sm:pt-8 md:px-10 md:pb-28 lg:px-12">
          <div>
            <div className="flex items-center justify-between gap-4">
              <SectionLabel><ContentText section="about" field="birikim" /></SectionLabel>

              <span className="shrink-0 text-[8px] tracking-[0.18em] text-black/30 sm:text-[9px] sm:tracking-[0.2em]">
                02 / 03
              </span>
            </div>

            <SoftDivider className="mt-4" />
          </div>

          <div className="mt-10 sm:mt-12 md:mt-14">
            <div className="flex items-end gap-4 md:max-w-[900px]">
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="whitespace-nowrap text-[clamp(6.7rem,34vw,9.4rem)] font-medium leading-[0.65] tracking-[-0.12em] text-[#1D6847] sm:text-[clamp(9rem,26vw,12.5rem)] md:text-[clamp(10.5rem,19vw,14rem)]"
              ><ContentText section="about" field="experience_mobile" /></motion.span>

              <div className="mb-1 ml-auto shrink-0 text-right sm:mb-2">
                <span className="block text-[9px] font-medium uppercase tracking-[0.18em] sm:text-[10px] sm:tracking-[0.2em]"><ContentText section="about" field="yillik" /></span>

                <span className="mt-1 block text-[9px] uppercase tracking-[0.18em] text-black/40 sm:text-[10px] sm:tracking-[0.2em]"><ContentText section="about" field="tecrube" /></span>
              </div>
            </div>

            <div className="mt-9 grid grid-cols-[0.82fr_1.18fr] gap-3 sm:mt-10 sm:grid-cols-[0.86fr_1.14fr] sm:gap-5 md:mt-12 md:max-w-[920px] md:grid-cols-[0.9fr_1.1fr] md:gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-10">
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[3/4] min-w-0 overflow-hidden rounded-[4px] md:aspect-[4/5]"
              >
                <ContentImage section="about" slot="secondary" src={hero4} alt="Toprak Tarım" altField="image_brand_alt" fill sizes="(max-width: 767px) 42vw, 380px" className="object-cover object-center" />
              </motion.div>

              <div className="relative flex min-w-0 flex-col justify-end pl-4 sm:pl-5 md:pl-7">
                <SoftVerticalDivider className="absolute bottom-0 left-0 top-0" />

                <span className="text-[8px] uppercase tracking-[0.18em] text-black/30 sm:text-[9px] sm:tracking-[0.2em]"><ContentText section="about" field="experience_period" /></span>

                <h3 className="mt-4 text-[clamp(1.65rem,8vw,2.3rem)] font-medium leading-[0.98] tracking-[-0.05em] sm:mt-5 sm:text-[clamp(2rem,6vw,2.9rem)] md:text-[clamp(2.5rem,4.4vw,3.6rem)]"><ContentText section="about" field="deneyimi" /><br /><ContentText section="about" field="gelecege_2" /><br /><ContentText section="about" field="tasiyoruz" /></h3>

                <p className="mt-4 max-w-md text-[10px] leading-[1.7] text-black/48 sm:mt-5 sm:text-[12px] sm:leading-[1.75] md:text-[13px]"><ContentText section="about" field="gecmisten_gelen_bilgi_birikimini_gelecegin_uretim" /></p>
              </div>
            </div>

            <p className="mt-9 max-w-2xl text-[13px] leading-[1.75] tracking-[-0.01em] text-black/55 sm:mt-10 sm:text-[14px] md:mt-12 md:text-[15px] md:leading-[1.8]"><ContentText section="about" field="deneyimi_gecmise_ait_bir_sayi_olarak" /></p>
          </div>
        </div>
      </div>

      {/* CHAPTER 03 */}
      <div className="rounded-t-[28px] bg-[#F7F4ED] sm:rounded-t-[36px]">
        <div className="mx-auto w-full max-w-[1180px] px-5 pb-16 pt-7 sm:px-8 sm:pb-20 sm:pt-8 md:px-10 md:pb-24 lg:px-12">
          <div>
            <div className="flex items-center justify-between gap-4">
              <SectionLabel><ContentText section="about" field="daha_fazlasi" /></SectionLabel>

              <span className="shrink-0 text-[8px] tracking-[0.18em] text-black/30 sm:text-[9px] sm:tracking-[0.2em]">
                03 / 03
              </span>
            </div>

            <SoftDivider className="mt-4" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="py-14 sm:py-16 md:py-20 lg:py-24"
          >
            <span className="text-[8px] font-semibold uppercase tracking-[0.23em] text-[#24734D] sm:text-[9px] sm:tracking-[0.25em]"><ContentText section="about" field="toprak_tarim" /></span>

            <h3 className="mt-5 max-w-[10ch] text-[clamp(2.9rem,12.8vw,4.7rem)] font-medium leading-[0.9] tracking-[-0.065em] sm:mt-6 sm:text-[clamp(3.8rem,9.6vw,5.5rem)] md:text-[clamp(4.5rem,7.5vw,6.3rem)] lg:text-[clamp(5rem,6.6vw,6.8rem)]"><ContentText section="about" field="hikyemizi" /><br /><ContentText section="about" field="daha_yakindan" /><br /><span className="text-[#24734D]"><ContentText section="about" field="kesfedin" /></span></h3>

            <p className="mt-7 max-w-xl text-[13px] leading-[1.75] text-black/48 sm:mt-8 sm:text-[14px] md:max-w-2xl md:text-[15px] md:leading-[1.8]"><ContentText section="about" field="uretim_anlayisimizi_degerlerimizi_ve_toprak_tarimin" /></p>

            <div className="mt-10 max-w-[300px] sm:mt-12">
              <AboutButton />
            </div>
          </motion.div>

          <SoftDivider />

          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-5">
            <span className="text-[8px] uppercase tracking-[0.18em] text-black/30 sm:tracking-[0.2em]">
              <ContentText section="about" field="est_2001" />
            </span>

            <span className="text-[8px] uppercase tracking-[0.18em] text-black/30 sm:tracking-[0.2em]">
              <ContentText section="about" field="konya_turkiye" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   DESKTOP
   ========================================================================== */

function DesktopAbout() {
  const { locale } = useHomeLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const scroll = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 26,
    mass: 0.32,
  });

  /* -----------------------------------------------------------------------
     PANEL TRANSITIONS
     ----------------------------------------------------------------------- */

  const chapter2Y = useTransform(
    scroll,
    [0.24, 0.43],
    ["100%", "0%"]
  );

  const chapter3Y = useTransform(
    scroll,
    [0.58, 0.79],
    ["100%", "0%"]
  );

  const chapter1Scale = useTransform(
    scroll,
    [0, 0.4],
    [1, 0.965]
  );

  const chapter1Opacity = useTransform(
    scroll,
    [0.25, 0.43],
    [1, 0.45]
  );

  const chapter2Scale = useTransform(
    scroll,
    [0.43, 0.76],
    [1, 0.97]
  );

  /* -----------------------------------------------------------------------
     CHAPTER 1
     ----------------------------------------------------------------------- */

  const image1Scale = useTransform(
    scroll,
    [0, 0.4],
    [1.08, 1]
  );

  const image1Y = useTransform(
    scroll,
    [0, 0.4],
    ["-3%", "3%"]
  );

  const introY = useTransform(
    scroll,
    [0, 0.35],
    [0, -35]
  );

  const smallImageY = useTransform(
    scroll,
    [0, 0.4],
    [22, -5]
  );

  const sealY = useTransform(
    scroll,
    [0, 0.4],
    [32, -2]
  );

  /* -----------------------------------------------------------------------
     CHAPTER 2
     ----------------------------------------------------------------------- */

  const twentyFiveX = useTransform(
    scroll,
    [0.35, 0.67],
    [-35, 0]
  );

  const image2Scale = useTransform(
    scroll,
    [0.38, 0.72],
    [1.14, 1]
  );

  const image2Y = useTransform(
    scroll,
    [0.38, 0.72],
    ["6%", "-3%"]
  );

  /* -----------------------------------------------------------------------
     CHAPTER 3
     ----------------------------------------------------------------------- */

  const finalContentY = useTransform(
    scroll,
    [0.7, 0.88],
    [45, 0]
  );

  const finalContentOpacity = useTransform(
    scroll,
    [0.7, 0.82],
    [0, 1]
  );

  const finalLineScale = useTransform(
    scroll,
    [0.78, 0.94],
    [0, 1]
  );

  /* -----------------------------------------------------------------------
     PROGRESS
     ----------------------------------------------------------------------- */

  const progressScale = useTransform(scroll, [0, 1], [0, 1]);

  return (
    <section
      lang={locale}
      ref={sectionRef}
      className="relative hidden h-[340vh] bg-[#F4F1EA] min-[1280px]:block"
    >
      <div
        className="about-desktop-sticky sticky overflow-hidden"
        style={{
          top: HEADER_HEIGHT,
          height: `calc(100svh - ${HEADER_HEIGHT})`,
        }}
      >
        {/* ================================================================ */}
        {/* CHAPTER 01                                                       */}
        {/* ================================================================ */}

        <motion.article
          style={{
            scale: reduceMotion ? 1 : chapter1Scale,
            opacity: chapter1Opacity,
          }}
          className="absolute inset-0 bg-[#F4F1EA] text-[#171A16]"
        >
          {/* HEADER */}

          <div className="absolute left-[4vw] right-[4vw] top-[4.5vh]">
            <div className="flex items-center justify-between">
              <SectionLabel><ContentText section="about" field="hakkimizda" /></SectionLabel>

              <div className="flex gap-10 text-[8px] uppercase tracking-[0.21em] text-black/35">
                <span><ContentText section="about" field="toprak_tarim" /></span>
                <span><ContentText section="about" field="konya_turkiye" /></span>
                <span>01 / 03</span>
              </div>
            </div>

            <SoftDivider className="mt-[2vh]" />
          </div>

          {/* CONTENT */}

          <div className="absolute bottom-[5vh] left-[4vw] right-[4vw] top-[14vh]">
            <div className="grid h-full grid-cols-12 gap-[2vw]">
              {/* LEFT */}

              <motion.div
                style={{
                  y: reduceMotion ? 0 : introY,
                }}
                className="
                  col-span-5
                  flex
                  h-full
                  flex-col
                  justify-between
                  pl-[clamp(34px,2.45vw,50px)]
                "
              >
                <div className="pt-[4vh]">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#24734D]"><ContentText section="about" field="est_2001" /></span>

                  <h2 className="about-desktop-title mt-[4vh] text-[clamp(5.2rem,7.2vw,9.3rem)] font-medium leading-[0.83] tracking-[-0.08em]"><ContentText section="about" field="topragin" /><br /><ContentText section="about" field="icinden" /><br />
                    <span className="text-[#24734D]"><ContentText section="about" field="gelecege" /></span>
                  </h2>
                </div>

                <div className="max-w-[610px]">
                  <SoftDivider />

                  <div className="grid grid-cols-[88px_1fr] pt-5">
                    <span className="pt-[2px] text-[10px] font-semibold tracking-[0.2em] text-[#24734D]">
                      ↳ 01
                    </span>

                    <p className="text-[clamp(0.84rem,0.82vw,0.98rem)] leading-[1.78] tracking-[-0.01em] text-black/55"><ContentText section="about" field="toprak_tarim_2001_yilinda_konya_ovasinda_2" /></p>
                  </div>
                </div>
              </motion.div>

              {/* RIGHT */}

              <div className="col-span-7 flex h-full items-center justify-center">
                <div className="about-desktop-visual w-[clamp(360px,29vw,560px)]">
                  {/* MAIN IMAGE */}

                  <div className="relative aspect-[1.315/1] overflow-hidden rounded-tl-[34%] rounded-br-[29%]">
                    <motion.div
                      style={{
                        scale: reduceMotion ? 1 : image1Scale,
                        y: reduceMotion ? 0 : image1Y,
                      }}
                      className="absolute inset-0"
                    >
                      <ContentImage section="about" slot="primary" src={hero3}
                        alt="Toprak Tarım üretim alanı" altField="image_primary_alt"
                        fill
                        priority
                        sizes="(max-width: 1599px) 34vw, 32vw"
                        className="object-cover object-center"
                      />
                    </motion.div>

                    <div className="absolute inset-0 bg-black/[0.10]" />
                  </div>

                  {/* LOWER ROW */}

                  <div className="mt-[clamp(10px,0.75vw,15px)] grid grid-cols-2 gap-[clamp(10px,0.75vw,15px)]">
                    <motion.div
                      style={{
                        y: reduceMotion ? 0 : smallImageY,
                      }}
                      className="
                        relative
                        aspect-square
                        overflow-hidden
                        rounded-tr-[48%]
                        rounded-bl-[48%]
                      "
                    >
                      <ContentImage section="about" slot="secondary" src={hero4}
                        alt="Toprak Tarım tarımsal üretim" altField="image_secondary_alt"
                        fill
                        sizes="16vw"
                        className="object-cover"
                      />

                      <div className="absolute inset-0 bg-black/[0.08]" />
                    </motion.div>

                    <motion.div
                      style={{
                        y: reduceMotion ? 0 : sealY,
                      }}
                      className="aspect-square"
                    >
                      <RotatingSeal pathId="desktop-about-seal-path" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.article>

        {/* ================================================================ */}
        {/* CHAPTER 02                                                       */}
        {/* ================================================================ */}

        <motion.article
          style={{
            y: reduceMotion ? "0%" : chapter2Y,
            scale: reduceMotion ? 1 : chapter2Scale,
          }}
          className="absolute inset-0 z-20 overflow-hidden rounded-t-[46px] bg-[#E9E4DA] text-[#171A16] shadow-[0_-30px_80px_rgba(20,30,20,0.05)]"
        >
          {/* HEADER */}

          <div className="absolute left-[4vw] right-[4vw] top-[4.5vh]">
            <div className="flex items-center justify-between">
              <SectionLabel><ContentText section="about" field="birikim" /></SectionLabel>

              <div className="flex items-center gap-10 text-[8px] uppercase tracking-[0.21em] text-black/35">
                <span><ContentText section="about" field="experience_period" /></span>
                <span>02 / 03</span>
              </div>
            </div>

            <SoftDivider className="mt-[2vh]" />
          </div>

          <div className="absolute bottom-[6vh] left-[4vw] right-[4vw] top-[15vh]">
            <div className="grid h-full grid-cols-12 gap-[2vw]">
              {/* BIG NUMBER */}

              <div className="col-span-5 flex h-full flex-col justify-between">
                <div className="pt-[3vh]">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#24734D]"><ContentText section="about" field="yillarin_birikimi" /></span>

                  <motion.div
                    style={{
                      x: reduceMotion ? 0 : twentyFiveX,
                    }}
                    className="mt-[9vh]"
                  >
                    <div className="about-desktop-number text-[clamp(12rem,18vw,23rem)] font-medium leading-[0.55] tracking-[-0.12em] text-[#1F6948]"><ContentText section="about" field="experience_desktop" /></div>

                    <div className="mt-[5vh] max-w-[500px]">
                      <SoftDivider />

                      <div className="flex items-center justify-between pt-5">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em]"><ContentText section="about" field="yillik_tecrube" /></span>

                        <span className="text-[9px] uppercase tracking-[0.2em] text-black/35"><ContentText section="about" field="est_2001" /></span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <p className="max-w-[470px] text-[clamp(0.95rem,1.05vw,1.16rem)] leading-[1.68] tracking-[-0.015em] text-black/55"><ContentText section="about" field="deneyimi_gecmise_ait_bir_sayi_olarak" /></p>
              </div>

              {/* VISUAL */}

              <div className="col-span-7 grid h-full grid-cols-[1fr_0.48fr] gap-[1.5vw]">
                <div className="relative h-full overflow-hidden">
                  <motion.div
                    style={{
                      scale: reduceMotion ? 1 : image2Scale,
                      y: reduceMotion ? 0 : image2Y,
                    }}
                    className="relative h-[110%] w-full"
                  >
                    <ContentImage section="about" slot="secondary" src={hero4}
                      alt="Toprak Tarım üretim süreci"
                      fill
                      sizes="45vw"
                      className="object-cover"
                    />
                  </motion.div>

                  <div className="absolute inset-0 bg-black/[0.04]" />
                </div>

                <div className="relative flex h-full flex-col justify-between pl-[2vw]">
  <div>
    <div className="mb-4 h-[8vh] w-px bg-black/15" />

    <span className="text-[8px] uppercase tracking-[0.23em] text-black/35"><ContentText section="about" field="dun" /></span>

    {/* DÜN → BUGÜN */}
    <div className="my-4 h-[8vh] w-px bg-black/15" />

    <span className="text-[8px] uppercase tracking-[0.23em] text-black/35"><ContentText section="about" field="bugun" /></span>

    {/* BUGÜN → YARIN */}
    <div className="my-4 h-[8vh] w-px bg-[#24734D]" />

    <span className="text-[8px] font-semibold uppercase tracking-[0.23em] text-[#24734D]"><ContentText section="about" field="yarin" /></span>
  </div>

  <h3 className="text-[clamp(2.4rem,3.2vw,4.3rem)] font-medium leading-[0.94] tracking-[-0.055em]"><ContentText section="about" field="birikimi" /><br /><ContentText section="about" field="ileriye" /><br /><ContentText section="about" field="tasiyoruz" /></h3>
</div>
              </div>
            </div>
          </div>
        </motion.article>

        <motion.article
          style={{
            y: reduceMotion ? "0%" : chapter3Y,
          }}
          className="absolute inset-0 z-30 overflow-hidden rounded-t-[46px] bg-[#F7F4ED] text-[#171A16] shadow-[0_-30px_80px_rgba(20,30,20,0.05)]"
        >
          {/* HEADER */}

          <div className="absolute left-[4vw] right-[4vw] top-[4.5vh]">
            <div className="flex items-center justify-between">
              <SectionLabel><ContentText section="about" field="daha_fazlasi" /></SectionLabel>

              <span className="text-[8px] uppercase tracking-[0.21em] text-black/35">
                03 / 03
              </span>
            </div>

            <SoftDivider className="mt-[2vh]" />
          </div>

          {/* MAIN */}

          <motion.div
            style={{
              y: reduceMotion ? 0 : finalContentY,
              opacity: reduceMotion ? 1 : finalContentOpacity,
            }}
            className="absolute bottom-[7vh] left-[4vw] right-[4vw] top-[15vh] flex flex-col"
          >
            <div className="grid flex-1 grid-cols-12 items-center">
              {/* LEFT */}

              <div className="col-span-7 pl-[clamp(34px,2.45vw,50px)]">
                <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#24734D]"><ContentText section="about" field="toprak_tarim" /></span>

                <h3 className="about-desktop-final-title mt-[4vh] max-w-[9ch] text-[clamp(4.8rem,6.6vw,8.8rem)] font-medium leading-[0.84] tracking-[-0.075em]"><ContentText section="about" field="hikyemizi" /><br /><ContentText section="about" field="daha_yakindan" /><br />
                  <span className="text-[#24734D]"><ContentText section="about" field="kesfedin" /></span>
                </h3>
              </div>

              {/* RIGHT */}

              <div className="relative col-span-4 col-start-9 flex flex-col justify-center pl-[3vw]">
                <SoftVerticalDivider className="absolute bottom-0 left-0 top-0" />

                <span className="text-[8px] uppercase tracking-[0.22em] text-black/30"><ContentText section="about" field="hakkimizda" /></span>

                <p className="mt-7 max-w-[390px] text-[clamp(0.82rem,0.95vw,1rem)] leading-[1.8] text-black/48"><ContentText section="about" field="uretim_anlayisimizi_degerlerimizi_ve_toprak_tarimin_2" /></p>

                <div className="mt-[6vh]">
                  <AboutButton />
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div>
              <motion.div
                style={{
                  scaleX: finalLineScale,
                }}
                className="origin-left"
              >
                <SoftDivider />
              </motion.div>

              <div className="mt-[2.5vh] grid grid-cols-12 items-end">
                <div className="col-span-3">
                  <span className="block text-[8px] uppercase tracking-[0.22em] text-black/30"><ContentText section="about" field="kurulus" /></span>

                  <span className="mt-1 block text-[13px] font-medium tracking-[-0.02em]"><ContentText section="about" field="founded_year" /></span>
                </div>

                <div className="col-span-3">
                  <span className="block text-[8px] uppercase tracking-[0.22em] text-black/30"><ContentText section="about" field="merkez" /></span>

                  <span className="mt-1 block text-[13px] font-medium tracking-[-0.02em]"><ContentText section="about" field="konya_turkiye_2" /></span>
                </div>

                <div className="col-span-3 col-start-10 text-right">
                  <span className="text-[clamp(1.5rem,2vw,2.5rem)] font-medium leading-[0.95] tracking-[-0.05em]"><ContentText section="about" field="topraktan" />{" "}
                    <span className="text-[#24734D]"><ContentText section="about" field="gelecege" /></span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.article>

        <div className="pointer-events-none absolute bottom-[2vh] left-[4vw] right-[4vw] z-50 flex items-center gap-5">
          <span className="text-[8px] font-medium uppercase tracking-[0.23em] text-black/30"><ContentText section="about" field="scroll" /></span>

          <div className="relative h-px flex-1 overflow-hidden bg-black/10">
            <motion.div
              style={{
                scaleX: progressScale,
              }}
              className="absolute inset-0 origin-left bg-[#24734D]"
            />
          </div>

          <span className="text-[8px] font-medium uppercase tracking-[0.23em] text-black/30"><ContentText section="about" field="about_03" /></span>
        </div>
      </div>
    </section>
  );
}

function AboutResponsiveStyles() {
  return (
    <style jsx global>{`
      @media (min-width: 1280px) and (max-width: 1599px) {
        .about-desktop-title {
          font-size: clamp(4.35rem, 6.25vw, 6.9rem) !important;
          margin-top: 3vh !important;
        }

        .about-desktop-visual {
          width: clamp(350px, 30vw, 470px) !important;
        }
      }

      @media (min-width: 1280px) and (max-width: 1439px) {
        .about-desktop-title {
          font-size: clamp(4rem, 5.9vw, 5.7rem) !important;
          line-height: 0.86 !important;
        }

        .about-desktop-visual {
          width: clamp(330px, 29vw, 410px) !important;
        }
      }

      @media (min-width: 1280px) and (max-height: 800px) {
        .about-desktop-title {
          font-size: clamp(4.5rem, 6.25vw, 7.4rem) !important;
          margin-top: 2.5vh !important;
        }

        .about-desktop-visual {
          width: clamp(350px, 26vw, 470px) !important;
        }

        .about-desktop-number {
          font-size: clamp(10rem, 15vw, 18rem) !important;
        }

        .about-desktop-final-title {
          font-size: clamp(4.2rem, 5.7vw, 7rem) !important;
          margin-top: 2.5vh !important;
        }
      }

      @media (min-width: 1280px) and (max-height: 700px) {
        .about-desktop-title {
          font-size: clamp(4rem, 5.7vw, 6.5rem) !important;
        }

        .about-desktop-visual {
          width: clamp(320px, 24vw, 420px) !important;
        }

        .about-desktop-number {
          font-size: clamp(8.5rem, 13vw, 15rem) !important;
        }

        .about-desktop-final-title {
          font-size: clamp(3.8rem, 5.2vw, 6.2rem) !important;
        }
      }
    `}</style>
  );
}

/* ==========================================================================
   EXPORT
   ========================================================================== */

export default function AboutSection() {
  return (
    <>
      <MobileAbout />
      <DesktopAbout />
      <AboutResponsiveStyles />
    </>
  );
}
