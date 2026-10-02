"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type MouseEvent } from "react";
import { TR, GB } from "country-flag-icons/react/3x2";
import { GiWheat } from "react-icons/gi";

import logo from "@/assets/logo.png";
import { useHomeLocale } from "@/features/home/content/LocaleProvider";
import type { SiteChrome, SiteLocale } from "@/features/site-chrome/model";
import { isActivitiesLandingPath, isProductDetailPath, localizedHref } from "@/lib/site-routing";

type Lang = "TR" | "EN";

type NavItem = {
  label: string;
  href: string;
  description?: string;
  children?: {
    label: string;
    href: string;
  }[];
};

function navigateCurrentPageToTop(event: MouseEvent<HTMLAnchorElement>, href: string, pathname: string) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const targetPath = href.split("#", 1)[0].split("?", 1)[0] || "/";
  if (href.includes("#") || targetPath !== pathname) return;
  event.preventDefault();
  window.history.replaceState(window.history.state, "", targetPath);
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function localizeNavigation(content: SiteChrome, locale: SiteLocale): NavItem[] {
  return content.navigation.map(item => ({
    label: item.label[locale],
    href: localizedHref(item.href, locale),
    ...(item.description ? { description: item.description[locale] } : {}),
    ...(item.children.length ? { children: item.children.map(child => ({ label: child.label[locale], href: localizedHref(child.href, locale) })) } : {}),
  }));
}

