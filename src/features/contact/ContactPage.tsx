"use client";

import Link from "next/link";
import { Fragment, useRef, useState, type FormEvent, type ReactNode } from "react";

import dynamic from "next/dynamic";

import {
  FaArrowDown,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaLocationDot,
  FaPhone,
} from "react-icons/fa6";

import { plainText, type HomeSection, type RichText } from "@/features/home/content/model";
import { useHomeLocale } from "@/features/home/content/LocaleProvider";

/* ========================================================= */
/* TYPES */
/* ========================================================= */

type LocationKey = "office" | "factory";

const contactDirections = {
  office: {
    google: "https://www.google.com/maps/place/37%C2%B052'30.1%22N+32%C2%B032'43.5%22E/@37.875032,32.5428364,17z",
    yandex: "https://yandex.com.tr/maps/org/toprak_tarim/42840479341/?ll=32.545235%2C37.875238&z=17.06",
    apple: "https://maps.apple.com/?ll=37.875197,32.545365&q=Toprak%20Tar%C4%B1m",
  },
  factory: {
    google: "https://www.google.com/maps/place/Toprak+Tar%C4%B1m+Flake/@37.8738589,32.611566,17z",
    yandex: "https://yandex.com.tr/maps/101474/konya/?ll=32.614735%2C37.872541&z=17.45",
    apple: "https://maps.apple.com/?ll=37.873855,32.614146&q=Toprak%20Tar%C4%B1m%20Flake",
  },
} satisfies Record<LocationKey, Record<"google" | "yandex" | "apple", string>>;

/* ========================================================= */
/* MAP */
/* ========================================================= */

const ContactMap = dynamic<{ activeLocation: LocationKey; labels: Record<LocationKey, string>; resetLabel: string }>(
  () => import("./components/ContactMap"),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#0c0d0e]" />,
  },
);

function Runs({ runs }: { runs: RichText }) {
  return runs.map((run, index) => {
    const style = { fontWeight: run.bold === undefined ? undefined : run.bold ? 700 : 400, fontStyle: run.italic === undefined ? undefined : run.italic ? "italic" : "normal", color: run.color };
    return run.bold === undefined && run.italic === undefined && !run.color ? <Fragment key={index}>{run.text}</Fragment> : <span key={index} style={style}>{run.text}</span>;
  });
}

/* ========================================================= */
/* PAGE */
/* ========================================================= */

