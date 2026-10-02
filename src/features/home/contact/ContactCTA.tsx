"use client";

import { ContentText, useSectionContent } from "@/features/home/content/HomeContent";
import { useEffect, useState } from "react";
import Link from "next/link";

import contactBg from "@/assets/hero4.png";
import { localizedHref } from "@/lib/site-routing";

/* ==========================================================================
   CONTACT DATA
   ========================================================================== */



/* ==========================================================================
   CONTACT BUTTON
   Activities componentindeki butonun aynı yapısı
   ========================================================================== */

function ContactButton() {
  const { locale } = useSectionContent("contact");
  return (
    <Link
      href={localizedHref("/contact", locale)}
      className="
        group
        relative
        inline-flex
        w-[300px]
        max-w-full
        items-center
        justify-between
        overflow-visible
        pb-4
        text-white
      "
    >
      {/* TEXT AREA */}

      <span className="relative block h-[20px] flex-1 overflow-hidden">
        {/* NORMAL */}

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
        ><ContentText section="contactCTA" field="iletisime_gecin" /></span>

        {/* HOVER */}

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

            text-[#D5E8C5]
            opacity-0

            transition-all
            duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]

            group-hover:translate-x-0
            group-hover:-translate-y-1/2
            group-hover:opacity-100
          "
        ><ContentText section="contactCTA" field="bizimle_iletisime_gecin" /></span>
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

          group-hover:text-[#D5E8C5]
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

          bg-[#D5E8C5]

          transition-transform
          duration-700
          ease-[cubic-bezier(0.22,1,0.36,1)]

          group-hover:scale-x-100
        "
      />
    </Link>
  );
}

/* ==========================================================================
   CONTACT CTA
   ========================================================================== */

export default function ContactCTA() {
  const {section, text, locale} = useSectionContent("contactCTA");
  const external = section.media?.background.externalUrl;
  const [loadedExternal, setLoadedExternal] = useState<string | null>(null);
  const background = external && loadedExternal === external ? external : contactBg.src;
  useEffect(() => {
    if (!external) return;
    let active = true;
    const image = new window.Image();
    image.onload = () => { if (active) setLoadedExternal(external); };
    image.src = external;
    return () => { active = false; };
  }, [external]);
  return (
    <section
      lang={locale}
      className="
        relative
        overflow-hidden
        bg-[#171A16]
        text-white
      "
    >
      {/* ================================================================== */}
      {/* PARALLAX BACKGROUND                                                */}
      {/* ================================================================== */}

      <div
        className="
          absolute
          inset-0

          bg-cover
          bg-center
          bg-no-repeat

          md:bg-fixed
        "
        style={{
          backgroundImage: `url(${background})`,
        }}
      />

      {/* ================================================================== */}
      {/* OVERLAYS                                                           */}
      {/* ================================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-black/40
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0

          bg-gradient-to-b
          from-black/10
          via-black/[0.08]
          to-black/70
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[#183223]/10
          mix-blend-multiply
        "
      />

      {/* ================================================================== */}
      {/* CONTENT                                                            */}
      {/* ================================================================== */}

      <div
        className="
          relative
          z-10

          mx-auto
          flex
          min-h-[720px]
          w-full
          max-w-[1920px]
          flex-col

          px-5
          py-8

          sm:min-h-[780px]
          sm:px-8
          sm:py-10

          lg:min-h-[860px]
          lg:px-[4vw]
          lg:py-[3vw]
        "
      >
        {/* ================================================================= */}
        {/* TOP                                                               */}
        {/* ================================================================= */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-8

            border-t
            border-white/25

            pt-5
          "
        >
          <span
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.26em]
              text-white/75
            "
          ><ContentText section="contactCTA" field="iletisim" /></span>

          <span
            className="
              hidden

              text-[9px]
              font-medium
              uppercase
              tracking-[0.22em]
              text-white/45

              sm:block
            "
          ><ContentText section="contactCTA" field="toprak_tarim" /></span>
        </div>

        {/* ================================================================= */}
        {/* MAIN CTA                                                          */}
        {/* ================================================================= */}

        <div
          className="
            mt-auto

            grid
            grid-cols-1
            gap-12

            pb-10
            pt-24

            md:pb-14

            lg:grid-cols-12
            lg:items-end
            lg:gap-[3vw]
            lg:pb-[3vw]
          "
        >
          {/* =============================================================== */}
          {/* TITLE                                                           */}
          {/* =============================================================== */}

          <div className="lg:col-span-8">
            <span
              className="
                mb-6
                block

                text-[10px]
                font-medium
                uppercase
                tracking-[0.24em]

                text-white/50
              "
            ><ContentText section="contactCTA" field="iletisime_gecin_2" /></span>

            <h2
              className="
                max-w-[1080px]

                text-[clamp(3.4rem,6.8vw,8.4rem)]
                font-medium
                leading-[0.86]
                tracking-[-0.07em]

                text-white
              "
            ><ContentText section="contactCTA" field="birlikte" /><br />

              <span
                className="
                  font-light
                  italic
                  text-white/55
                "
              ><ContentText section="contactCTA" field="calismaya" /></span>

              <br /><ContentText section="contactCTA" field="baslayalim" /></h2>
          </div>

          {/* =============================================================== */}
          {/* RIGHT                                                           */}
          {/* =============================================================== */}

          <div
            className="
              flex
              flex-col
              items-start

              lg:col-span-4
              lg:items-end
            "
          >
            <p
              className="
                max-w-[410px]

                text-[14px]
                leading-[1.8]
                tracking-[-0.005em]

                text-white/65

                sm:text-[15px]
                lg:text-[16px]
              "
            ><ContentText section="contactCTA" field="urunlerimiz_uretim_sureclerimiz_veya_olasi_is" /></p>

            {/* ACTIVITIES STYLE BUTTON */}

            <div
              className="
                mt-9
                w-full
                max-w-[410px]

                sm:mt-11
              "
            >
              <ContactButton />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* CONTACT INFORMATION                                               */}
        {/* ================================================================= */}

        <div
          className="
            grid
            grid-cols-1

            border-t
            border-white/25

            sm:grid-cols-2
            lg:grid-cols-12
          "
        >
          {/* =============================================================== */}
          {/* PHONE                                                           */}
          {/* =============================================================== */}

          <div
            className="
              flex
              flex-col
              items-center
              justify-center

              border-b
              border-white/20

              px-6
              py-7

              text-center

              sm:border-r

              lg:col-span-3
              lg:border-b-0
              lg:py-8
            "
          >
            <span
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.25em]
                text-white/40
              "
            ><ContentText section="contactCTA" field="telefon" /></span>

            <a
              href={`tel:${text("phone").replace(/[^+0-9]/g, "")}`}
              className="
                group

                mt-3

                inline-flex
                items-center
                justify-center
                gap-3

                text-[16px]
                font-medium
                tracking-[-0.02em]

                text-white/85

                transition-colors
                duration-300

                hover:text-[#D5E8C5]

                sm:text-[17px]
                lg:text-[18px]
              "
            >
              <ContentText section="contactCTA" field="phone" />

              <span
                className="
                  text-white/35

                  transition-all
                  duration-300

                  group-hover:translate-x-1
                  group-hover:text-[#D5E8C5]
                "
              >
                ↗
              </span>
            </a>
          </div>

          {/* =============================================================== */}
          {/* EMAIL                                                           */}
          {/* =============================================================== */}

          <div
            className="
              flex
              flex-col
              items-center
              justify-center

              border-b
              border-white/20

              px-6
              py-7

              text-center

              lg:col-span-4
              lg:border-b-0
              lg:border-r
              lg:py-8
            "
          >
            <span
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.25em]
                text-white/40
              "
            ><ContentText section="contactCTA" field="eposta" /></span>

            <a
              href={`mailto:${text("email")}`}
              className="
                group

                mt-3

                inline-flex
                items-center
                justify-center
                gap-3

                text-[16px]
                font-medium
                tracking-[-0.02em]

                text-white/85

                transition-colors
                duration-300

                hover:text-[#D5E8C5]

                sm:text-[17px]
                lg:text-[18px]
              "
            >
              <ContentText section="contactCTA" field="email" />

              <span
                className="
                  text-white/35

                  transition-all
                  duration-300

                  group-hover:translate-x-1
                  group-hover:text-[#D5E8C5]
                "
              >
                ↗
              </span>
            </a>
          </div>

          {/* =============================================================== */}
          {/* ADDRESS                                                         */}
          {/* =============================================================== */}

          <div
            className="
              flex
              flex-col
              items-center
              justify-center

              px-6
              py-7

              text-center

              sm:col-span-2

              lg:col-span-5
              lg:py-8
            "
          >
            <span
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.25em]
                text-white/40
              "
            ><ContentText section="contactCTA" field="adres" /></span>

            <p
              className="
                mt-3
                max-w-[480px]

                text-[16px]
                font-medium
                leading-[1.55]
                tracking-[-0.02em]

                text-white/85

                sm:text-[17px]
                lg:text-[18px]
              "
            >
              <ContentText section="contactCTA" field="address" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
