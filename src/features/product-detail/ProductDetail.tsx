"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";
import {
  FiArrowDown,
  FiArrowLeft,
  FiCalendar,
  FiLayers,
  FiPackage,
  FiSun,
} from "react-icons/fi";

import type { Product } from "@/data/products";
import { ContentImage, ContentText, useSectionContent } from "@/features/home/content/HomeContent";
import type { ProductStoryItem } from "@/features/products/model";
import { localizedHref } from "@/lib/site-routing";

/* =========================================================
   PRODUCTS BUTTON
   ContactCTA.tsx button style
========================================================= */

function ProductsButton({ dark = false }: { dark?: boolean }) {
  const { locale } = useSectionContent("activityPage");
  const baseText = dark ? "text-white" : "text-[#171915]";
  const hoverText = dark ? "text-[#D5E8C5]" : "text-[#1D6847]";
  const hoverLine = dark ? "bg-[#D5E8C5]" : "bg-[#1D6847]";

  return (
    <Link
      href={localizedHref("/activity#products", locale)}
      className={`
        group
        relative
        inline-flex
        w-[300px]
        max-w-full
        cursor-pointer
        items-center
        justify-between
        overflow-visible
        pb-4
        ${baseText}
      `}
    >
      <span className="relative block h-[20px] flex-1 overflow-hidden">
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
        >
          <ContentText section="activityPage" field="detail_products_button" />
        </span>

        <span
          className={`
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
            opacity-0
            transition-all
            duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]
            group-hover:translate-x-0
            group-hover:-translate-y-1/2
            group-hover:opacity-100
            ${hoverText}
          `}
        >
          <ContentText section="activityPage" field="detail_products_button_hover" />
        </span>
      </span>

      <span
        className={`
          ml-8
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          transition-colors
          duration-500
          group-hover:text-current
          ${dark ? "group-hover:text-[#D5E8C5]" : "group-hover:text-[#1D6847]"}
        `}
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

      <span
        className={`
          absolute
          bottom-0
          left-0
          h-px
          w-full
          origin-left
          scale-x-0
          transition-transform
          duration-700
          ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:scale-x-100
          ${hoverLine}
        `}
      />
    </Link>
  );
}

type DetailCopy = { whiteTitle: string; whiteText: string };

const whiteStoryCards = [
  { index: "01", background: "#101411" },
  { index: "02", background: "#1A201C" },
  { index: "03", background: "#2A322C" },
  { index: "04", background: "#1D6847" },
] as const;

type WhiteStoryCardData = (typeof whiteStoryCards)[number];

const cardTopOffsets = [
  "0px",
  "clamp(16px, 1.35vw, 26px)",
  "clamp(32px, 2.7vw, 52px)",
  "clamp(48px, 4.05vw, 78px)",
] as const;

const cardHeight = "calc(100% - clamp(48px, 4.05vw, 78px))";

