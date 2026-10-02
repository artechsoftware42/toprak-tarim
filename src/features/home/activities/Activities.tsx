"use client";

import type { StaticImageData } from "next/image";
import Link from "next/link";

import hero3 from "@/assets/hero3.png";
import hero4 from "@/assets/hero4.png";
import { ContentImage, ContentText, useSectionContent } from "@/features/home/content/HomeContent";
import { localizedHref } from "@/lib/site-routing";

/* ==========================================================================
   TYPES
   ========================================================================== */

type ActivityType =
  | "grain"
  | "oilseed"
  | "storage"
  | "processing";

type Activity = {
  number: string;
  titleField: string;
  emphasisField: string;
  descriptionField: string;
  href: string;
  image: StaticImageData;
  imagePosition?: string;
  type: ActivityType;
};

/* ==========================================================================
   DATA
   ========================================================================== */

const activities: Activity[] = [
  {
    number: "01",
    titleField: "activity_step_1_title",
    emphasisField: "activity_step_1_emphasis",
    descriptionField: "activity_step_1_description",
    href: "/activity#production",
    image: hero3,
    imagePosition: "object-center",
    type: "grain",
  },
  {
    number: "02",
    titleField: "activity_step_2_title",
    emphasisField: "activity_step_2_emphasis",
    descriptionField: "activity_step_2_description",
    href: "/activity#production",
    image: hero4,
    imagePosition: "object-center",
    type: "oilseed",
  },
  {
    number: "03",
    titleField: "activity_step_3_title",
    emphasisField: "activity_step_3_emphasis",
    descriptionField: "activity_step_3_description",
    href: "/activity#production",
    image: hero3,
    imagePosition: "object-[68%_center]",
    type: "storage",
  },
  {
    number: "04",
    titleField: "activity_step_4_title",
    emphasisField: "activity_step_4_emphasis",
    descriptionField: "activity_step_4_description",
    href: "/activity#production",
    image: hero4,
    imagePosition: "object-[35%_center]",
    type: "processing",
  },
];

/* ==========================================================================
   ACTIVITY MARKS
   ========================================================================== */

