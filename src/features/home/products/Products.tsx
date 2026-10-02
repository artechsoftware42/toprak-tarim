"use client";

import { useRef, useState } from "react";
import type { StaticImageData } from "next/image";
import Link from "next/link";

import productField from "@/assets/img2.png";
import { ContentImage, ContentText, useSectionContent } from "@/features/home/content/HomeContent";
import { localizedHref, localizedProductHref } from "@/lib/site-routing";

/* ==========================================================================
   TYPES
   ========================================================================== */

type Product = {
  number: string;
  titleField: string;
  descriptionField: string;
  image: StaticImageData;
  imagePosition: string;
  slug: string;
};

/* ==========================================================================
   DATA
   ========================================================================== */

const products: Product[] = [
  {
    number: "01",
    titleField: "product_1_name",
    descriptionField: "product_1_description",
    image: productField,
    imagePosition: "8% center",
    slug: "arpa",
  },
  {
    number: "02",
    titleField: "product_2_name",
    descriptionField: "product_2_description",
    image: productField,
    imagePosition: "65% center",
    slug: "bugday",
  },
  {
    number: "03",
    titleField: "product_3_name",
    descriptionField: "product_3_description",
    image: productField,
    imagePosition: "40% center",
    slug: "misir",
  },
  {
    number: "04",
    titleField: "product_4_name",
    descriptionField: "product_4_description",
    image: productField,
    imagePosition: "94% center",
    slug: "aycicegi",
  },
];

/* ==========================================================================
   ALL PRODUCTS BUTTON
   ========================================================================== */

function AllProductsButton() {
  const { locale } = useSectionContent("activityPage");
  return (
    <Link
      href={localizedHref("/activity#products", locale)}
      className="group relative inline-flex w-[300px] max-w-full cursor-pointer items-center justify-between overflow-visible pb-4 text-[#171A16]"
    >
      <span className="relative block h-[20px] flex-1 overflow-hidden">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.17em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-6 group-hover:-translate-y-1/2 group-hover:opacity-0">
          <ContentText section="activityPage" field="detail_products_button" />
        </span>

        <span className="absolute left-0 top-1/2 translate-x-7 -translate-y-1/2 whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.15em] text-[#24734D] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:-translate-y-1/2 group-hover:opacity-100">
          <ContentText section="activityPage" field="detail_products_button_hover" />
        </span>
      </span>

      <span className="ml-8 flex h-6 w-6 shrink-0 items-center justify-center transition-colors duration-500 group-hover:text-[#24734D]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-[18px] w-[18px] -rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-0 group-hover:translate-x-[3px]"
          aria-hidden="true"
        >
          <path d="M5 12H19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M14 7L19 12L14 17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#24734D] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
    </Link>
  );
}

/* ==========================================================================
   PRODUCT CARD
   ========================================================================== */