function WhiteStoryCard({
  card,
  index,
  progress,
  storyItem,
}: {
  card: WhiteStoryCardData;
  index: number;
  progress: MotionValue<number>;
  storyItem?: ProductStoryItem;
}) {
  const { text } = useSectionContent("activityPage");
  const storyIndex = index + 1;
  const starts = [0, 0.13, 0.37, 0.61];
  const ends = [0, 0.27, 0.51, 0.75];

  const y = useTransform(
    progress,
    index === 0 ? [0, 1] : [starts[index], ends[index]],
    index === 0 ? ["0%", "0%"] : ["112%", "0%"],
  );

  const opacity = useTransform(
    progress,
    index === 0
      ? [0, 1]
      : [Math.max(0, starts[index] - 0.025), starts[index] + 0.035],
    index === 0 ? [1, 1] : [0.98, 1],
  );

  const nextCardStart =
    index < whiteStoryCards.length - 1 ? starts[index + 1] : 1;

  const nextCardEnd = index < whiteStoryCards.length - 1 ? ends[index + 1] : 1;

  const scale = useTransform(
    progress,
    index < whiteStoryCards.length - 1 ? [nextCardStart, nextCardEnd] : [0, 1],
    index < whiteStoryCards.length - 1 ? [1, 0.982] : [1, 1],
  );

  const contentOpacity = useTransform(
    progress,
    index < whiteStoryCards.length - 1
      ? [Math.min(1, nextCardStart + 0.045), Math.min(1, nextCardEnd - 0.015)]
      : [0, 1],
    index < whiteStoryCards.length - 1 ? [1, 0] : [1, 1],
  );

  const contentY = useTransform(
    progress,
    index < whiteStoryCards.length - 1
      ? [Math.min(1, nextCardStart + 0.045), Math.min(1, nextCardEnd - 0.015)]
      : [0, 1],
    index < whiteStoryCards.length - 1 ? [0, -8] : [0, 0],
  );

  return (
    <motion.article
      style={{
        y,
        opacity,
        scale,
        transformOrigin: "50% 0%",
        top: cardTopOffsets[index],
        height: cardHeight,
        zIndex: 20 + index * 10,
        backgroundColor: card.background,
      }}
      className="
        absolute
        left-0
        right-0
        overflow-hidden
        rounded-[24px]
        text-white
        sm:rounded-[28px]
        lg:rounded-[30px]
      "
    >
      <motion.div
        style={{
          opacity: contentOpacity,
          y: contentY,
        }}
        className="
          flex
          h-full
          flex-col
          justify-between
          px-6
          pb-5
          pt-5
          sm:px-8
          sm:pb-8
          sm:pt-8
          md:px-9
          md:pb-9
          md:pt-9
          lg:px-11
          lg:pb-10
          lg:pt-10
        "
      >
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#F4A04A] sm:text-[9px]">
              {card.index} / {storyItem?.eyebrow ?? text(`detail_story_${storyIndex}_eyebrow`)}
            </span>

            <h3
              className="
                mt-3
                max-w-[980px]
                text-[clamp(1.35rem,6vw,1.8rem)]
                sm:mt-4
                sm:text-[clamp(1.75rem,4.8vw,2.6rem)]
                lg:text-[clamp(1.75rem,3vw,3.75rem)]
                font-medium
                leading-[1.01]
                tracking-[-0.052em]
              "
            >
              {storyItem?.title ?? <ContentText section="activityPage" field={`detail_story_${storyIndex}_title`} />}
              <br className="hidden sm:block" />
              <span className="text-white/44"> {storyItem?.accent ?? <ContentText section="activityPage" field={`detail_story_${storyIndex}_accent`} />}</span>
            </h3>
          </div>

          <span className="hidden shrink-0 pt-1 text-[9px] font-medium uppercase tracking-[0.24em] text-white/24 md:block">
            <ContentText section="activityPage" field="detail_brand" />
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-12 md:items-end md:gap-8">
          <div className="md:col-span-7">
            <p className="max-w-[730px] text-[11px] leading-[1.55] text-white/60 sm:text-[15px] sm:leading-7 md:text-[16px] md:leading-8">
              {storyItem?.body ?? <ContentText section="activityPage" field={`detail_story_${storyIndex}_body`} />}
            </p>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <p className="max-w-[400px] text-[10px] font-medium leading-[1.55] text-white/40 sm:text-[13px] sm:leading-6 md:ml-auto md:text-right">
              {storyItem?.note ?? <ContentText section="activityPage" field={`detail_story_${storyIndex}_note`} />}
            </p>

            {index === whiteStoryCards.length - 1 && (
              <div className="mt-3 sm:mt-5 md:flex md:justify-end">
                <ProductsButton dark />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

function WhiteProductStory({
  product,
  copy,
}: {
  product: Product;
  copy: DetailCopy;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const { text, locale } = useSectionContent("activityPage");
  const contentIndex = ({ barley: 1, wheat: 2, corn: 3, sunflower: 4 } as const)[product.id as "barley" | "wheat" | "corn" | "sunflower"] ?? 1;
  const productName = product.managed?.copy[locale].name ?? text(`product_${contentIndex}_name`);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={sectionRef}
      className="
        relative
        h-[455svh]
        bg-[#F5F4EF]
        text-[#171915]
      "
      aria-label={`${productName} ${text("detail_production_approach")}`}
    >
      <div
        className="
          sticky
          top-20
          h-[calc(100svh-5rem)]
          overflow-hidden
          md:top-24
          md:h-[calc(100svh-6rem)]
          bg-[#F5F4EF]
        "
      >
        <div
          className="
            mx-auto
            grid
            h-full
            max-w-[1760px]
            grid-rows-[auto_minmax(0,1fr)]
            gap-2.5
            px-4
            pb-3
            pt-3
            sm:gap-5
            sm:px-8
            sm:pb-5
            sm:pt-5
            md:px-12
            lg:gap-6
            lg:px-16
          "
        >
          {/* =================================================
              INTRO
              Başlık ile kart aynı anda ekranda kalır.
          ================================================= */}
          <div
            className="
              grid
              shrink-0
              gap-2
              sm:gap-3
              lg:grid-cols-12
              lg:items-end
              lg:gap-8
            "
          >
            <div className="lg:col-span-3">
              <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#1D6847] sm:text-[9px] sm:tracking-[0.31em] lg:text-[10px]">
                <ContentText section="activityPage" field="detail_story_label" />
              </span>

              <p className="mt-1.5 max-w-[320px] text-[9px] leading-[1.55] text-black/45 sm:mt-2 sm:text-[12px] sm:leading-5 md:text-[13px] md:leading-6">
                <ContentText section="activityPage" field="detail_story_intro" />
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-5">
              <h2
                className="
                  max-w-[900px]
                  text-[clamp(1.28rem,5.7vw,1.7rem)]
                  sm:text-[clamp(1.65rem,4.8vw,2.5rem)]
                  lg:text-[clamp(1.65rem,2.85vw,3.5rem)]
                  font-medium
                  leading-[1.01]
                  tracking-[-0.048em]
                "
              >
                {copy.whiteTitle}
              </h2>

              <p className="mt-1.5 max-w-[780px] text-[9px] leading-[1.55] text-black/46 sm:mt-2 sm:text-[12px] sm:leading-5 md:text-[13px] md:leading-6 lg:text-[14px]">
                {copy.whiteText}
              </p>
            </div>
          </div>

          {/* =================================================
              STACKED CARD STAGE

              Video referansındaki mantık:
              - Kart 1 en üst noktaya oturur.
              - Kart 2 biraz daha aşağıya oturur.
              - Kart 3 ve 4 aynı şekilde devam eder.
              - Önceki kartların sadece üst şeritleri görünür.
          ================================================= */}
          <div
            className="
              relative
              min-h-0
              w-full
              overflow-hidden
            "
          >
            {whiteStoryCards.map((card, index) => (
              <WhiteStoryCard
                key={card.index}
                card={card}
                index={index}
                progress={scrollYProgress}
                storyItem={product.managed?.copy[locale].storyItems?.[index]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type ProductDetailProps = {
  product: Product;
  categoryName: { tr: string; en: string };
};

export default function ProductDetail({ product, categoryName }: ProductDetailProps) {
  const cinematicRef = useRef<HTMLElement>(null);
  const { text, locale } = useSectionContent("activityPage");
  const reduceMotion = Boolean(useReducedMotion());
  const contentIndex = ({ barley: 1, wheat: 2, corn: 3, sunflower: 4 } as const)[product.id as "barley" | "wheat" | "corn" | "sunflower"] ?? 1;
  const prefix = `detail_product_${contentIndex}`;
  const managedCopy = product.managed?.copy[locale];
  const productName = managedCopy?.name ?? text(`product_${contentIndex}_name`);
  const productDescription = managedCopy?.description ?? text(`product_${contentIndex}_description`);
  const productCategory = categoryName[locale];
  const detailText = (field: keyof NonNullable<typeof managedCopy> | string) => managedCopy
    ? String(managedCopy[field as keyof typeof managedCopy] ?? "")
    : text(`${prefix}_${field}`);
  const copy = {
    kicker: detailText("kicker"),
    sectionLabel: detailText(managedCopy ? "sectionLabel" : "section_label"),
    sectionTitle: detailText(managedCopy ? "sectionTitle" : "section_title"),
    sectionText: detailText(managedCopy ? "sectionText" : "section_text"),
    whiteTitle: detailText(managedCopy ? "whiteTitle" : "white_title"),
    whiteText: detailText(managedCopy ? "whiteText" : "white_text"),
  };
  const highlights = managedCopy?.highlights ?? [1, 2, 3, 4].map(index => text(`${prefix}_highlight_${index}`));

  const factItems = [
    {
      icon: FiPackage,
      label: text("detail_fact_usage_label"),
      value: detailText(managedCopy ? "usageValue" : "usage_value"),
      description: detailText(managedCopy ? "usageDescription" : "usage_description"),
    },
    {
      icon: FiCalendar,
      label: text("detail_fact_sowing_label"),
      value: detailText(managedCopy ? "sowingValue" : "sowing_value"),
      description: detailText(managedCopy ? "sowingDescription" : "sowing_description"),
    },
    {
      icon: FiSun,
      label: text("detail_fact_harvest_label"),
      value: detailText(managedCopy ? "harvestValue" : "harvest_value"),
      description: detailText(managedCopy ? "harvestDescription" : "harvest_description"),
    },
    {
      icon: FiLayers,
      label: text("detail_fact_character_label"),
      value: detailText(managedCopy ? "characterValue" : "character_value"),
      description: detailText(managedCopy ? "characterDescription" : "character_description"),
    },
  ];

  /* =========================================================
     HERO
  ========================================================= */

  const { scrollYProgress } = useScroll({
    target: cinematicRef,
    offset: ["start start", "end end"],
  });

  const progress = scrollYProgress;

  const zoomProgress = [0, 0.27, 0.33, 0.39, 0.45, 0.51, 0.57, 0.64, 1];

  const titleScale = useTransform(
    progress,
    zoomProgress,
    [1, 1, 1.08, 1.22, 1.55, 2.2, 3.6, 6.4, 6.4],
  );

  const fieldScale = useTransform(
    progress,
    zoomProgress,
    [1, 1, 1.04, 1.09, 1.17, 1.3, 1.5, 1.85, 1.85],
  );

  const titleOpacity = useTransform(
    progress,
    [0, 0.46, 0.53, 0.59, 0.64, 1],
    [1, 1, 0.88, 0.32, 0, 0],
  );

  const fieldY = useTransform(
    progress,
    [0, 0.27, 0.45, 0.57, 0.68, 1],
    ["0%", "0%", "0.3%", "1%", "2%", "2%"],
  );

  const fieldBlur = useTransform(
    progress,
    [0, 0.5, 0.56, 0.61, 0.66, 0.72, 0.79, 0.87, 1],
    [
      "blur(0px)",
      "blur(0px)",
      "blur(1px)",
      "blur(3px)",
      "blur(7px)",
      "blur(14px)",
      "blur(23px)",
      "blur(34px)",
      "blur(34px)",
    ],
  );

  const uiOpacity = useTransform(
    progress,
    [0, 0.27, 0.37, 0.46, 1],
    [1, 1, 0.6, 0, 0],
  );

  const shadowOpacity = useTransform(
    progress,
    [0, 0.27, 0.52, 0.72, 1],
    [0.48, 0.48, 0.4, 0.28, 0.23],
  );

  const endGradientOpacity = useTransform(
    progress,
    [0, 0.69, 0.78, 0.88, 1],
    [0, 0, 0.22, 0.72, 1],
  );

  return (
    <main className="overflow-x-clip bg-white text-[#171915]">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        ref={cinematicRef}
        data-product-detail-hero
        className="relative h-[300svh] bg-black md:h-[300vh]"
        aria-label={`${productName} ${text("product_aria_suffix")}`}
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden bg-black text-white md:min-h-[620px]">
          <motion.div
            className="absolute -inset-[8%] transform-gpu sm:-inset-[6%] lg:-inset-[5%]"
            style={{
              scale: reduceMotion ? 1 : fieldScale,
              y: reduceMotion ? 0 : fieldY,
              filter: reduceMotion ? "blur(0px)" : fieldBlur,
              willChange: "transform, filter",
            }}
          >
            <ContentImage
              section="activityPage"
              slot={product.managed ? `managed-${product.id}-detail` : `detailProduct${contentIndex}`}
              src={product.detailImage}
              alt={productName}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 bg-black"
            style={{
              opacity: reduceMotion ? 0.48 : shadowOpacity,
            }}
          />

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.12)_42%,rgba(0,0,0,0.64)_100%)]" />

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.52)_0%,rgba(0,0,0,0.04)_28%,rgba(0,0,0,0.08)_58%,rgba(0,0,0,0.76)_100%)]" />

          <motion.div
            className="absolute inset-x-0 top-0 z-30"
            style={{
              opacity: reduceMotion ? 1 : uiOpacity,
            }}
          >
            <div className="mx-auto flex max-w-[1760px] items-center justify-between px-5 pt-[112px] sm:px-8 md:px-12 md:pt-[128px] lg:px-16">
              <Link
                href={localizedHref("/activity", locale)}
                className="group inline-flex cursor-pointer items-center gap-3 text-[9px] font-medium uppercase tracking-[0.22em] text-white/60 transition-colors duration-300 hover:text-white"
              >
                <FiArrowLeft className="text-sm transition-transform duration-300 group-hover:-translate-x-1" />
                <ContentText section="activityPage" field="detail_back_label" />
              </Link>

              <span className="hidden text-[9px] font-medium uppercase tracking-[0.24em] text-white/35 md:block">
                <ContentText section="activityPage" field="detail_brand" />
              </span>
            </div>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden px-5"
            style={{
              opacity: reduceMotion ? 1 : titleOpacity,
            }}
          >
            <motion.div
              className="text-center"
              style={{
                scale: reduceMotion ? 1 : titleScale,
                transformOrigin: "50% 50%",
              }}
            >
              <span className="mb-5 block text-[9px] font-medium uppercase tracking-[0.32em] text-[#F07D00]/70 md:text-[10px]">
                {copy.kicker}
              </span>

              <h1
                className="whitespace-nowrap text-[clamp(3.6rem,18vw,7rem)] font-medium uppercase leading-[0.82] tracking-[-0.06em] text-white/60 sm:text-[clamp(4.2rem,12vw,8.5rem)] lg:text-[clamp(4.2rem,9vw,10rem)]"
                style={{
                  WebkitFontSmoothing: "antialiased",
                  textRendering: "geometricPrecision",
                }}
              >
                {productName}
              </h1>

              <span className="mt-5 block text-[9px] font-medium uppercase tracking-[0.3em] text-white/28">
                {detailText("eyebrow")}
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-5 z-30 max-w-[310px] sm:left-8 md:bottom-10 md:left-12 lg:left-16"
            style={{
              opacity: reduceMotion ? 1 : uiOpacity,
            }}
          >
            <span className="text-[8px] font-semibold uppercase tracking-[0.26em] text-[#F07D00]">
              {productCategory}
            </span>

            <p className="mt-3 text-[10px] leading-[1.7] text-white/52">
              {productDescription}
            </p>
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 sm:bottom-10"
            style={{
              opacity: reduceMotion ? 1 : uiOpacity,
            }}
          >
            <div className="flex flex-col items-center gap-2 text-white/55">
              <span className="text-[9px] font-medium uppercase tracking-[0.32em]">
                <ContentText section="activityPage" field="detail_scroll_label" />
              </span>

              <FiArrowDown className="animate-bounce text-base" />
            </div>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 z-[25] bg-[linear-gradient(180deg,rgba(5,5,5,0)_0%,rgba(5,5,5,0.03)_32%,rgba(5,5,5,0.42)_66%,rgba(5,5,5,0.84)_84%,#050505_100%)]"
            style={{
              opacity: reduceMotion ? 0 : endGradientOpacity,
            }}
          />
        </div>
      </section>

      {/* =====================================================
          BLACK PRODUCT INFORMATION
      ===================================================== */}

      <section
        data-product-black-section
        className="relative overflow-hidden bg-[#050505] text-white"
      >
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute left-[68%] top-[42%] h-[48rem] w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1D6847]/18 blur-[150px]" />

          <div className="absolute left-[72%] top-[48%] h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4E9B77]/8 blur-[90px]" />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,#050505_0%,rgba(5,5,5,0.92)_50%,#050505_100%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1760px] px-5 pb-28 pt-24 sm:px-8 md:px-12 md:pb-36 md:pt-28 lg:px-16 lg:pb-40 lg:pt-32">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <motion.div
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
                amount: 0.3,
              }}
              transition={{
                duration: 0.65,
              }}
              className="lg:col-span-7"
            >
              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#F07D00]">
                {copy.sectionLabel}
              </span>

              <h2 className="mt-5 max-w-[800px] text-[clamp(2rem,3.8vw,4.2rem)] font-medium leading-[1.06] tracking-[-0.045em] text-white/92">
                {copy.sectionTitle}
              </h2>
            </motion.div>

            <motion.div
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
                amount: 0.3,
              }}
              transition={{
                duration: 0.65,
                delay: 0.05,
              }}
              className="lg:col-span-4 lg:col-start-9"
            >
              <p className="text-sm leading-7 text-white/44 md:text-[15px]">
                {copy.sectionText}
              </p>
            </motion.div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-7">
            <motion.div
              initial={{
                opacity: 0,
                y: 24,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.18,
              }}
              transition={{
                duration: 0.75,
              }}
              className="relative min-h-[440px] overflow-hidden rounded-[32px] lg:col-span-5 lg:min-h-[610px]"
            >
              <ContentImage
                section="activityPage"
                slot={product.managed ? `managed-${product.id}-detail` : `detailProduct${contentIndex}`}
                src={product.detailImage}
                alt={productName}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center"
              />

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_10%,rgba(0,0,0,0.16)_48%,rgba(0,0,0,0.84)_100%)]" />

              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9 lg:p-10">
                <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#F07D00]">
                  <ContentText section="activityPage" field="detail_general_overview" />
                </span>

                <h3 className="mt-4 text-2xl font-medium tracking-[-0.035em] text-white sm:text-3xl">
                  {productName}
                </h3>

                <p className="mt-5 max-w-[500px] text-sm leading-7 text-white/58">
                  {productDescription}
                </p>
              </div>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {factItems.map((fact, index) => {
                const Icon = fact.icon;

                return (
                  <motion.article
                    key={fact.label}
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.25,
                    }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.05,
                    }}
                    className="rounded-[28px] bg-white/[0.055] p-6 sm:p-7 lg:p-8"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.07] text-[#F07D00]">
                      <Icon className="text-lg" />
                    </div>

                    <span className="mt-7 block text-[9px] font-semibold uppercase tracking-[0.25em] text-white/30">
                      {fact.label}
                    </span>

                    <h3 className="mt-3 text-xl font-medium tracking-[-0.03em] text-white/88 sm:text-2xl">
                      {fact.value}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-white/43">
                      {fact.description}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>

          <motion.div
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
              amount: 0.3,
            }}
            transition={{
              duration: 0.7,
            }}
            className="mt-7 rounded-[28px] bg-white/[0.045] px-6 py-7 sm:px-8 sm:py-8 lg:flex lg:items-center lg:justify-between lg:gap-12"
          >
            <div className="max-w-[700px]">
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#F07D00]">
                <ContentText section="activityPage" field="detail_production_approach" />
              </span>

              <p className="mt-4 text-[15px] leading-7 text-white/55">
                {productDescription}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5 lg:mt-0 lg:max-w-[440px] lg:justify-end">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white/[0.065] px-4 py-2.5 text-xs font-medium text-white/55"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <WhiteProductStory product={product} copy={copy} />
    </main>
  );
}