function ActivityMark({ type }: { type: ActivityType }) {
  const common =
    "h-full w-full fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round]";

  /* -----------------------------------------------------------------------
     HUBUBAT / BAŞAK
     ----------------------------------------------------------------------- */

  if (type === "grain") {
    return (
      <svg
        viewBox="0 0 240 240"
        aria-hidden="true"
        className={common}
      >
        <path
          d="M120 198C121 165 119 127 119 78"
          strokeWidth="1.25"
        />

        <path
          d="M119 97C99 90 90 77 88 60C104 63 115 75 119 97Z"
          strokeWidth="1.15"
        />

        <path
          d="M120 119C98 113 85 100 80 82C100 84 114 98 120 119Z"
          strokeWidth="1.15"
        />

        <path
          d="M120 141C97 136 83 124 76 106C98 107 113 121 120 141Z"
          strokeWidth="1.15"
        />

        <path
          d="M120 97C140 90 149 77 151 60C135 63 124 75 120 97Z"
          strokeWidth="1.15"
        />

        <path
          d="M120 119C142 113 155 100 160 82C140 84 126 98 120 119Z"
          strokeWidth="1.15"
        />

        <path
          d="M120 141C143 136 157 124 164 106C142 107 127 121 120 141Z"
          strokeWidth="1.15"
        />

        <path
          d="M119 78C115 67 115 56 120 45C126 57 126 68 119 78Z"
          strokeWidth="1.15"
        />
      </svg>
    );
  }

  /* -----------------------------------------------------------------------
     YAĞLI TOHUMLAR / AYÇİÇEĞİ
     ----------------------------------------------------------------------- */

  if (type === "oilseed") {
    return (
      <svg
        viewBox="0 0 240 240"
        aria-hidden="true"
        className={common}
      >
        <circle
          cx="120"
          cy="103"
          r="25"
          strokeWidth="1.2"
        />

        <circle
          cx="120"
          cy="103"
          r="12"
          strokeWidth="1"
        />

        <path
          d="M120 67C109 53 111 41 120 31C129 41 131 53 120 67Z"
          strokeWidth="1.1"
        />

        <path
          d="M120 139C109 153 111 165 120 175C129 165 131 153 120 139Z"
          strokeWidth="1.1"
        />

        <path
          d="M84 103C70 92 58 94 48 103C58 112 70 114 84 103Z"
          strokeWidth="1.1"
        />

        <path
          d="M156 103C170 92 182 94 192 103C182 112 170 114 156 103Z"
          strokeWidth="1.1"
        />

        <path
          d="M95 78C77 76 69 67 68 54C81 55 91 63 95 78Z"
          strokeWidth="1.1"
        />

        <path
          d="M145 78C163 76 171 67 172 54C159 55 149 63 145 78Z"
          strokeWidth="1.1"
        />

        <path
          d="M95 128C77 130 69 139 68 152C81 151 91 143 95 128Z"
          strokeWidth="1.1"
        />

        <path
          d="M145 128C163 130 171 139 172 152C159 151 149 143 145 128Z"
          strokeWidth="1.1"
        />

        <path
          d="M120 175V205"
          strokeWidth="1.2"
        />
      </svg>
    );
  }

  /* -----------------------------------------------------------------------
     DEPOLAMA / SİLO
     ----------------------------------------------------------------------- */

  if (type === "storage") {
    return (
      <svg
        viewBox="0 0 240 240"
        aria-hidden="true"
        className={common}
      >
        <path
          d="M76 87C76 70 90 56 107 56H133C150 56 164 70 164 87V184H76V87Z"
          strokeWidth="1.2"
        />

        <path
          d="M76 91H164"
          strokeWidth="1"
        />

        <path
          d="M76 112H164"
          strokeWidth="1"
        />

        <path
          d="M76 133H164"
          strokeWidth="1"
        />

        <path
          d="M76 154H164"
          strokeWidth="1"
        />

        <path
          d="M76 175H164"
          strokeWidth="1"
        />

        <path
          d="M95 184V202"
          strokeWidth="1.2"
        />

        <path
          d="M145 184V202"
          strokeWidth="1.2"
        />

        <path
          d="M64 202H176"
          strokeWidth="1.2"
        />

        <path
          d="M120 56V39"
          strokeWidth="1"
        />

        <path
          d="M109 39H131"
          strokeWidth="1"
        />
      </svg>
    );
  }

  /* -----------------------------------------------------------------------
     İŞLEME / PROSES
     ----------------------------------------------------------------------- */

  return (
    <svg
      viewBox="0 0 240 240"
      aria-hidden="true"
      className={common}
    >
      <circle
        cx="120"
        cy="112"
        r="34"
        strokeWidth="1.2"
      />

      <circle
        cx="120"
        cy="112"
        r="13"
        strokeWidth="1.1"
      />

      <path
        d="M120 65V48"
        strokeWidth="1.2"
      />

      <path
        d="M120 176V159"
        strokeWidth="1.2"
      />

      <path
        d="M73 112H56"
        strokeWidth="1.2"
      />

      <path
        d="M184 112H167"
        strokeWidth="1.2"
      />

      <path
        d="M87 79L75 67"
        strokeWidth="1.2"
      />

      <path
        d="M165 157L153 145"
        strokeWidth="1.2"
      />

      <path
        d="M153 79L165 67"
        strokeWidth="1.2"
      />

      <path
        d="M75 157L87 145"
        strokeWidth="1.2"
      />

      <path
        d="M89 197H151"
        strokeWidth="1"
      />

      <path
        d="M102 187H138"
        strokeWidth="1"
      />

      <path
        d="M110 177H130"
        strokeWidth="1"
      />
    </svg>
  );
}

/* ==========================================================================
   CARD
   ========================================================================== */

