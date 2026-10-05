"use client";

import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

import productionBackground from "@/assets/hero3.png";
import siteIcon from "@/assets/icon.png";

const INACTIVE_COLOR = "#b8bab6";
const ANTHRACITE_COLOR = "#18211d";
const GREEN_COLOR = "#708f68";

/*
  Toplam renklenen harf sayısı:

  Emek       = 4
  Topraktan  = 9
  Doğar      = 5
  Güvenle    = 7
  Değere     = 6
  Dönüşür    = 7

  Toplam     = 38
*/
const TOTAL_LETTERS = 38;

type AnimatedWordProps = {
  text: string;
  startIndex: number;
  progress: MotionValue<number>;
  targetColor: string;
  className?: string;
};

type AnimatedLetterProps = {
  character: string;
  globalIndex: number;
  progress: MotionValue<number>;
  targetColor: string;
};

export default function ProductionStatementSection() {
  const sectionRef = useRef<HTMLElement>(null);

  /*
    Bölümün başlangıcında progress = 0
    Bölümün sonunda progress = 1

    Arada hiçbir spring veya gecikme bulunmuyor.
    Değer doğrudan scrollbar konumuna bağlı.
  */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /*
    Yaprak ikonu, "Topraktan" kelimesinin ilk harfiyle
    aynı anda gri renkten yeşile geçer.
  */
  const iconStart =
    0.1 + (4 / (TOTAL_LETTERS - 1)) * 0.76;

  const iconEnd = iconStart + 0.045;

  const iconColor = useTransform(
    scrollYProgress,
    [iconStart, iconEnd],
    [INACTIVE_COLOR, GREEN_COLOR],
  );

  /*
    Çok hafif arka plan hareketi de doğrudan scrolla bağlıdır.
    İstenmezse backgroundY ve backgroundScale kaldırılabilir.
  */
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "-4%"],
  );

  const backgroundScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1.04, 1.1],
  );

  return (
    /*
      300vh kaydırma alanı oluşturur.
      İçindeki ekran sticky olduğu için kullanıcı yaklaşık
      iki ekran boyunca renk dönüşümünü izler.
    */
    <section
      ref={sectionRef}
      className="relative h-[300vh] w-full bg-[#f3f0e9]"
    >
      {/* TAM EKRAN STICKY ALAN */}
      <div className="sticky top-0 h-screen min-h-[680px] w-full overflow-hidden bg-[#f3f0e9]">
        {/* ARKA PLAN GÖRSELİ */}
        <motion.div
          aria-hidden="true"
          style={{
            y: backgroundY,
            scale: backgroundScale,
          }}
          className="pointer-events-none absolute -inset-[6%]"
        >
          <Image
            src={productionBackground}
            alt=""
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>

        {/* Açık krem ana filtre */}
        <div className="pointer-events-none absolute inset-0 bg-[#f6f3ec]/80" />

        {/* Görselin kenarlarını yumuşatan katman */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(246,243,236,0.1)_0%,rgba(246,243,236,0.35)_45%,rgba(246,243,236,0.72)_100%)]" />

        {/* Üst ve alt beyaz geçiş */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f8f6f1]/30 via-transparent to-[#f8f6f1]/55" />

        {/* ANA İÇERİK */}
        <div className="relative z-10 h-full w-full">
          {/* ANA METİN */}
          <div className="flex h-full w-full items-center justify-center px-5 pb-4 pt-[135px] sm:px-10 sm:pt-[5px] lg:px-16">
            <h2
              aria-label="Emek Topraktan Doğar Güvenle Değere Dönüşür"
              className="w-full max-w-[1300px] text-center font-medium tracking-[-0.075em]"
            >
              <span aria-hidden="true">
                {/* 1. SATIR */}
                <span className="block text-[clamp(3.4rem,6.3vw,7.5rem)] leading-[0.88]">
                  <AnimatedWord
                    text="Emek"
                    startIndex={0}
                    progress={scrollYProgress}
                    targetColor={ANTHRACITE_COLOR}
                  />
                </span>

                {/* 2. SATIR */}
                <span className="mt-[0.02em] flex flex-wrap items-center justify-center gap-x-[0.14em] text-[clamp(3.25rem,6.3vw,7.5rem)] leading-[0.86]">
                  <span className="inline-flex items-center">
                    <motion.span
                      aria-hidden="true"
                      style={{
                        backgroundColor: iconColor,
                        WebkitMaskImage: `url(${siteIcon.src})`,
                        maskImage: `url(${siteIcon.src})`,
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                      }}
                      className="mr-[0.035em] inline-flex h-[0.62em] w-[0.62em] shrink-0 translate-y-[0.045em]"
                    />

                    <AnimatedWord
                      text="Topraktan"
                      startIndex={4}
                      progress={scrollYProgress}
                      targetColor={GREEN_COLOR}
                    />
                  </span>

                  <AnimatedWord
                    text="Doğar"
                    startIndex={13}
                    progress={scrollYProgress}
                    targetColor={ANTHRACITE_COLOR}
                  />
                </span>

                {/* 3. SATIR */}
                <span className="mt-[0.02em] flex flex-wrap items-center justify-center gap-x-[0.15em] text-[clamp(2.65rem,5.65vw,6.8rem)] leading-[0.9]">
                  <AnimatedWord
                    text="Güvenle"
                    startIndex={18}
                    progress={scrollYProgress}
                    targetColor={ANTHRACITE_COLOR}
                  />

                  <AnimatedWord
                    text="Değere"
                    startIndex={25}
                    progress={scrollYProgress}
                    targetColor={ANTHRACITE_COLOR}
                  />

                  <AnimatedWord
                    text="Dönüşür"
                    startIndex={31}
                    progress={scrollYProgress}
                    targetColor={ANTHRACITE_COLOR}
                  />
                </span>
              </span>
            </h2>
          </div>

          {/* SCROLL GÖSTERGESİ */}
          <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#555b56]/65">
              Kaydır
            </span>

            <div className="relative h-[42px] w-px overflow-hidden bg-[#60655f]/20">
              <motion.span
                style={{
                  scaleY: scrollYProgress,
                }}
                className="absolute inset-0 origin-top bg-[#556057]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function AnimatedWord({
  text,
  startIndex,
  progress,
  targetColor,
  className = "",
}: AnimatedWordProps) {
  return (
    <span className={`inline-flex whitespace-nowrap ${className}`}>
      {Array.from(text).map((character, index) => (
        <AnimatedLetter
          key={`${text}-${index}`}
          character={character}
          globalIndex={startIndex + index}
          progress={progress}
          targetColor={targetColor}
        />
      ))}
    </span>
  );
}

function AnimatedLetter({
  character,
  globalIndex,
  progress,
  targetColor,
}: AnimatedLetterProps) {
  /*
    Renklenme yüzde 10'da başlar.
    Son harf yaklaşık yüzde 86 civarında tamamlanır.

    Her harfin başlangıç değeri farklı olduğu için
    harfler sırayla renklenir.
  */
  const start =
    0.1 +
    (globalIndex / (TOTAL_LETTERS - 1)) * 0.76;

  const end = Math.min(start + 0.045, 0.92);

  const color = useTransform(
    progress,
    [start, end],
    [INACTIVE_COLOR, targetColor],
  );

  return (
    <motion.span
      style={{ color }}
      className="inline-block"
    >
      {character}
    </motion.span>
  );
}