export default function ContactPage({ content }: { content: HomeSection }) {
  const { locale } = useHomeLocale();
  const runs = (field: string) => content.content[locale][field];
  const text = (field: string) => plainText(runs(field));
  const [activeLocation, setActiveLocation] = useState<LocationKey>("office");

  const formSectionRef = useRef<HTMLElement | null>(null);

  const contactLocations = {
    office: { label: text("office_label"), address: text("office_address"), phone: text("office_phone"), email: text("office_email"), directions: contactDirections.office },
    factory: { label: text("factory_label"), address: text("factory_address"), phone: text("factory_phone"), email: text("factory_email"), directions: contactDirections.factory },
  };
  const activeContact = contactLocations[activeLocation];
  const [kvkkAccepted, setKvkkAccepted] = useState(false);

  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitState === "submitting") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setSubmitState("submitting");
    setSubmitMessage(text("sending_message"));
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          surname: data.get("surname"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          kvkk: data.get("kvkk") === "on",
          website: data.get("website"),
        }),
      });
      await response.json().catch(() => null);
      if (!response.ok) throw new Error(text("send_error"));
      setSubmitState("success");
      setSubmitMessage(text("success_message"));
      form.reset();
      setKvkkAccepted(false);
    } catch (error) {
      setSubmitState("error");
      setSubmitMessage(error instanceof Error && error.message ? error.message : text("send_error"));
    }
  };

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main lang={locale} className="bg-[#0c0d0e] text-white">
      {/* =================================================== */}
      {/* CONTACT / MAP HERO */}
      {/* =================================================== */}

      <section
        className="
          relative
          min-h-[100svh]
          min-h-[100dvh]
          overflow-hidden
          bg-[#0c0d0e]
        "
      >
        {/* ================================================= */}
        {/* MAP */}
        {/* ================================================= */}

        <div
          className="
            absolute
            right-0
            top-0
            z-0
            h-full
            w-full
            lg:w-[72%]
          "
        >
          <ContactMap
            activeLocation={activeLocation}
            labels={{ office: text("office_label"), factory: text("factory_label") }}
            resetLabel={text("map_reset_label")}
          />
        </div>

        {/* ================================================= */}
        {/* MAP DARKNESS */}
        {/* ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[1]
            bg-black/10
          "
        />

        {/* ================================================= */}
        {/* LEFT TO RIGHT GRADIENT */}
        {/* ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[1]
            bg-[linear-gradient(180deg,rgba(12,13,14,0.74)_0%,rgba(12,13,14,0.62)_38%,rgba(12,13,14,0.78)_72%,rgba(12,13,14,0.94)_100%)]
            lg:bg-[linear-gradient(90deg,#0c0d0e_0%,#0c0d0e_19%,rgba(12,13,14,0.99)_29%,rgba(12,13,14,0.94)_40%,rgba(12,13,14,0.72)_54%,rgba(12,13,14,0.38)_69%,rgba(12,13,14,0.13)_84%,rgba(12,13,14,0.05)_100%)]
          "
        />

        {/* ================================================= */}
        {/* TOP / BOTTOM VIGNETTE */}
        {/* ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[1]
            bg-[linear-gradient(180deg,rgba(0,0,0,0.24)_0%,transparent_24%,transparent_68%,rgba(0,0,0,0.52)_100%)]
          "
        />

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <div
          className="
            pointer-events-none
            relative
            z-10
            mx-auto
            flex
            min-h-[100svh]
            min-h-[100dvh]
            w-full
            max-w-[1600px]
            flex-col
            px-5
            pb-10
            pt-28
            sm:px-8
            sm:pt-32
            md:px-10
            md:pt-36
            lg:px-[7.5vw]
            lg:pb-10
            lg:pt-[21vh]
          "
        >
          <section className="w-full max-w-[930px]">
            {/* ============================================= */}
            {/* TITLE */}
            {/* ============================================= */}

            <div className="flex items-stretch gap-5">
              <div className="w-[5px] shrink-0 bg-[#F07D00]" />

              <div className="py-[1px]">
                <p
                  className="
                    mb-2
                    text-[12px]
                    font-normal
                    tracking-[0.24em]
                    text-white/70
                    sm:text-[13px]
                  "
                >
                  <Runs runs={runs("hero_eyebrow")} />
                </p>

                <h1
                  className="
                    text-[42px]
                    font-light
                    leading-[0.98]
                    tracking-[0.075em]
                    text-white
                    sm:text-[52px]
                    lg:text-[58px]
                  "
                >
                  <Runs runs={runs("hero_title")} />
                </h1>
              </div>
            </div>

            {/* ============================================= */}
            {/* LOCATION SELECTOR */}
            {/* ============================================= */}

            <div
              className="
                pointer-events-auto
                mt-10
                flex
                w-fit
                items-center
                gap-5
                sm:gap-6
                lg:mt-[60px]
              "
            >
              <LocationButton
                label={<Runs runs={runs("office_label")} />}
                active={activeLocation === "office"}
                onClick={() => setActiveLocation("office")}
              />

              <span
                className="
                  select-none
                  text-[16px]
                  font-light
                  text-white/20
                "
              >
                |
              </span>

              <LocationButton
                label={<Runs runs={runs("factory_label")} />}
                active={activeLocation === "factory"}
                onClick={() => setActiveLocation("factory")}
              />
            </div>

            {/* ============================================= */}
            {/* CONTACT INFORMATION */}
            {/* ============================================= */}

            <div
              className="
                mt-12
                grid
                max-w-[880px]
                grid-cols-1
                gap-8
                sm:mt-14
                sm:grid-cols-2
                sm:gap-9
                md:grid-cols-3
                lg:mt-[110px]
                lg:gap-10
              "
            >
              <ContactItem
                icon={<FaLocationDot />}
                title={<Runs runs={runs("address_label")} />}
                value={<Runs runs={runs(`${activeLocation}_address`)} />}
              />

              <ContactItem
                icon={<FaPhone />}
                title={<Runs runs={runs("phone_label")} />}
                value={<Runs runs={runs(`${activeLocation}_phone`)} />}
                href={`tel:${activeContact.phone.replace(/[^\d+]/g, "")}`}
              />

              <ContactItem
                icon={<FaEnvelope />}
                title={<Runs runs={runs("email_label")} />}
                value={<Runs runs={runs(`${activeLocation}_email`)} />}
                href={`mailto:${activeContact.email}`}
              />
            </div>

            {/* ============================================= */}
            {/* FORM CTA */}
            {/* ============================================= */}

            <div className="pointer-events-auto mt-12 max-w-[880px] sm:mt-14 lg:mt-[62px]">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:gap-12">
                <div className="shrink-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.19em] text-white/35">
                    <Runs runs={runs("directions_label")} />
                  </p>
                  <p className="mt-2 text-[13px] font-normal text-white/55">
                    {activeContact.label}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-5 sm:gap-x-10">
                  <DirectionButton label="Google Maps" href={activeContact.directions.google} />
                  <DirectionButton label="Yandex Maps" href={activeContact.directions.yandex} />
                  <DirectionButton label="Apple Maps" href={activeContact.directions.apple} />
                </div>
              </div>
            </div>

            <div
              className="
                pointer-events-auto
                mt-12
                sm:mt-14
                lg:mt-[70px]
              "
            >
              <button
                type="button"
                onClick={scrollToForm}
                className="
                  group
                  flex
                  w-full
                  cursor-pointer
                  items-center
                  justify-between
                  gap-5
                  border
                  sm:w-auto
                  sm:justify-start
                  border-white/[0.14]
                  bg-black/20
                  px-6
                  py-[15px]
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.17em]
                  text-white/75
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:border-[#F07D00]/60
                  hover:bg-[#F07D00]
                  hover:text-white
                "
              >
                <span><Runs runs={runs("form_cta")} /></span>

                <FaArrowDown
                  className="
                    text-[10px]
                    transition-transform
                    duration-300
                    group-hover:translate-y-[3px]
                  "
                />
              </button>
            </div>
          </section>

          {/* =============================================== */}
          {/* BOTTOM AREA */}
          {/* =============================================== */}

          <div
            className="
              mt-auto
              flex
              items-end
              justify-end
              pt-10
            "
          >
            <div
              className="
                pointer-events-auto
                hidden
                items-center
                gap-11
                lg:flex
              "
            >
              <SocialLink label={text("facebook_label")} href="https://www.facebook.com/" icon={<FaFacebookF />} />
              <SocialLink label={text("instagram_label")} href="https://www.instagram.com/" icon={<FaInstagram />} />
              <SocialLink label="LinkedIn" href="https://www.linkedin.com/" icon={<FaLinkedinIn />} />
            </div>
          </div>
        </div>
      </section>

      {/* =================================================== */}
      {/* CONTACT FORM */}
      {/* =================================================== */}

      <section
        ref={formSectionRef}
        className="
          relative
          scroll-mt-0
          overflow-hidden
          bg-white
          text-[#101312]
        "
      >
        {/* ================================================= */}
        {/* BACKGROUND DETAILS */}
        {/* ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            right-[-150px]
            top-[-250px]
            h-[700px]
            w-[700px]
            rounded-full
            bg-[#1D6847]/[0.035]
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            bottom-[-250px]
            left-[-200px]
            h-[650px]
            w-[650px]
            rounded-full
            bg-[#F07D00]/[0.035]
            blur-3xl
          "
        />

        <div
          className="
            relative
            mx-auto
            grid
            w-full
            max-w-[1600px]
            grid-cols-1
            gap-14
            px-6
            py-20
            sm:px-8
            sm:py-24
            md:px-10
            md:py-28
            lg:grid-cols-[0.72fr_1.28fr]
            lg:gap-24
            lg:px-[7.5vw]
            lg:py-32
          "
        >
          {/* =============================================== */}
          {/* FORM INTRO */}
          {/* =============================================== */}

          <div>
            <div className="flex items-center gap-4">
              <span className="h-[13px] w-[3px] bg-[#F07D00]" />

              <p
                className="
                  text-[13px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-[#1D6847]
                "
              >
                <Runs runs={runs("form_eyebrow")} />
              </p>
            </div>

            <h2
              className="
                mt-8
                max-w-[520px]
                text-[38px]
                font-light
                leading-[1.12]
                tracking-[-0.025em]
                text-[#101312]
                sm:text-[46px]
                lg:text-[52px]
              "
            >
              <Runs runs={runs("form_title_line_1")} />
              <span className="block text-black/35"><Runs runs={runs("form_title_line_2")} /></span>
            </h2>

            <p
              className="
                mt-8
                max-w-[440px]
                text-[15px]
                leading-[1.85]
                text-black/50
              "
            >
              <Runs runs={runs("form_description")} />
            </p>

            <div
              className="
                mt-10
                h-[1px]
                w-16
                bg-[#F07D00]
              "
            />
          </div>

          {/* =============================================== */}
          {/* FORM */}
          {/* =============================================== */}

          <form onSubmit={handleSubmit} className="w-full">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0" />
            <div
              className="
                grid
                grid-cols-1
                gap-x-10
                gap-y-11
                sm:grid-cols-2
              "
            >
              <FormField label={<Runs runs={runs("name_label")} />}>
                <input
                  type="text"
                  name="name"
                  autoComplete="given-name"
                  required
                  placeholder={text("name_placeholder")}
                  className={inputClassName}
                />
              </FormField>

              <FormField label={<Runs runs={runs("surname_label")} />}>
                <input
                  type="text"
                  name="surname"
                  autoComplete="family-name"
                  required
                  placeholder={text("surname_placeholder")}
                  className={inputClassName}
                />
              </FormField>

              <FormField label={<Runs runs={runs("form_email_label")} />}>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder={text("email_placeholder")}
                  className={inputClassName}
                />
              </FormField>

              <FormField label={<Runs runs={runs("subject_label")} />}>
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder={text("subject_placeholder")}
                  className={inputClassName}
                />
              </FormField>

              <div className="sm:col-span-2">
                <FormField label={<Runs runs={runs("message_label")} />}>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    placeholder={text("message_placeholder")}
                    className={`
                      ${inputClassName}
                      min-h-[180px]
                      resize-none
                    `}
                  />
                </FormField>
              </div>
            </div>

            {/* ============================================= */}
            {/* KVKK / SUBMIT */}
            {/* ============================================= */}

            <div
              className="
                mt-12
                flex
                flex-col
                gap-9
                border-t
                border-black/[0.1]
                pt-9
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              <div
                className="
                  flex
                  flex-1
                  max-w-[560px]
                  cursor-pointer
                  items-start
                  gap-4
                "
              >
                <input
                  id="kvkk"
                  type="checkbox"
                  name="kvkk"
                  required
                  checked={kvkkAccepted}
                  onChange={(event) => setKvkkAccepted(event.target.checked)}
                  className="
                    mt-[3px]
                    h-[17px]
                    w-[17px]
                    shrink-0
                    cursor-pointer
                    accent-[#1D6847]
                  "
                />

                {!kvkkAccepted ? (
                  <label
                    htmlFor="kvkk"
                    className="cursor-pointer text-[13px] leading-[1.7] text-black/50 transition-colors duration-300 hover:text-black/70"
                  >
                    <Runs runs={runs("kvkk_consent")} />
                  </label>
                ) : (
                  <Link
                    href="/kvkk"
                    className="group/kvkk inline-flex items-center gap-2 text-[13px] font-medium leading-[1.7] text-[#1D6847] transition-colors hover:text-[#F07D00]"
                  >
                    <Runs runs={runs("kvkk_link_label")} />
                    <span className="inline-block text-[12px] transition-transform duration-300 group-hover/kvkk:translate-x-[2px]" aria-hidden="true">↗</span>
                  </Link>
                )}
              </div>

              <button
                type="submit"
                disabled={!kvkkAccepted || submitState === "submitting"}
                aria-disabled={!kvkkAccepted || submitState === "submitting"}
                className={`group relative inline-flex w-full max-w-full items-center justify-between overflow-visible border-0 bg-transparent pb-4 transition-colors duration-300 sm:w-[300px] ${
                  kvkkAccepted && submitState !== "submitting"
                    ? "cursor-pointer text-[#101312]"
                    : "cursor-not-allowed text-black/25"
                }`}
              >
                <span className="relative block h-[20px] flex-1 overflow-hidden text-left">
                  <span className={`absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.17em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    kvkkAccepted && submitState !== "submitting"
                      ? "group-hover:-translate-x-6 group-hover:-translate-y-1/2 group-hover:opacity-0"
                      : ""
                  }`}>
                    {submitState === "submitting" ? <Runs runs={runs("submitting_label")} /> : <Runs runs={runs("submit_label")} />}
                  </span>

                  {kvkkAccepted && submitState !== "submitting" && (
                    <span className="absolute left-0 top-1/2 translate-x-7 -translate-y-1/2 whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.15em] text-[#1D6847] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:-translate-y-1/2 group-hover:opacity-100">
                      <Runs runs={runs("submit_label")} />
                    </span>
                  )}
                </span>

                <span className={`ml-8 flex h-6 w-6 shrink-0 items-center justify-center transition-colors duration-500 ${
                  kvkkAccepted && submitState !== "submitting" ? "group-hover:text-[#1D6847]" : "text-black/20"
                }`}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`h-[18px] w-[18px] -rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      kvkkAccepted && submitState !== "submitting" ? "group-hover:rotate-0 group-hover:translate-x-[3px]" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M14 7L19 12L14 17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>

                <span className={`absolute bottom-0 left-0 h-px w-full origin-left bg-[#1D6847] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  kvkkAccepted && submitState !== "submitting" ? "scale-x-0 group-hover:scale-x-100" : "scale-x-100 bg-black/10"
                }`} />
              </button>
            </div>
            <p
              aria-live="polite"
              className={`mt-5 min-h-6 text-[13px] ${submitState === "success" ? "text-[#1D6847]" : submitState === "error" ? "text-red-600" : "text-black/50"}`}
            >
              {submitMessage}
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

/* ========================================================= */
/* INPUT STYLE */
/* ========================================================= */

const inputClassName = `
  w-full
  border-0
  border-b
  border-black/[0.16]
  bg-transparent
  py-[17px]
  text-[15px]
  font-normal
  text-[#101312]
  outline-none
  transition-colors
  duration-300
  placeholder:text-black/30
  hover:border-black/35
  focus:border-[#1D6847]
`;

/* ========================================================= */
/* LOCATION BUTTON */
/* ========================================================= */

function LocationButton({
  label,
  active,
  onClick,
}: {
  label: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`
        group
        relative
        cursor-pointer
        pb-[9px]
        text-[15px]
        font-medium
        uppercase
        tracking-[0.13em]
        transition-colors
        duration-300
        sm:text-[16px]
        ${active ? "text-white" : "text-white/35 hover:text-white/75"}
      `}
    >
      {label}

      <span
        className={`
          absolute
          bottom-0
          left-0
          h-[2px]
          bg-[#F07D00]
          transition-all
          duration-500
          ease-out
          ${
            active
              ? "w-full opacity-100"
              : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50"
          }
        `}
      />
    </button>
  );
}

function DirectionButton({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/direction relative inline-flex cursor-pointer items-center gap-3 pb-[9px] text-[13px] font-medium tracking-[0.025em] text-white/70 transition-colors duration-300 hover:text-white sm:text-[14px]"
    >
      <span>{label}</span>
      <span
        className="inline-block text-[11px] text-[#F07D00] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/direction:translate-x-[3px] group-hover/direction:-translate-y-[3px]"
        aria-hidden="true"
      >
        ↗
      </span>
      <span className="absolute bottom-0 left-0 h-px w-full bg-white/20" />
      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#F07D00] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/direction:scale-x-100" />
    </a>
  );
}

/* ========================================================= */
/* FORM FIELD */
/* ========================================================= */

function FormField({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span
        className="
          mb-2
          block
          text-[12px]
          font-medium
          uppercase
          tracking-[0.16em]
          text-[#1D6847]
        "
      >
        {label}
      </span>

      {children}
    </label>
  );
}

/* ========================================================= */
/* CONTACT ITEM */
/* ========================================================= */

function ContactItem({
  icon,
  title,
  value,
  href,
}: {
  icon: ReactNode;
  title: ReactNode;
  value: ReactNode;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex items-center gap-[12px]">
        <span
          className="
            flex
            h-[20px]
            w-[20px]
            items-center
            justify-center
            text-[16px]
            text-[#F07D00]
          "
        >
          {icon}
        </span>

        <span
          className="
            text-[16px]
            font-medium
            tracking-[0.01em]
            text-white
          "
        >
          {title}
        </span>
      </div>

      <p
        className="
          mt-[19px]
          max-w-[32rem]
          text-[14px]
          sm:text-[15px]
          leading-[1.65]
          text-white/50
          md:max-w-[245px]
          transition-colors
          duration-300
          group-hover:text-white/80
        "
      >
        {value}
      </p>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="
          group
          pointer-events-auto
          block
          w-fit
          cursor-pointer
        "
      >
        {content}
      </a>
    );
  }

  return <div className="group">{content}</div>;
}

/* ========================================================= */
/* SOCIAL LINK */
/* ========================================================= */

function SocialLink({ label, href, icon }: { label: string; href: string; icon: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group
        flex
        cursor-pointer
        items-center
        gap-[12px]
        text-[14px]
        font-normal
        tracking-[0.03em]
        text-white/55
        transition-colors
        duration-300
        hover:text-white
      "
    >
      <span
        className="
          text-[17px]
          text-[#F07D00]
          transition-transform
          duration-300
          group-hover:-translate-y-[2px]
        "
      >
        {icon}
      </span>

      {label}
    </a>
  );
}