function LanguageSelector({
  selectedLang,
  setSelectedLang,
  scrolled,
}: {
  selectedLang: Lang;
  setSelectedLang: (lang: Lang) => void;
  scrolled: boolean;
}) {
  const [isLangOpen, setIsLangOpen] = useState(false);

  const SelectedFlag = selectedLang === "TR" ? TR : GB;

  return (
    <div className="relative z-[80]">
      <button
        onClick={() => setIsLangOpen((prev) => !prev)}
        className={`
          group
          relative
          isolate
          flex
          cursor-pointer
          items-center
          gap-2.5
          overflow-hidden
          rounded-full
          border
          px-3.5
          py-2
          text-[16px]
          font-medium
          tracking-wide
          transition-all
          duration-500
          ease-[cubic-bezier(0.76,0,0.24,1)]
          ${
            scrolled
              ? "border-[#27272a]/10 text-[#3f3f46] hover:border-[#f07d00]/35 hover:bg-[#27272a]/[0.04]"
              : "border-white/10 text-white hover:border-[#f07d00]/35 hover:bg-white/[0.08]"
          }
        `}
        aria-label="Dil seçimi"
        type="button"
      >
        <span className="absolute inset-0 -z-10 translate-x-[-110%] bg-gradient-to-r from-transparent via-[#f07d00]/20 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-[110%]" />

        <SelectedFlag className="h-4 w-5 rounded-[2px]" />

        <span className="transition-colors duration-500 group-hover:text-[#f07d00]">
          {selectedLang}
        </span>

        <span
          className={`
            text-[14px]
            leading-none
            transition-all
            duration-500
            ease-[cubic-bezier(0.76,0,0.24,1)]
            group-hover:text-[#f07d00]
            ${isLangOpen ? "rotate-180 text-[#f07d00]" : "rotate-0"}
          `}
        >
          ▾
        </span>

        <span className="absolute bottom-1 left-3 right-3 h-[2px] origin-left scale-x-0 rounded-full bg-[#f07d00] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100" />
      </button>

      <AnimatePresence>
        {isLangOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 12,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.96,
            }}
            transition={{
              duration: 0.28,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="absolute left-1/2 top-14 w-36 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/12 bg-[#080808]/92 p-2 shadow-[0_26px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl"
          >
            <button
              onClick={() => {
                setSelectedLang("TR");
                setIsLangOpen(false);
              }}
              className={`
                group/lang
                flex
                w-full
                cursor-pointer
                items-center
                justify-between
                rounded-xl
                px-3.5
                py-3
                text-left
                text-[15px]
                font-medium
                transition-all
                duration-300
                ${
                  selectedLang === "TR"
                    ? "bg-[#f07d00]/12 text-[#f07d00]"
                    : "text-white/70 hover:bg-white/[0.07] hover:text-white"
                }
              `}
              type="button"
            >
              <span className="flex items-center gap-2.5 transition-transform duration-300 group-hover/lang:translate-x-1">
                <TR className="h-4 w-5 rounded-[2px]" />
                TR
              </span>

              <span
                className={`
                  text-xl
                  leading-none
                  text-[#f07d00]
                  transition-all
                  duration-300
                  ${
                    selectedLang === "TR"
                      ? "opacity-100"
                      : "opacity-0 group-hover/lang:translate-x-1 group-hover/lang:opacity-100"
                  }
                `}
              >
                →
              </span>
            </button>

            <button
              onClick={() => {
                setSelectedLang("EN");
                setIsLangOpen(false);
              }}
              className={`
                group/lang
                flex
                w-full
                cursor-pointer
                items-center
                justify-between
                rounded-xl
                px-3.5
                py-3
                text-left
                text-[15px]
                font-medium
                transition-all
                duration-300
                ${
                  selectedLang === "EN"
                    ? "bg-[#f07d00]/12 text-[#f07d00]"
                    : "text-white/70 hover:bg-white/[0.07] hover:text-white"
                }
              `}
              type="button"
            >
              <span className="flex items-center gap-2.5 transition-transform duration-300 group-hover/lang:translate-x-1">
                <GB className="h-4 w-5 rounded-[2px]" />
                EN
              </span>

              <span
                className={`
                  text-xl
                  leading-none
                  text-[#f07d00]
                  transition-all
                  duration-300
                  ${
                    selectedLang === "EN"
                      ? "opacity-100"
                      : "opacity-0 group-hover/lang:translate-x-1 group-hover/lang:opacity-100"
                  }
                `}
              >
                →
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HoverLines() {
  return (
    <>
      <span className="absolute -bottom-[4px] left-0 h-[2px] w-[51%] origin-left scale-x-0 bg-[#f07d00] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/navitem:scale-x-100" />

      <span className="absolute -bottom-[4px] right-0 h-[2px] w-[51%] origin-right scale-x-0 bg-[#f07d00] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/navitem:scale-x-100" />
    </>
  );
}

function DesktopNavItem({
  item,
  scrolled,
  pathname,
}: {
  item: NavItem;
  scrolled: boolean;
  pathname: string;
}) {
  const textColor = scrolled ? "text-[#3f3f46]" : "text-white";

  if (item.children) {
    return (
      <div className="group/navitem relative">
        <Link
          href={item.href}
          onClick={event => navigateCurrentPageToTop(event, item.href, pathname)}
          className={`
            relative
            flex
            cursor-pointer
            items-center
            gap-2.5
            py-2
            text-[18px]
            font-medium
            tracking-wide
            transition-colors
            duration-500
            ease-[cubic-bezier(0.76,0,0.24,1)]
            hover:text-[#f07d00]
            ${textColor}
          `}
        >
          <span className="transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/navitem:-translate-y-[1px]">
            {item.label}
          </span>

          <span className="relative top-[1px] text-[15px] leading-none transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/navitem:rotate-180">
            ▾
          </span>

          <HoverLines />
        </Link>

        <div
          className="
            invisible
            absolute
            left-1/2
            top-14
            w-[280px]
            -translate-x-1/2
            translate-y-4
            overflow-hidden
            rounded-[28px]
            border
            border-white/10
            bg-[#080808]/92
            p-3
            opacity-0
            shadow-[0_34px_100px_rgba(0,0,0,0.36)]
            backdrop-blur-2xl
            transition-all
            duration-300
            group-hover/navitem:visible
            group-hover/navitem:translate-y-0
            group-hover/navitem:opacity-100
          "
        >
          <GiWheat
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-12 h-56 w-56 rotate-[-18deg] text-[#f07d00]/10"
          />

          <div className="relative z-10 mb-3 border-b border-white/10 px-3 pb-4 pt-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#f07d00]">
              {item.label}
            </p>

            {item.description && (
              <p className="mt-2 text-[13px] font-medium leading-5 text-white/45">
                {item.description}
              </p>
            )}
          </div>

          <div className="relative z-10 flex flex-col gap-1.5">
            {item.children.map((child, index) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={event => navigateCurrentPageToTop(event, child.href, pathname)}
                className="
                  group/sub
                  relative
                  flex
                  items-center
                  justify-between
                  overflow-hidden
                  rounded-2xl
                  px-3.5
                  py-3.5
                  text-[17px]
                  font-medium
                  text-white/72
                  transition-all
                  duration-300
                  hover:bg-white/[0.07]
                  hover:text-white
                "
              >
                <span className="flex items-center gap-3 transition-transform duration-300 group-hover/sub:translate-x-1.5">
                  <span className="text-[11px] font-semibold text-white/25 transition-colors duration-300 group-hover/sub:text-[#f07d00]">
                    0{index + 1}
                  </span>

                  {child.label}
                </span>

                <span className="text-[23px] leading-none text-[#f07d00] opacity-0 transition-all duration-300 group-hover/sub:translate-x-1 group-hover/sub:opacity-100">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={event => navigateCurrentPageToTop(event, item.href, pathname)}
      className={`
        group/navitem
        relative
        cursor-pointer
        py-2
        text-[18px]
        font-medium
        tracking-wide
        transition-colors
        duration-500
        ease-[cubic-bezier(0.76,0,0.24,1)]
        hover:text-[#f07d00]
        ${textColor}
      `}
    >
      <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/navitem:-translate-y-[1px]">
        {item.label}
      </span>

      <HoverLines />
    </Link>
  );
}

function DesktopNav({ scrolled, navItems, pathname }: { scrolled: boolean; navItems: NavItem[]; pathname: string }) {
  return (
    <nav className="hidden items-center gap-9 lg:flex">
      {navItems.map((item) => (
        <DesktopNavItem key={item.label} item={item} scrolled={scrolled} pathname={pathname} />
      ))}
    </nav>
  );
}

function HamburgerButton({
  onClick,
  scrolled,
}: {
  onClick: () => void;
  scrolled: boolean;
}) {
  const color = scrolled ? "bg-[#3f3f46]" : "bg-white";

  return (
    <button
      onClick={onClick}
      className={`
        group
        relative
        z-[70]
        flex
        h-12
        w-12
        cursor-pointer
        items-center
        justify-center
        rounded-full
        transition
        duration-500
        ${scrolled ? "hover:bg-[#27272a]/[0.05]" : "hover:bg-white/[0.08]"}
      `}
      aria-label="Menüyü aç"
      type="button"
    >
      <span className="relative flex h-6 w-8 flex-col justify-center">
        <span
          className={`
            absolute
            left-0
            top-[5px]
            h-[2px]
            w-8
            rounded-full
            transition-all
            duration-500
            ease-[cubic-bezier(0.76,0,0.24,1)]
            group-hover:w-5
            group-hover:translate-x-3
            ${color}
          `}
        />

        <span
          className={`
            absolute
            left-0
            top-1/2
            h-[2px]
            w-8
            -translate-y-1/2
            rounded-full
            transition-all
            duration-500
            ease-[cubic-bezier(0.76,0,0.24,1)]
            ${color}
          `}
        />

        <span
          className={`
            absolute
            bottom-[5px]
            right-0
            h-[2px]
            w-5
            rounded-full
            transition-all
            duration-500
            ease-[cubic-bezier(0.76,0,0.24,1)]
            group-hover:w-8
            ${color}
          `}
        />
      </span>
    </button>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{
        rotate: 90,
      }}
      transition={{
        duration: 0.2,
        ease: [0.76, 0, 0.24, 1],
      }}
      className="group relative flex h-12 w-12 cursor-pointer items-center justify-center text-white transition-colors duration-300 hover:text-[#f07d00]"
      aria-label="Menüyü kapat"
      type="button"
    >
      <span className="absolute h-[2px] w-6 rotate-45 rounded-full bg-current" />
      <span className="absolute h-[2px] w-6 -rotate-45 rounded-full bg-current" />
    </motion.button>
  );
}

function MenuDrawer({
  isOpen,
  onClose,
  navItems,
  phoneLabel,
  phoneDisplay,
  phoneHref,
  logoAlt,
  homeAria,
  homeHref,
  pathname,
}: {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  phoneLabel: string;
  phoneDisplay: string;
  phoneHref: string;
  logoAlt: string;
  homeAria: string;
  homeHref: string;
  pathname: string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.35,
            }}
            onClick={onClose}
            aria-label="Menüyü kapat"
            className="fixed inset-0 z-[90] cursor-default bg-black/35 backdrop-blur-[2px] lg:hidden"
          />

          <motion.aside
            initial={{
              x: "100%",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "100%",
            }}
            transition={{
              duration: 0.62,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="
              fixed
              right-0
              top-0
              z-[100]
              flex
              h-dvh
              w-[92vw]
              max-w-[560px]
              flex-col
              overflow-y-auto
              bg-[#070707]
              px-6
              pb-8
              pt-6
              shadow-[-34px_0_120px_rgba(0,0,0,0.48)]
              sm:px-8
              lg:hidden
            "
          >
            <div className="flex items-center justify-between">
              <Link
                href={homeHref}
                onClick={event => { navigateCurrentPageToTop(event, homeHref, pathname); onClose(); }}
                aria-label={homeAria}
                className="inline-flex items-center"
              >
                <Image
                  src={logo}
                  alt={logoAlt}
                  priority
                  className="h-auto w-[132px]"
                />
              </Link>

              <CloseButton onClick={onClose} />
            </div>

            <nav className="mt-16 flex flex-col gap-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{
                    opacity: 0,
                    x: 28,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.12 + index * 0.05,
                    duration: 0.42,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={event => { navigateCurrentPageToTop(event, item.href, pathname); onClose(); }}
                    className="
                      group
                      relative
                      flex
                      items-center
                      justify-between
                      overflow-hidden
                      rounded-2xl
                      px-4
                      py-4
                      transition
                      duration-500
                      hover:bg-white/[0.06]
                    "
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-semibold text-white/25 transition duration-500 group-hover:text-[#f07d00]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="text-[28px] font-medium tracking-[-0.04em] text-white transition duration-500 group-hover:translate-x-2 group-hover:text-[#f07d00]">
                        {item.label}
                      </span>
                    </div>

                    <span className="text-[30px] leading-none text-[#f07d00] opacity-0 transition duration-500 group-hover:translate-x-1 group-hover:opacity-100">
                      →
                    </span>
                  </Link>

                  {item.children && (
                    <div className="ml-14 mt-1 flex flex-col items-start gap-2 pb-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={event => { navigateCurrentPageToTop(event, child.href, pathname); onClose(); }}
                          className="group/sub relative py-1 text-[15px] font-medium text-white/45 transition duration-300 hover:text-white"
                        >
                          <span className="inline-block transition duration-300 group-hover/sub:translate-x-1">
                            {child.label}
                          </span>

                          <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#f07d00] transition-transform duration-300 group-hover/sub:scale-x-100" />
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto pt-8">
              <a
                href={phoneHref}
                className="group block w-fit cursor-pointer py-1"
              >
                <span className="block text-[11px] font-medium uppercase tracking-[0.32em] text-white/32">
                  {phoneLabel}
                </span>

                <span className="mt-3 block text-[34px] font-medium leading-none tracking-[-0.04em] text-white transition-colors duration-500 group-hover:text-[#f07d00]">
                  {phoneDisplay}
                </span>
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Header({ content }: { content: SiteChrome }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { locale, setLocale } = useHomeLocale();
  const selectedLang = locale.toUpperCase() as Lang;
  const navItems = localizeNavigation(content, locale);
  const homeHref = localizedHref("/", locale);
  const solidHeader = hasScrolled || isActivitiesLandingPath(pathname);

  const selectLanguage = (lang: Lang) => {
    const nextLocale = lang.toLowerCase() as SiteLocale;
    if (nextLocale === locale) return;

    const currentHref = `${pathname}${window.location.search}${window.location.hash}`;
    setLocale(nextLocale);
    router.push(localizedHref(currentHref, nextLocale));
  };

  useEffect(() => {
    const handleScroll = () => {
      const isProductDetail = isProductDetailPath(pathname);

      if (isProductDetail) {
        const productHero = document.querySelector<HTMLElement>("[data-product-detail-hero]");
        setHasScrolled(productHero ? productHero.getBoundingClientRect().bottom <= 96 : false);
        return;
      }

      setHasScrolled(window.scrollY > 40);
    };

    handleScroll();
    const frameId = window.requestAnimationFrame(handleScroll);

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    window.addEventListener("resize", handleScroll, {
      passive: true,
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <header
      lang={locale}
      className={`
        fixed
        left-0
        top-0
        z-50
        w-full
        overflow-visible
        transition-[background-color,box-shadow,border-color]
        duration-500
        ease-[cubic-bezier(0.76,0,0.24,1)]
        ${
          solidHeader
            ? "border-b border-black/[0.06] bg-white/95 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }
      `}
      style={{
        fontFamily: '"familjen", "familjen Fallback", sans-serif',
      }}
    >
      <div
        className="
          relative
          mx-auto
          h-24
          max-w-[1500px]
          px-6
          md:px-10
          lg:px-16
        "
      >
        {/* LOGO */}
        <Link
          data-header-logo-target
          href={homeHref}
          onClick={event => navigateCurrentPageToTop(event, homeHref, pathname)}
          aria-label={content.brand.homeAria[locale]}
          className="
            absolute
            left-6
            top-1/2
            z-[70]
            flex
            -translate-y-1/2
            items-center
            md:left-10
            lg:left-16
          "
        >
          <Image
            src={logo}
            alt={content.brand.logoAlt[locale]}
            priority
            draggable={false}
            className="
              h-auto
              w-[140px]
              md:w-[165px]
            "
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="absolute right-6 top-1/2 z-[70] hidden -translate-y-1/2 items-center gap-8 md:right-10 lg:right-16 lg:flex">
          <DesktopNav scrolled={solidHeader} navItems={navItems} pathname={pathname} />

          <span
            className={`
              h-5
              w-px
              transition-colors
              duration-500
              ${solidHeader ? "bg-[#27272a]/15" : "bg-white/20"}
            `}
          />

          <LanguageSelector
            selectedLang={selectedLang}
            setSelectedLang={selectLanguage}
            scrolled={solidHeader}
          />
        </div>

        {/* MOBILE / TABLET */}
        <div className="absolute right-6 top-1/2 z-[70] flex -translate-y-1/2 items-center gap-3 md:right-10 lg:hidden">
          <LanguageSelector
            selectedLang={selectedLang}
            setSelectedLang={selectLanguage}
            scrolled={solidHeader}
          />

          <HamburgerButton
            onClick={() => setIsOpen(true)}
            scrolled={solidHeader}
          />
        </div>
      </div>

      <MenuDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        navItems={navItems}
        phoneLabel={content.contact.phone.label[locale]}
        phoneDisplay={content.contact.phone.display}
        phoneHref={content.contact.phone.href}
        logoAlt={content.brand.logoAlt[locale]}
        homeAria={content.brand.homeAria[locale]}
        homeHref={homeHref}
        pathname={pathname}
      />
    </header>
  );
}