function ActivityCard({ activity }: { activity: Activity }) {
  const { text, locale } = useSectionContent("activityPage");
  return (
    <Link
      href={localizedHref(activity.href, locale)}
      className="
        group
        relative
        isolate
        block
        min-h-[390px]
        overflow-hidden
        rounded-[16px]
        bg-[#EAE6DD]
        text-[#171A16]

        sm:min-h-[430px]
        lg:min-h-[clamp(430px,32vw,570px)]

        transition-transform
        duration-700
        ease-[cubic-bezier(0.22,1,0.36,1)]

        lg:hover:-translate-y-[5px]
      "
    >
      {/* ================================================================ */}
      {/* HOVER IMAGE                                                      */}
      {/* Sadece buranın geçişi daha smooth yapıldı.                       */}
      {/* ================================================================ */}

      <div
        className="
          absolute
          inset-0

          opacity-100

          lg:opacity-0

          transition-opacity
          duration-[1050ms]
          ease-[cubic-bezier(0.16,1,0.3,1)]

          lg:group-hover:opacity-100
        "
      >
        {/* Zoom ayrı katmanda çalışıyor.
            Böylece opacity ile scale birbirini sertleştirmiyor. */}

        <div
          className="
            relative
            h-full
            w-full

            scale-100

            lg:scale-[1.04]

            transition-transform
            duration-[1500ms]
            ease-[cubic-bezier(0.16,1,0.3,1)]

            lg:group-hover:scale-100
          "
        >
          <ContentImage
            section="activityPage"
            slot={`activityCard${activity.number.slice(-1)}`}
            src={activity.image}
            alt={`${text(activity.titleField)} ${text(activity.emphasisField)}`}
            fill
            sizes="
              (max-width: 639px) 100vw,
              (max-width: 1023px) 50vw,
              25vw
            "
            className={`object-cover ${
              activity.imagePosition ?? "object-center"
            }`}
          />
        </div>
      </div>

      {/* ================================================================ */}
      {/* IMAGE OVERLAY                                                    */}
      {/* ================================================================ */}

      <div
        className="
          absolute
          inset-0

          bg-gradient-to-b
          from-black/[0.10]
          via-black/[0.06]
          to-black/65

          opacity-100

          lg:opacity-0

          transition-opacity
          duration-[950ms]
          ease-[cubic-bezier(0.16,1,0.3,1)]

          lg:group-hover:opacity-100
        "
      />

      {/* ================================================================ */}
      {/* LINE ART                                                         */}
      {/* Desktop normal state only                                        */}
      {/* ================================================================ */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[43%]

          hidden
          h-[52%]
          w-[52%]

          -translate-x-1/2
          -translate-y-1/2

          text-[#49483F]/[0.16]

          lg:block

          transition-all
          duration-700
          ease-[cubic-bezier(0.22,1,0.36,1)]

          group-hover:scale-[0.92]
          group-hover:opacity-0
        "
      >
        <ActivityMark type={activity.type} />
      </div>

      {/* ================================================================ */}
      {/* TOP META                                                         */}
      {/* ================================================================ */}

      <div
        className="
          absolute
          left-0
          right-0
          top-0
          z-10

          flex
          items-center
          justify-between

          p-5
          sm:p-6
          lg:p-[clamp(20px,1.5vw,28px)]
        "
      >
        <span
          className="
            text-[8px]
            font-semibold
            tracking-[0.21em]

            text-white/70
            lg:text-black/28

            transition-colors
            duration-500

            lg:group-hover:text-white/70
          "
        >
          {activity.number}
        </span>

        <span
          className="
            flex
            h-8
            w-8
            items-center
            justify-center

            text-white
            lg:text-black/30

            transition-all
            duration-600
            ease-[cubic-bezier(0.22,1,0.36,1)]

            lg:group-hover:translate-x-[3px]
            lg:group-hover:-translate-y-[3px]
            lg:group-hover:text-white
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-[17px] w-[17px]"
            aria-hidden="true"
          >
            <path
              d="M6 18L18 6"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />

            <path
              d="M10 6H18V14"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {/* ================================================================ */}
      {/* CONTENT                                                          */}
      {/* ================================================================ */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          z-10

          p-5
          sm:p-6
          lg:p-[clamp(20px,1.5vw,28px)]
        "
      >
        <div
          className="
            transition-transform
            duration-700
            ease-[cubic-bezier(0.22,1,0.36,1)]

            lg:group-hover:-translate-y-[5px]
          "
        >
          <h3
            className="
              max-w-[10ch]

              text-[clamp(2rem,2.1vw,3rem)]
              font-medium
              leading-[0.94]
              tracking-[-0.05em]

              text-white
              lg:text-[#171A16]

              transition-colors
              duration-500

              lg:group-hover:text-white
            "
          >
            <ContentText section="activityPage" field={activity.titleField} />{" "}
            <ContentText section="activityPage" field={activity.emphasisField} />
          </h3>

          <p
            className="
              mt-4
              max-w-[260px]

              text-[12px]
              leading-[1.7]
              tracking-[-0.005em]

              text-white/70
              lg:text-black/42

              transition-colors
              duration-500

              lg:group-hover:text-white/70
            "
          >
            <ContentText section="activityPage" field={activity.descriptionField} />
          </p>
        </div>

        {/* REVEAL */}

        <div
          className="
            hidden
            h-[22px]
            items-end

            overflow-hidden
            lg:flex
          "
        >
          <span
            className="
              translate-y-5

              text-[8px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-white/70

              opacity-0

              transition-all
              duration-700
              ease-[cubic-bezier(0.22,1,0.36,1)]

              group-hover:translate-y-0
              group-hover:opacity-100
            "
          >
            <ContentText section="activityPage" field="inspect_label" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ==========================================================================
   ABOUT STYLE CTA
   ========================================================================== */

function ActivitiesButton() {
  const { locale } = useSectionContent("activityPage");
  return (
    <Link
      href={localizedHref("/activity", locale)}
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
        text-[#171A16]
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
        >
          <ContentText section="activityPage" field="activities_label" />
        </span>

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

            text-[#24734D]
            opacity-0

            transition-all
            duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]

            group-hover:translate-x-0
            group-hover:-translate-y-1/2
            group-hover:opacity-100
          "
        >
          <ContentText section="activityPage" field="home_activities_cta_hover" />
        </span>
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

/* ==========================================================================
   ACTIVITIES
   ========================================================================== */

export default function Activities() {
  return (
    <section className="bg-[#F4F1EA] text-[#171A16]">
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
          lg:py-[clamp(105px,7.5vw,145px)]
        "
      >
        {/* ================================================================ */}
        {/* INTRO                                                           */}
        {/* ================================================================ */}

        <div
          className="
            grid
            grid-cols-1
            gap-6

            lg:grid-cols-12
            lg:items-end
            lg:gap-[2vw]
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
              <ContentText section="activityPage" field="intro_label" />
            </span>
          </div>

          {/* TITLE */}

          <div className="lg:col-span-5">
            <h2
              className="
                max-w-[540px]

                text-[clamp(2.7rem,3.6vw,4.8rem)]
                font-medium
                leading-[0.95]
                tracking-[-0.055em]
              "
            >
              <ContentText section="activityPage" field="home_activities_title_1" />
              <br />
              <ContentText section="activityPage" field="home_activities_title_2" />
            </h2>
          </div>

          {/* DESCRIPTION */}

          <div className="lg:col-span-3 lg:col-start-10">
            <p
              className="
                max-w-[390px]

                text-[13px]
                leading-[1.8]
                tracking-[-0.005em]
                text-black/45

                sm:text-[14px]
                lg:text-[15px]
              "
            >
              <ContentText section="activityPage" field="home_activities_description" />
            </p>
          </div>
        </div>

        {/* ================================================================ */}
        {/* CARDS                                                           */}
        {/* ================================================================ */}

        <div
          className="
            mt-14

            grid
            grid-cols-1
            gap-4

            sm:mt-16
            sm:grid-cols-2
            sm:gap-5

            lg:mt-[7vh]
            lg:grid-cols-4
            lg:gap-[clamp(12px,1.15vw,22px)]
          "
        >
          {activities.map((activity) => (
            <ActivityCard
              key={activity.number}
              activity={activity}
            />
          ))}
        </div>

        {/* ================================================================ */}
        {/* CTA                                                             */}
        {/* ================================================================ */}

        <div
          className="
            mt-14
            flex
            justify-start

            sm:mt-16
            sm:justify-end

            lg:mt-[6vh]
          "
        >
          <ActivitiesButton />
        </div>
      </div>
    </section>
  );
}
