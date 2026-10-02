"use client";

import {
  LOCATIONS,
  type LocationData,
  type LocationKey,
} from "@/features/contact/contactData";

type LocationPanelProps = {
  activeLocation: LocationKey;
  onChange: (location: LocationKey) => void;
};

export default function LocationPanel({
  activeLocation,
  onChange,
}: LocationPanelProps) {
  return (
    <aside
      className="
        flex
        min-w-0
        flex-col

        border-t
        border-black/[0.06]

        bg-[#EEEAE2]/95

        px-6
        py-8

        sm:px-9
        sm:py-10

        lg:h-full
        lg:border-l
        lg:border-t-0

        lg:px-[clamp(30px,3vw,54px)]
        lg:py-[clamp(34px,3vw,52px)]
      "
    >
      {/* TABS */}

      <div
        className="
          flex
          flex-wrap
          items-end

          gap-x-10
          gap-y-5

          border-b
          border-black/[0.07]

          pb-5
        "
        role="tablist"
        aria-label="Konumlar"
      >
        <LocationTab
          number="01"
          label="Merkez Ofis"
          active={activeLocation === "office"}
          onClick={() => onChange("office")}
        />

        <LocationTab
          number="02"
          label="Fabrika"
          active={activeLocation === "factory"}
          onClick={() => onChange("factory")}
        />
      </div>

      {/* CONTENT */}

      <div className="grid flex-1">
        <LocationContent
          data={LOCATIONS.office}
          active={activeLocation === "office"}
          offset="-translate-y-2"
        />

        <LocationContent
          data={LOCATIONS.factory}
          active={activeLocation === "factory"}
          offset="translate-y-2"
        />
      </div>
    </aside>
  );
}

function LocationTab({
  number,
  label,
  active,
  onClick,
}: {
  number: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`
        group

        cursor-pointer

        text-left

        outline-none

        transition-colors
        duration-700

        ${
          active
            ? "text-[#171A16]"
            : "text-black/28 hover:text-black/55"
        }
      `}
    >
      <span
        className={`
          mb-2
          block

          text-[7px]
          font-bold
          tracking-[0.18em]

          transition-all
          duration-700

          ${
            active
              ? "text-[#F07E02]"
              : "text-[#00973F]/35"
          }
        `}
      >
        {number}
      </span>

      <span
        className="
          relative

          inline-flex

          pb-3

          text-[14px]
          font-semibold
          tracking-[0.025em]

          lg:text-[15px]
        "
      >
        {label}

        <span
          className={`
            absolute
            bottom-0
            left-0

            h-px
            w-full

            origin-left

            bg-[#00973F]

            transition-transform
            duration-[950ms]
            ease-[cubic-bezier(0.16,1,0.3,1)]

            ${
              active
                ? "scale-x-100"
                : "scale-x-0"
            }
          `}
        />
      </span>
    </button>
  );
}

function LocationContent({
  data,
  active,
  offset,
}: {
  data: LocationData;
  active: boolean;
  offset: string;
}) {
  return (
    <div
      className={`
        col-start-1
        row-start-1

        flex
        min-w-0
        flex-col

        transition-[opacity,transform]
        duration-[1000ms]
        ease-[cubic-bezier(0.16,1,0.3,1)]

        ${
          active
            ? `
              pointer-events-auto
              translate-y-0
              opacity-100
            `
            : `
              pointer-events-none
              ${offset}
              opacity-0
            `
        }
      `}
      aria-hidden={!active}
    >
      {/* HEADER */}

      <div
        className="
          border-b
          border-black/[0.07]

          py-9

          lg:py-10
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-5
          "
        >
          <span
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.22em]

              text-[#00973F]/75
            "
          >
            Seçili konum
          </span>

          <span
            className="
              text-[9px]
              font-bold
              tracking-[0.15em]

              text-[#F07E02]/85
            "
          >
            {data.number}
          </span>
        </div>

        <h2
          className="
            mt-5

            text-[clamp(2.25rem,2.8vw,3.5rem)]
            font-medium

            leading-[0.98]
            tracking-[-0.05em]

            text-[#171A16]
          "
        >
          {data.title}
        </h2>

        <p
          className="
            mt-3

            text-[9px]
            font-medium
            uppercase
            tracking-[0.15em]

            text-black/30
          "
        >
          {data.subtitle}
        </p>
      </div>

      {/* DETAILS */}

      <InformationItem
        label="Adres"
        value={data.address}
      />

      <InformationItem
        label="Telefon"
        value={data.phone}
        href={`tel:${data.phone.replace(/[^\d+]/g, "")}`}
      />

      <InformationItem
        label="WhatsApp"
        value={data.whatsapp}
        href={`https://wa.me/${data.whatsapp.replace(/\D/g, "")}`}
        external
      />

      <InformationItem
        label="E-posta"
        value={data.email}
        href={`mailto:${data.email}`}
      />

      {/* COORDINATES */}

      <div
        className="
          mt-auto

          flex
          items-center
          gap-3

          border-t
          border-black/[0.07]

          pt-5
        "
      >
        <span
          className="
            h-[5px]
            w-[5px]

            rounded-full

            bg-[#F07E02]
          "
        />

        <span
          className="
            text-[8px]
            font-semibold
            tracking-[0.16em]

            text-black/32
          "
        >
          {data.coordinates}
        </span>
      </div>
    </div>
  );
}

function InformationItem({
  label,
  value,
  href,
  external = false,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <div
        className="
          flex
          items-center
          justify-between
          gap-5
        "
      >
        <span
          className="
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.22em]

            text-[#00973F]/55
          "
        >
          {label}
        </span>

        {href && (
          <span
            className="
              text-[#F07E02]/50

              transition-all
              duration-500

              group-hover:-translate-y-[2px]
              group-hover:translate-x-[2px]
              group-hover:text-[#F07E02]
            "
          >
            ↗
          </span>
        )}
      </div>

      <span
        className="
          mt-3
          block

          break-words

          text-[14px]
          font-medium
          leading-[1.65]

          text-black/58

          transition-colors
          duration-500

          group-hover:text-[#00973F]

          sm:text-[15px]
        "
      >
        {value}
      </span>
    </>
  );

  const className = `
    group
    block

    border-b
    border-black/[0.07]

    py-6

    lg:py-7
  `;

  if (!href) {
    return (
      <div className={className}>
        {content}
      </div>
    );
  }

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={`${className} cursor-pointer`}
    >
      {content}
    </a>
  );
}