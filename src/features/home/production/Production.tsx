"use client";

import { useEffect, useRef } from "react";
import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";

import emptyField from "@/assets/img1.png";
import fullField from "@/assets/img2.png";
import { ContentText } from "@/features/home/content/HomeContent";

type Position = {
  x: number;
  y: number;
};

type PathSample = {
  x: number;
  y: number;
  distance: number;
};

/* ==========================================================================
   LOOP PATH
   ========================================================================== */

const LOOP_POINTS: Position[] = [
  { x: 8, y: 64 },
  { x: 18, y: 50 },
  { x: 32, y: 47 },
  { x: 45, y: 58 },
  { x: 60, y: 72 },
  { x: 75, y: 82 },
  { x: 89, y: 74 },
  { x: 92, y: 56 },
  { x: 80, y: 47 },
  { x: 68, y: 54 },
  { x: 55, y: 67 },
  { x: 40, y: 82 },
  { x: 25, y: 86 },
  { x: 11, y: 76 },
];

/* ==========================================================================
   CATMULL-ROM
   ========================================================================== */

function catmullRom(
  p0: Position,
  p1: Position,
  p2: Position,
  p3: Position,
  t: number
): Position {
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x:
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),

    y:
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

/* ==========================================================================
   PRODUCTION
   ========================================================================== */

