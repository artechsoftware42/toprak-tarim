"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

import { useLenis } from "@/components/SmoothScroll";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);
  const { getLenis } = useLenis();

  const resetScrollImmediately = useCallback(() => {
    const lenis = getLenis();

    if (lenis) {
      lenis.start();
      lenis.scrollTo(0, {
        immediate: true,
        force: true,
      });
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [getLenis]);

  const scrollToHashTarget = useCallback((hash: string) => {
    let targetId = hash.replace(/^#/, "");

    try {
      targetId = decodeURIComponent(targetId);
    } catch {
      // Malformed hashes cannot match a valid DOM id.
    }

    const target = document.getElementById(targetId);
    if (!target) return;

    const targetTop = target.getBoundingClientRect().top + window.scrollY - 96;
    const lenis = getLenis();

    if (lenis) {
      lenis.start();
      lenis.scrollTo(targetTop, {
        immediate: true,
        force: true,
      });
    }

    window.scrollTo({
      top: targetTop,
      left: 0,
      behavior: "auto",
    });
  }, [getLenis]);

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;
    previousPathnameRef.current = pathname;

    const hash = window.location.hash;
    const applyNavigationScroll = () => {
      if (hash) {
        scrollToHashTarget(hash);
        return;
      }

      resetScrollImmediately();
    };

    applyNavigationScroll();

    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      applyNavigationScroll();
      secondFrame = window.requestAnimationFrame(applyNavigationScroll);
    });
    const settleTimer = window.setTimeout(applyNavigationScroll, 120);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(settleTimer);
    };
  }, [pathname, resetScrollImmediately, scrollToHashTarget]);

  useEffect(() => {
    const handleInternalLinkClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      const isCurrentPage =
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search;

      if (destination.hash) {
        if (isCurrentPage) {
          window.requestAnimationFrame(() => {
            scrollToHashTarget(destination.hash);
            window.requestAnimationFrame(() => scrollToHashTarget(destination.hash));
          });
          window.setTimeout(() => scrollToHashTarget(destination.hash), 120);
        }
        return;
      }

      if (isCurrentPage) resetScrollImmediately();
    };

    document.addEventListener("click", handleInternalLinkClick, true);
    return () => document.removeEventListener("click", handleInternalLinkClick, true);
  }, [resetScrollImmediately, scrollToHashTarget]);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const lenis = getLenis();

    if (lenis) {
      /*
       * Lenis herhangi bir nedenle durmuşsa tekrar aktif hale getir.
       */
      lenis.start();

      /*
       * ÖNEMLİ:
       *
       * Global Lenis ayarımızda lerp kullanıldığı için burada
       * duration vermiyoruz.
       *
       * Daha düşük lerp = daha yavaş ve gözle görülür hareket.
       *
       * force: true:
       * İlk tık dahil komutun Lenis tarafından yok sayılmasını engeller.
       *
       * lock: true:
       * Yukarı çıkarken kullanıcı scroll yaparak animasyonu bozamasın.
       */
      lenis.scrollTo(0, {
        lerp: 0.055,
        force: true,
        lock: true,
      });

      return;
    }

    /*
     * Lenis yoksa fallback.
     * Buraya normal şartlarda düşmez.
     */
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          aria-label="Sayfanın en üstüne çık"
          onClick={scrollToTop}
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.88,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 20,
            scale: 0.88,
          }}
          transition={{
            duration: 0.35,
            ease: [0.76, 0, 0.24, 1],
          }}
          whileHover={{
            y: -4,
          }}
          whileTap={{
            scale: 0.94,
          }}
          className="
            group
            fixed
            bottom-6
            right-6
            z-[80]

            flex
            h-14
            w-14
            cursor-pointer
            items-center
            justify-center

            overflow-hidden
            rounded-full

            border
            border-black/[0.07]

            bg-white/95
            text-[#1D6847]

            shadow-[0_12px_40px_rgba(0,0,0,0.12)]
            backdrop-blur-xl

            transition-[border-color,box-shadow,color]
            duration-500
            ease-[cubic-bezier(0.76,0,0.24,1)]

            hover:border-[#f07d00]/30
            hover:text-white
            hover:shadow-[0_18px_50px_rgba(0,0,0,0.16)]

            md:bottom-8
            md:right-8
          "
        >
          {/* Hover sırasında aşağıdan çıkan turuncu yüzey */}
          <span
            className="
              absolute
              inset-0
              translate-y-full

              bg-[#f07d00]

              transition-transform
              duration-500
              ease-[cubic-bezier(0.76,0,0.24,1)]

              group-hover:translate-y-0
            "
          />

          {/* Yukarı oku */}
          <FiArrowUp
            className="
              relative
              z-10

              text-[24px]
              stroke-[2.2]

              transition-transform
              duration-500
              ease-[cubic-bezier(0.76,0,0.24,1)]

              group-hover:-translate-y-[2px]
            "
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
