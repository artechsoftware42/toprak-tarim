"use client";

import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedinIn, FaFacebookF } from "react-icons/fa6";
import { HiArrowUpRight } from "react-icons/hi2";

import brandLogo from "@/assets/logo.png";
import artechLogo from "@/assets/artech.png";
import { useHomeLocale } from "@/features/home/content/LocaleProvider";
import type { SiteChrome } from "@/features/site-chrome/model";
import { localizedHref } from "@/lib/site-routing";

const socialIcons = { instagram: FaInstagram, linkedin: FaLinkedinIn, facebook: FaFacebookF };

function MarqueeLine({ items }: { items: string[] }) {
  return (
    <div className="flex shrink-0 items-center">
      {Array.from({ length: 8 }).map((_, groupIndex) => (
        <div key={groupIndex} className="flex items-center">
          {items.map((item) => (
            <div
              key={`${groupIndex}-${item}`}
              className="flex items-center text-[clamp(3.4rem,8vw,9.5rem)] font-semibold uppercase leading-none tracking-[-0.08em]"
            >
              <span className="bg-gradient-to-r from-[#5A5A5A] via-[#343434] to-[#4A4A4A] bg-clip-text text-transparent opacity-90">
                {item}
              </span>

              <span className="mx-7 text-[0.35em] text-[#323232] sm:mx-10 lg:mx-16">
                /
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function NavigationBlock({
  index,
  title,
  href,
  links,
}: {
  index: number;
  title: string;
  href: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="group">
      <Link
        href={href}
        className="inline-flex items-center gap-3 text-[25px] font-semibold tracking-[-0.055em] text-[#F2F2F2] transition duration-500 hover:text-white sm:text-[30px] lg:text-[34px]"
      >
        <span className="text-[12px] font-semibold tracking-[0.18em] text-[#8E8E8E] transition duration-500 group-hover:text-[#F2F2F2]">
          0{index + 1}
        </span>

        <span className="transition duration-500 group-hover:translate-x-2">
          {title}
        </span>

        <HiArrowUpRight className="text-[20px] opacity-0 transition duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
      </Link>

      {links.length > 0 && (
        <div className="mt-5 flex flex-col items-start gap-3.5 pl-9">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group/sub relative inline-flex overflow-hidden text-[17px] font-medium text-[#8D8F8F] transition-colors duration-500 ease-out hover:text-[#F2F2F2]"
            >
              <span className="relative z-10 transition-transform duration-500 ease-out group-hover/sub:-translate-y-[1px]">
                {link.label}
              </span>

              <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-[#8D8F8F] via-[#D6D6D6] to-[#F2F2F2] transition-transform duration-500 ease-out group-hover/sub:scale-x-100" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Footer({ content }: { content: SiteChrome }) {
  const { locale } = useHomeLocale();
  const footerNavigation = content.navigation.map(item => ({
    title: item.label[locale],
    href: localizedHref(item.href, locale),
    links: item.children.map(child => ({ label: child.label[locale], href: localizedHref(child.href, locale) })),
  }));
  const marqueeItems = content.brand.marquee[locale];

  return (
    <footer
      lang={locale}
      className="overflow-hidden bg-[#060606] text-[#F2F2F2]"
      style={{
        fontFamily: '"familjen", "familjen Fallback", sans-serif',
      }}
    >
      {/* Marquee */}
      <div className="select-none overflow-hidden bg-[linear-gradient(180deg,#1D1D1D_0%,#141414_52%,#060606_100%)] pb-16 pt-8 sm:pt-10 lg:pt-12">
        <div className="footer-marquee flex w-max items-center">
          <MarqueeLine items={marqueeItems} />
          <MarqueeLine items={marqueeItems} />
        </div>
      </div>

      <div className="mx-auto max-w-[1540px] px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24">
        {/* Main */}
        <div className="grid gap-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-32">
          {/* Left Side */}
          <div>
            <Link
              href={localizedHref("/", locale)}
              aria-label={content.brand.homeAria[locale]}
              className="group inline-block"
            >
              <Image
                src={brandLogo}
                alt={content.brand.logoAlt[locale]}
                className="h-auto w-44 object-contain transition duration-500 group-hover:-translate-y-1 group-hover:opacity-80 sm:w-56"
                priority
              />
            </Link>

            <p className="mt-10 max-w-[400px] text-[17px] font-medium leading-[1.65] tracking-[-0.025em] text-[#8D8F8F] sm:text-[19px]">
              {content.brand.tagline[locale]}
            </p>

            <div className="mt-11 flex items-center gap-8">
              {content.socials.map((social) => {
                const Icon = socialIcons[social.key as keyof typeof socialIcons];

                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="group text-[#D6D6D6] transition duration-300 hover:-translate-y-1 hover:text-white"
                  >
                    <Icon className="text-[26px] transition duration-300 group-hover:scale-110" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side */}
          <div className="grid gap-16 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-start xl:gap-40 2xl:gap-48">
            {/* Menü kendi alanında ortada kalıyor */}
            <div className="flex justify-center xl:justify-center xl:-translate-x-12 2xl:-translate-x-16">
              <nav className="grid gap-y-12 sm:grid-cols-[max-content_max-content] sm:gap-x-16 lg:gap-x-20 xl:gap-x-24">
                {footerNavigation.map((section, index) => (
                  <NavigationBlock
                    key={section.title}
                    index={index}
                    title={section.title}
                    href={section.href}
                    links={section.links}
                  />
                ))}
              </nav>
            </div>

            {/* Sadece Mail / Telefon / Adres sağa dayalı */}
            <div className="flex flex-col gap-9 xl:items-end xl:text-right">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8E8E8E]">
                  {content.contact.email.label[locale]}
                </p>

                <Link
                  href={content.contact.email.href}
                  className="text-[18px] font-medium text-[#F2F2F2] transition duration-300 hover:text-white"
                >
                  {content.contact.email.display}
                </Link>
              </div>

              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8E8E8E]">
                  {content.contact.phone.label[locale]}
                </p>

                <Link
                  href={content.contact.phone.href}
                  className="text-[22px] font-medium text-[#F2F2F2] transition duration-300 hover:text-white"
                >
                  {content.contact.phone.display}
                </Link>
              </div>

              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8E8E8E]">
                  {content.contact.address.label[locale]}
                </p>

                <Link
                  href={content.contact.address.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[18px] font-medium text-[#F2F2F2] transition duration-300 hover:text-white"
                >
                  {content.contact.address.display[locale]}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-20 flex flex-col gap-6 border-t border-[#2A2A2A] pt-8 lg:mt-24 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[12px] font-semibold uppercase tracking-[0.32em] text-[#8E8E8E]">
            {content.footer.legalLabel[locale]}
          </p>

          <div className="flex flex-wrap gap-x-9 gap-y-4">
            {content.footer.legalLinks.map((link) => (
              <Link
                key={link.href}
                href={localizedHref(link.href, locale)}
                className="group relative inline-flex overflow-hidden text-[14px] font-medium text-[#8D8F8F] transition-colors duration-500 ease-out hover:text-[#F2F2F2]"
              >
                <span className="relative z-10 transition-transform duration-500 ease-out group-hover:-translate-y-[1px]">
                  {link.label[locale]}
                </span>

                <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-[#8D8F8F] via-[#D6D6D6] to-[#F2F2F2] transition-transform duration-500 ease-out group-hover:scale-x-100" />
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-[#2A2A2A] pt-8">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[14px] font-medium text-[#D6D6D6]">
              {content.footer.copyright[locale]}
            </p>

            <Link
              href="https://artechsoftware.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Artech Software"
              className="group flex w-fit items-center gap-4"
            >
              <span className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#8E8E8E] transition duration-300 group-hover:text-[#D6D6D6]">
                {content.footer.developedBy[locale]}
              </span>

              <Image
                src={artechLogo}
                alt="Artech Software"
                className="h-auto w-24 object-contain opacity-80 transition duration-300 group-hover:-translate-y-1 group-hover:opacity-100"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