export default function Production() {
  const fieldRef = useRef<HTMLDivElement>(null);

  const positionRef = useRef<Position>({
    x: 10,
    y: 72,
  });

  const userControllingRef = useRef(false);

  const pathSamplesRef = useRef<PathSample[]>([]);
  const totalPathLengthRef = useRef(0);
  const pathDistanceRef = useRef(0);

  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);

  const resumeTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  /* ==========================================================================
     POSITION
     ========================================================================== */

  const updatePosition = (x: number, y: number) => {
    const field = fieldRef.current;

    if (!field) return;

    const safeX = Math.max(1, Math.min(99, x));
    const safeY = Math.max(1, Math.min(99, y));

    positionRef.current = {
      x: safeX,
      y: safeY,
    };

    field.style.setProperty("--reveal-x", `${safeX}%`);
    field.style.setProperty("--reveal-y", `${safeY}%`);
  };

  /* ==========================================================================
     BUILD LOOP
     ========================================================================== */

  const buildLoopPath = () => {
    const field = fieldRef.current;

    if (!field) return;

    const rect = field.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    if (width <= 0 || height <= 0) return;

    const rawPoints: Position[] = [];

    const count = LOOP_POINTS.length;
    const samplesPerSegment = 40;

    for (let i = 0; i < count; i++) {
      const p0 = LOOP_POINTS[(i - 1 + count) % count];
      const p1 = LOOP_POINTS[i];
      const p2 = LOOP_POINTS[(i + 1) % count];
      const p3 = LOOP_POINTS[(i + 2) % count];

      for (let s = 0; s < samplesPerSegment; s++) {
        const t = s / samplesPerSegment;

        rawPoints.push(
          catmullRom(
            p0,
            p1,
            p2,
            p3,
            t
          )
        );
      }
    }

    rawPoints.push(rawPoints[0]);

    const samples: PathSample[] = [];

    let cumulativeDistance = 0;

    samples.push({
      x: rawPoints[0].x,
      y: rawPoints[0].y,
      distance: 0,
    });

    for (let i = 1; i < rawPoints.length; i++) {
      const previous = rawPoints[i - 1];
      const current = rawPoints[i];

      const dx =
        ((current.x - previous.x) / 100) *
        width;

      const dy =
        ((current.y - previous.y) / 100) *
        height;

      cumulativeDistance += Math.sqrt(
        dx * dx + dy * dy
      );

      samples.push({
        x: current.x,
        y: current.y,
        distance: cumulativeDistance,
      });
    }

    pathSamplesRef.current = samples;
    totalPathLengthRef.current = cumulativeDistance;

    if (pathDistanceRef.current > cumulativeDistance) {
      pathDistanceRef.current =
        pathDistanceRef.current %
        cumulativeDistance;
    }
  };

  /* ==========================================================================
     POSITION ON LOOP
     ========================================================================== */

  const getPositionAtDistance = (
    distance: number
  ): Position | null => {
    const samples = pathSamplesRef.current;
    const total = totalPathLengthRef.current;

    if (samples.length < 2 || total <= 0) {
      return null;
    }

    const normalized =
      ((distance % total) + total) %
      total;

    let low = 0;
    let high = samples.length - 1;

    while (low < high) {
      const middle = Math.floor(
        (low + high) / 2
      );

      if (
        samples[middle].distance <
        normalized
      ) {
        low = middle + 1;
      } else {
        high = middle;
      }
    }

    const nextIndex = Math.max(1, low);

    const previous =
      samples[nextIndex - 1];

    const next =
      samples[nextIndex];

    const segmentLength =
      next.distance -
      previous.distance;

    if (segmentLength <= 0) {
      return {
        x: next.x,
        y: next.y,
      };
    }

    const progress =
      (normalized -
        previous.distance) /
      segmentLength;

    return {
      x:
        previous.x +
        (next.x - previous.x) *
          progress,

      y:
        previous.y +
        (next.y - previous.y) *
          progress,
    };
  };

  /* ==========================================================================
     NEAREST LOOP POINT
     ========================================================================== */

  const findNearestPathDistance = (
    x: number,
    y: number
  ) => {
    const field = fieldRef.current;

    if (!field) return;

    const rect =
      field.getBoundingClientRect();

    const samples =
      pathSamplesRef.current;

    if (!samples.length) return;

    let nearestDistance =
      samples[0].distance;

    let nearestSquared =
      Infinity;

    for (const sample of samples) {
      const dx =
        ((sample.x - x) / 100) *
        rect.width;

      const dy =
        ((sample.y - y) / 100) *
        rect.height;

      const squared =
        dx * dx + dy * dy;

      if (squared < nearestSquared) {
        nearestSquared = squared;
        nearestDistance =
          sample.distance;
      }
    }

    pathDistanceRef.current =
      nearestDistance;
  };

  /* ==========================================================================
     AUTO LOOP
     ========================================================================== */

  useEffect(() => {
    buildLoopPath();

    const field = fieldRef.current;

    let resizeObserver:
      | ResizeObserver
      | undefined;

    if (
      field &&
      typeof ResizeObserver !==
        "undefined"
    ) {
      resizeObserver =
        new ResizeObserver(() => {
          buildLoopPath();
        });

      resizeObserver.observe(field);
    }

    const animate = (time: number) => {
      if (
        lastFrameTimeRef.current ===
        null
      ) {
        lastFrameTimeRef.current =
          time;
      }

      const deltaMs =
        time -
        lastFrameTimeRef.current;

      lastFrameTimeRef.current =
        time;

      if (
        !userControllingRef.current &&
        totalPathLengthRef.current > 0
      ) {
        /*
         * Sabit hız.
         * Target / easing / acceleration yok.
         */
        const SPEED_PX_PER_SECOND = 105;

        const safeDeltaMs = Math.min(
          deltaMs,
          50
        );

        const travelled =
          SPEED_PX_PER_SECOND *
          (safeDeltaMs / 1000);

        pathDistanceRef.current =
          (pathDistanceRef.current +
            travelled) %
          totalPathLengthRef.current;

        const position =
          getPositionAtDistance(
            pathDistanceRef.current
          );

        if (position) {
          updatePosition(
            position.x,
            position.y
          );
        }
      }

      animationFrameRef.current =
        requestAnimationFrame(
          animate
        );
    };

    animationFrameRef.current =
      requestAnimationFrame(animate);

    return () => {
      if (
        animationFrameRef.current
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }

      if (
        resumeTimeoutRef.current
      ) {
        clearTimeout(
          resumeTimeoutRef.current
        );
      }

      resizeObserver?.disconnect();
    };

  }, []);

  /* ==========================================================================
     POINTER ENTER
     ========================================================================== */

  const handlePointerEnter = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    const field = fieldRef.current;

    if (!field) return;

    if (resumeTimeoutRef.current) {
      clearTimeout(
        resumeTimeoutRef.current
      );
    }

    const rect =
      field.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) /
        rect.width) *
      100;

    const y =
      ((event.clientY - rect.top) /
        rect.height) *
      100;

    userControllingRef.current =
      true;

    updatePosition(x, y);
  };

  /* ==========================================================================
     POINTER MOVE
     ========================================================================== */

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    const field = fieldRef.current;

    if (!field) return;

    const rect =
      field.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) /
        rect.width) *
      100;

    const y =
      ((event.clientY - rect.top) /
        rect.height) *
      100;

    userControllingRef.current =
      true;

    updatePosition(x, y);
  };

  /* ==========================================================================
     POINTER LEAVE
     ========================================================================== */

  const handlePointerLeave = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(
        resumeTimeoutRef.current
      );
    }

    resumeTimeoutRef.current =
      setTimeout(() => {
        const current =
          positionRef.current;

        findNearestPathDistance(
          current.x,
          current.y
        );

        userControllingRef.current =
          false;

        lastFrameTimeRef.current =
          performance.now();
      }, 350);
  };

  return (
    <section className="relative overflow-hidden bg-[#f1efe8]">
      {/* ==================================================================== */}
      {/* BACKGROUND TYPOGRAPHY                                               */}
      {/* ==================================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[110px]
          -translate-x-1/2

          select-none
          whitespace-nowrap

          text-[26vw]
          font-semibold
          leading-none
          tracking-[-0.08em]

          text-black/[0.025]
        "
      >
        <ContentText section="activityPage" field="home_production_background_label" />
      </div>

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1672px]

          px-5
          pb-8
          pt-24

          md:px-8
          md:pb-12
          md:pt-32

          lg:px-10
          lg:pb-16
          lg:pt-40
        "
      >
        {/* ================================================================== */}
        {/* INTRO                                                              */}
        {/* ================================================================== */}

        <div
          className="
            relative
            z-10

            grid
            grid-cols-1
            gap-12

            border-t
            border-black/15

            pt-6

            lg:grid-cols-12
            lg:gap-8
            lg:pt-8
          "
        >
          {/* LABEL - FAALİYETLERİMİZ İLE AYNI */}

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
              <ContentText section="activityPage" field="home_production_section_label" />
            </span>
          </div>

          {/* TITLE */}

          <div className="lg:col-span-6">
            <h2
              className="
                max-w-[820px]

                text-[42px]
                font-medium
                leading-[0.98]
                tracking-[-0.055em]
                text-[#151713]

                sm:text-[52px]
                md:text-[64px]
                lg:text-[72px]
                xl:text-[82px]
              "
            >
              <ContentText section="activityPage" field="home_production_title_line_1" />
              <br />

              <span className="font-normal italic text-[#24734D]">
                <ContentText section="activityPage" field="home_production_title_line_2" />
              </span>

              <br />

              <ContentText section="activityPage" field="home_production_title_line_3" />
            </h2>
          </div>

          {/* DESCRIPTION */}

          <div
            className="
              flex
              flex-col
              justify-between
              gap-12

              lg:col-span-4
              lg:pl-6
            "
          >
            <p
              className="
                max-w-[430px]

                text-[15px]
                leading-[1.75]
                text-black/60

                md:text-[16px]
              "
            >
              <ContentText section="activityPage" field="home_production_description" />
            </p>

            {/* PRODUCTS */}

            <div
              className="
                flex
                flex-wrap
                gap-x-8
                gap-y-4

                border-t
                border-black/10

                pt-5
              "
            >
              {[1, 3, 2, 4].map(
                (productIndex, index) => (
                  <div
                    key={productIndex}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="
                        text-[15px]
                        tabular-nums
                        text-black/30
                      "
                    >
                      0{index + 1}
                    </span>

                    <span
                      className="
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.16em]
                        text-black/60
                      "
                    >
                      <ContentText section="activityPage" field={`product_${productIndex}_name`} />
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* TRANSITION                                                        */}
        {/* ================================================================== */}

        <div
          className="
            relative
            my-12

            flex
            items-center
            gap-5

            md:my-16
          "
        >
          <div className="h-px flex-1 bg-black/12" />

          <span
            className="
              whitespace-nowrap
              text-[9px]
              font-medium
              uppercase
              tracking-[0.24em]
              text-black/35
            "
          >
            <ContentText section="activityPage" field="home_production_transition_label" />
          </span>

          <div className="h-px w-12 bg-black/12" />
        </div>

        {/* ================================================================== */}
        {/* IMAGE AREA                                                         */}
        {/* ================================================================== */}

        <div className="relative">
          {/* DECORATION */}

          <div
            aria-hidden="true"
            className="
              absolute
              -left-3
              -top-3
              hidden

              h-24
              w-px
              bg-black/15

              lg:block
            "
          />

          <div
            aria-hidden="true"
            className="
              absolute
              -left-3
              -top-3
              hidden

              h-px
              w-24
              bg-black/15

              lg:block
            "
          />

          {/* ================================================================ */}
          {/* FIELD                                                            */}
          {/* ================================================================ */}

          <div
            ref={fieldRef}
            onPointerEnter={
              handlePointerEnter
            }
            onPointerMove={
              handlePointerMove
            }
            onPointerLeave={
              handlePointerLeave
            }
            className="
              relative

              aspect-[1672/941]
              w-full
              max-w-[1672px]

              cursor-none
              overflow-hidden

              rounded-[3px]

              bg-[#201e18]

              shadow-[0_30px_80px_rgba(30,28,20,0.12)]
            "
            style={
              {
                "--reveal-x": "10%",
                "--reveal-y": "72%",
              } as CSSProperties
            }
          >
            {/* =============================================================== */}
            {/* FULL FIELD                                                      */}
            {/* =============================================================== */}

            <Image
              src={fullField}
              alt="Yeşil arpa, mısır, buğday ve ayçiçeği ekili tarla"
              fill
              priority
              unoptimized
              sizes="(max-width: 1672px) 100vw, 1672px"
              draggable={false}
              className="
                pointer-events-none
                select-none
                object-cover
              "
            />

            {/* =============================================================== */}
            {/* EMPTY FIELD + REVEAL                                            */}
            {/* =============================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                z-10
              "
              style={{
                WebkitMaskImage: `
                  radial-gradient(
                    circle clamp(190px, 18vw, 320px)
                    at var(--reveal-x) var(--reveal-y),

                    transparent 0%,
                    transparent 54%,

                    rgba(0,0,0,0.05) 61%,
                    rgba(0,0,0,0.17) 69%,
                    rgba(0,0,0,0.42) 79%,
                    rgba(0,0,0,0.72) 89%,

                    black 100%
                  )
                `,

                maskImage: `
                  radial-gradient(
                    circle clamp(190px, 18vw, 320px)
                    at var(--reveal-x) var(--reveal-y),

                    transparent 0%,
                    transparent 54%,

                    rgba(0,0,0,0.05) 61%,
                    rgba(0,0,0,0.17) 69%,
                    rgba(0,0,0,0.42) 79%,
                    rgba(0,0,0,0.72) 89%,

                    black 100%
                  )
                `,
              }}
            >
              <Image
                src={emptyField}
                alt="Ekime hazır boş tarla"
                fill
                priority
                unoptimized
                sizes="(max-width: 1672px) 100vw, 1672px"
                draggable={false}
                className="
                  pointer-events-none
                  select-none
                  object-cover
                "
              />
            </div>

            {/* =============================================================== */}
            {/* CINEMATIC OVERLAY                                               */}
            {/* =============================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                z-20

                bg-gradient-to-t
                from-black/30
                via-transparent
                to-black/[0.04]
              "
            />

            {/* =============================================================== */}
            {/* TOP META                                                        */}
            {/* =============================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                left-0
                top-0
                z-30

                flex
                w-full
                items-start
                justify-between

                p-5
                md:p-7
                lg:p-9
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3

                  rounded-full
                  border
                  border-white/20

                  bg-black/10

                  px-4
                  py-2.5

                  backdrop-blur-md
                "
              >
                <span
                  className="
                    h-[6px]
                    w-[6px]
                    rounded-full
                    bg-[#d9e9b5]
                  "
                />

                <span
                  className="
                    text-[11px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-white/90

                    md:text-[12px]
                  "
                >
                  <ContentText section="activityPage" field="home_production_explore_label" />
                </span>
              </div>

              <div className="hidden text-right md:block">
                <span
                  className="
                    block
                    text-[9px]
                    uppercase
                    tracking-[0.24em]
                    text-white/50
                  "
                >
                  <ContentText section="activityPage" field="home_production_interactive_label" />
                </span>

                <span
                  className="
                    mt-1
                    block
                    text-[11px]
                    text-white/80
                  "
                >
                  <ContentText section="activityPage" field="home_production_interaction_hint" />
                </span>
              </div>
            </div>

            {/* =============================================================== */}
            {/* CURSOR                                                          */}
            {/* =============================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                z-40

                left-[var(--reveal-x)]
                top-[var(--reveal-y)]

                hidden

                -translate-x-1/2
                -translate-y-1/2

                md:block
              "
            >
              <div
                className="
                  flex
                  h-[88px]
                  w-[88px]

                  items-center
                  justify-center

                  rounded-full

                  border
                  border-white/45

                  bg-white/[0.08]

                  shadow-[0_12px_35px_rgba(0,0,0,0.12)]

                  backdrop-blur-[5px]
                "
              >
                <div className="flex items-center gap-2">
                  <span
                    className="
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.17em]
                      text-white
                    "
                  >
                    <ContentText section="activityPage" field="home_production_cursor_label" />
                  </span>

                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 9L9 3M5 3H9V7"
                      stroke="white"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* =============================================================== */}
            {/* BOTTOM TEXT                                                     */}
            {/* =============================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                bottom-0
                left-0
                z-30

                flex
                w-full
                items-end
                justify-between

                p-5
                md:p-7
                lg:p-9
              "
            >
              <p
                className="
                  hidden
                  max-w-[430px]

                  text-[14px]
                  font-normal
                  leading-[1.6]
                  text-white/75

                  lg:block
                  lg:text-[15px]
                "
              >
                <ContentText section="activityPage" field="home_production_image_description" />
              </p>

              <div className="ml-auto flex items-center gap-5">
                <span className="hidden h-px w-12 bg-white/35 sm:block" />

                <span
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.22em]
                    text-white/65
                  "
                >
                  <ContentText section="activityPage" field="home_production_image_state_label" />
                </span>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* IMAGE CAPTION                                                     */}
          {/* ================================================================= */}

          <div
            className="
              flex
              items-start
              justify-between
              gap-10

              border-b
              border-black/10

              py-6
            "
          >
            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.22em]
                text-black/35
              "
            >
              <ContentText section="activityPage" field="home_production_location_label" />
            </span>

            <span
              className="
                max-w-[520px]

                text-right
                text-[12px]
                leading-[1.65]
                text-black/50

                md:text-[13px]
              "
            >
              <ContentText section="activityPage" field="home_production_caption" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