function ProductCard({
  product,
  index,
  activeIndex,
  onActivate,
}: {
  product: Product;
  index: number;
  activeIndex: number;
  onActivate: () => void;
}) {
  const isActive = activeIndex === index;
  const { text, locale } = useSectionContent("activityPage");

  return (
    <Link
      href={localizedProductHref(product.slug, locale)}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      aria-label={text(product.titleField)}
      className={`
        group
        relative
        h-full
        shrink-0
        cursor-pointer
        overflow-hidden
        text-left
        outline-none

        transition-[width,border-radius]
        duration-[1850ms]
        ease-[cubic-bezier(0.16,1,0.3,1)]

        ${
          isActive
            ? "rounded-[18px]"
            : "rounded-l-[14px] rounded-r-none"
        }
      `}
      style={{
        width: isActive
          ? "clamp(520px, 42vw, 760px)"
          : "clamp(150px, 14vw, 225px)",
      }}
    >
      {/* ================================================================== */}
      {/* IMAGE                                                              */}
      {/* ================================================================== */}

      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`
            relative
            h-full
            w-full

            transition-transform
            duration-[1800ms]
            ease-[cubic-bezier(0.16,1,0.3,1)]

            ${isActive ? "scale-100" : "scale-[1.04]"}
          `}
        >
          <ContentImage
            section="activityPage"
            slot={`product${index + 1}`}
            src={product.image}
            alt={text(product.titleField)}
            fill
            priority={index === 0}
            draggable={false}
            sizes="
              (max-width: 767px) 90vw,
              (max-width: 1199px) 60vw,
              760px
            "
            className="select-none object-cover"
            style={{
              objectPosition: product.imagePosition,
            }}
          />
        </div>
      </div>

      {/* ================================================================== */}
      {/* ACTIVE GRADIENT                                                    */}
      {/* ================================================================== */}

      <div
        className={`
          pointer-events-none
          absolute
          inset-0
          z-10

          bg-gradient-to-t
          from-black/60
          via-black/[0.05]
          to-transparent

          transition-opacity
          duration-[1000ms]
          ease-[cubic-bezier(0.16,1,0.3,1)]

          ${isActive ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* ================================================================== */}
      {/* NUMBER                                                             */}
      {/* ================================================================== */}

      <span
        className={`
          pointer-events-none
          absolute
          right-[20px]
          top-[10px]
          z-20

          font-semibold
          leading-none
          tracking-[-0.075em]

          text-white/[0.22]

          transition-[font-size,opacity,transform]
          duration-[1250ms]
          ease-[cubic-bezier(0.16,1,0.3,1)]

          ${
            isActive
              ? "text-[clamp(5.5rem,7vw,8rem)]"
              : "text-[clamp(4.7rem,6.1vw,7.2rem)]"
          }
        `}
      >
        {product.number}
      </span>

<div
  className={`
    pointer-events-none
    absolute
    z-30

    transition-[left,top,transform]
    duration-[1650ms]
    ease-[cubic-bezier(0.16,1,0.3,1)]

    ${
      isActive
        ? `
          left-[9%]
          top-[70%]

          translate-x-0
          translate-y-0
          rotate-0
        `
        : `
          left-[68%]
          top-[72%]

          -translate-x-1/2
          -translate-y-1/2
          rotate-90
        `
    }
  `}
  style={{
    /*
     * ÖNEMLİ:
     * Açık/kapalı durumda değişmiyor.
     * Böylece yazının konumu kaymıyor.
     */
    transformOrigin: "center center",
  }}
>
  <div className="inline-flex flex-col items-start">
    <h3
      className={`
        whitespace-nowrap

        font-semibold
        leading-[0.88]
        tracking-[-0.065em]

        transition-[font-size,color,opacity]
        duration-[1500ms]
        ease-[cubic-bezier(0.16,1,0.3,1)]

        ${
          isActive
            ? `
              text-[clamp(3.8rem,5.6vw,6.3rem)]
              text-white/[0.84]
            `
            : `
              text-[clamp(3.5rem,4.9vw,5.7rem)]
              text-white/[0.36]
            `
        }
      `}
    >
      <ContentText section="activityPage" field={product.titleField} />
    </h3>

    {/* UNDERLINE */}

    <span
      className={`
        mt-[10px]
        block
        h-px
        w-full

        origin-left
        bg-white/75

        transition-[transform,opacity]
        duration-[850ms]
        ease-[cubic-bezier(0.16,1,0.3,1)]

        ${
          isActive
            ? `
              scale-x-100
              opacity-100
              delay-[600ms]
            `
            : `
              scale-x-0
              opacity-0
              delay-0
            `
        }
      `}
    />
  </div>
</div>

      <p
        className={`
          pointer-events-none
          absolute
          bottom-[6.5%]
          left-[9%]
          z-30

          max-w-[430px]

          text-[14px]
          font-medium
          leading-[1.65]
          tracking-[0.025em]

          text-white/90

          transition-[opacity,transform]
          duration-[900ms]
          delay-[330ms]
          ease-[cubic-bezier(0.16,1,0.3,1)]

          lg:text-[15px]
          xl:text-[16px]

          ${
            isActive
              ? `
                translate-y-0
                opacity-100
              `
              : `
                translate-y-6
                opacity-0
              `
          }
        `}
      >
        <ContentText section="activityPage" field={product.descriptionField} />
      </p>

      {/* ================================================================== */}
      {/* CLOSED EDGE                                                        */}
      {/* ================================================================== */}

      <span
        className={`
          pointer-events-none
          absolute
          inset-y-0
          left-0
          z-40

          w-px
          bg-white/[0.10]

          transition-opacity
          duration-700

          ${isActive ? "opacity-0" : "opacity-100"}
        `}
      />
    </Link>
  );
}

function MobileSliderArrow({ direction }: { direction: "left" | "right" }) {
  const isLeft = direction === "left";

  return (
    <svg viewBox="0 0 56 20" fill="none" aria-hidden="true" className="h-5 w-14">
      <path
        d={isLeft ? "M55 10H3" : "M1 10H53"}
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d={isLeft ? "M10 3L3 10L10 17" : "M46 3L53 10L46 17"}
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ==========================================================================
   PRODUCTS
   ========================================================================== */

export default function Products() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { text, locale } = useSectionContent("activityPage");
  const mobileSliderRef = useRef<HTMLDivElement>(null);

  const scrollMobileProducts = (direction: "left" | "right") => {
    const slider = mobileSliderRef.current;
    if (!slider) return;

    const firstCard = slider.querySelector<HTMLElement>("[data-mobile-product-card]");
    const cardWidth = firstCard?.offsetWidth ?? slider.clientWidth * 0.88;
    slider.scrollBy({
      left: direction === "right" ? cardWidth + 16 : -(cardWidth + 16),
      behavior: "smooth",
    });
  };

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#F4F1EA]
        text-[#171A16]
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1920px]

          px-5
          py-24

          sm:px-8
          sm:py-28

          lg:px-[4vw]
          lg:py-[clamp(110px,8vw,155px)]
        "
      >
        {/* ================================================================= */}
        {/* INTRO                                                             */}
        {/* ================================================================= */}

        <div
          className="
            relative

            grid
            grid-cols-1
            gap-y-10

            border-t
            border-black/10

            pt-7

            lg:grid-cols-12
            lg:gap-x-[2vw]
            lg:gap-y-0
            lg:pt-9
          "
        >
          {/* LABEL */}

          <div className="lg:col-span-2">
            <span
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.26em]
                text-[#24734D]
              "
            >
              <ContentText section="activityPage" field="products_label" />
            </span>
          </div>

          {/* ================================================================= */}
          {/* TITLE                                                             */}
          {/* ================================================================= */}

          <div className="lg:col-span-6">
            <div className="max-w-[760px]">
              <span
                className="
                  mb-5
                  block

                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.22em]

                  text-black/30
                "
              >
                <ContentText section="activityPage" field="home_products_eyebrow" />
              </span>

              <h2
                className="
                  text-[clamp(3rem,4.4vw,5.7rem)]
                  font-medium
                  leading-[0.92]
                  tracking-[-0.06em]

                  text-[#171A16]
                "
              >
                <ContentText section="activityPage" field="home_products_title_1" />
                <br />

                <span className="font-normal italic text-[#24734D]">
                  <ContentText section="activityPage" field="home_products_title_accent" />
                </span>{" "}
                <ContentText section="activityPage" field="home_products_title_3" />
              </h2>
            </div>
          </div>

          {/* ================================================================= */}
          {/* DESCRIPTION                                                       */}
          {/* ================================================================= */}

          <div
            className="
              lg:col-span-3
              lg:col-start-10
              lg:self-end
            "
          >
            <div className="max-w-[410px]">
              <p
                className="
                  text-[14px]
                  leading-[1.8]
                  tracking-[-0.008em]

                  text-black/48

                  sm:text-[15px]
                  lg:text-[16px]
                "
              >
                <ContentText section="activityPage" field="home_products_description" />
              </p>

              <div
                className="
                  mt-7
                  flex
                  items-center
                  gap-4
                "
              >
                <span
                  className="
                    block
                    h-px
                    w-10
                    bg-[#24734D]/50
                  "
                />

                <span
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                    text-[#24734D]
                  "
                >
                  <ContentText section="activityPage" field="home_products_values" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* PRODUCT DIVIDER                                                   */}
        {/* ================================================================= */}

        <div
          className="
            mt-14
            flex
            items-center
            gap-5

            sm:mt-16
            lg:mt-[7vh]
          "
        >
          <span className="h-px flex-1 bg-black/10" />

          <span
            className="
              whitespace-nowrap

              text-[9px]
              font-medium
              uppercase
              tracking-[0.24em]

              text-black/30
            "
          >
            <ContentText section="activityPage" field="home_products_selection_label" />
          </span>

          <span className="h-px w-12 bg-black/10" />
        </div>

        {/* ================================================================= */}
        {/* PRODUCTS                                                          */}
        {/* ================================================================= */}

        <div
          className="
            relative
            mt-10
            w-full

            sm:mt-12
            lg:mt-[5vh]
          "
        >
          {/* =============================================================== */}
          {/* DESKTOP                                                         */}
          {/* =============================================================== */}

          <div
            className="
              relative

              hidden
              h-[clamp(560px,45vw,725px)]
              w-full

              items-stretch
              justify-center

              gap-[clamp(12px,1.45vw,28px)]

              md:flex
            "
          >
            {products.map((product, index) => (
              <ProductCard
                key={product.number}
                product={product}
                index={index}
                activeIndex={activeIndex}
                onActivate={() =>
                  setActiveIndex(index)
                }
              />
            ))}
          </div>

          {/* =============================================================== */}
          {/* MOBILE                                                          */}
          {/* =============================================================== */}

          <div
            ref={mobileSliderRef}
            className="
              flex
              w-full

              snap-x
              snap-mandatory

              gap-4

              overflow-x-auto

              pb-3

              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden

              md:hidden
            "
          >
            {products.map((product) => (
              <Link
                key={product.number}
                data-mobile-product-card
                href={localizedProductHref(product.slug, locale)}
                aria-label={text(product.titleField)}
                className="
                  relative

                  h-[570px]
                  w-[88vw]
                  max-w-[460px]

                  shrink-0
                  snap-center

                  cursor-pointer
                  overflow-hidden
                  rounded-[18px]
                "
              >
                <ContentImage
                  section="activityPage"
                  slot={`product${Number(product.number)}`}
                  src={product.image}
                  alt={text(product.titleField)}
                  fill
                  draggable={false}
                  sizes="88vw"
                  className="
                    select-none
                    object-cover
                  "
                  style={{
                    objectPosition:
                      product.imagePosition,
                  }}
                />

                <div
                  className="
                    absolute
                    inset-0

                    bg-gradient-to-t
                    from-black/65
                    via-transparent
                    to-transparent
                  "
                />

                {/* NUMBER */}

                <span
                  className="
                    absolute
                    right-5
                    top-3
                    z-20

                    text-[86px]
                    font-semibold
                    leading-none
                    tracking-[-0.075em]

                    text-white/[0.22]
                  "
                >
                  {product.number}
                </span>

                {/* CONTENT */}

                <div
                  className="
                    absolute
                    bottom-8
                    left-7
                    right-7
                    z-20
                  "
                >
                  <div className="inline-flex flex-col items-start">
                    <h3
                      className="
                        text-[52px]
                        font-semibold
                        leading-[0.88]
                        tracking-[-0.065em]

                        text-white/85
                      "
                    >
                      <ContentText section="activityPage" field={product.titleField} />
                    </h3>

                    <span
                      className="
                        mt-3
                        h-px
                        w-full
                        bg-white/75
                      "
                    />
                  </div>

                  <p
                    className="
                      mt-5
                      max-w-[350px]

                      text-[14px]
                      font-medium
                      leading-[1.65]

                      text-white/90
                    "
                  >
                    <ContentText section="activityPage" field={product.descriptionField} />
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-5 flex w-full items-center justify-between px-1 md:hidden">
            <button
              type="button"
              onClick={() => scrollMobileProducts("left")}
              aria-label="Önceki ürüne git"
              className="group flex h-12 w-20 cursor-pointer items-center justify-start text-[#171A16] transition-colors duration-300 hover:text-[#24734D] active:text-[#24734D]"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1 group-active:-translate-x-1">
                <MobileSliderArrow direction="left" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => scrollMobileProducts("right")}
              aria-label="Sonraki ürüne git"
              className="group flex h-12 w-20 cursor-pointer items-center justify-end text-[#171A16] transition-colors duration-300 hover:text-[#24734D] active:text-[#24734D]"
            >
              <span className="transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-1">
                <MobileSliderArrow direction="right" />
              </span>
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* BOTTOM META                                                       */}
        {/* ================================================================= */}

        <div
          className="
            mt-12

            flex
            flex-col
            gap-8

            border-t
            border-black/10

            pt-6

            md:mt-16
            md:flex-row
            md:items-end
            md:justify-between
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
            "
          >
            <span
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.22em]
                text-black/35
              "
            >
              <ContentText section="activityPage" field="home_products_count_label" />
            </span>

            <div
              className="
                hidden
                items-center
                gap-3

                md:flex
              "
            >
              <span className="h-px w-10 bg-black/20" />

              <span
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-black/35
                "
              >
                <ContentText section="activityPage" field="home_products_hover_hint" />
              </span>
            </div>
          </div>

          <div className="flex w-full justify-start md:w-auto md:justify-end">
            <AllProductsButton />
          </div>
        </div>
      </div>
    </section>
  );
}
