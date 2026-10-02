"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiChevronDown,
  FiExternalLink,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
} from "react-icons/fi";

import type { Map as MapLibreMap, Marker as MapLibreMarker } from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

/* ==========================================================================
   TYPES
============================================================================ */

type FormValues = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  kvkk: boolean;
};

type ContactFormProps = {
  phone?: string;
  email?: string;
  address?: string;
  onSubmit?: (values: FormValues) => void | Promise<void>;
};

/* ==========================================================================
   LOCATION
============================================================================ */

const COMPANY_LOCATION = {
  lat: 37.8750381,
  lng: 32.5454216,
};

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/37%C2%B052'30.1%22N+32%C2%B032'43.5%22E/@37.8750381,32.5428467,17z/data=!3m1!4b1!4m4!3m3!8m2!3d37.8750381!4d32.5454216?hl=tr";

/*
 * OpenFreeMap
 *
 * API KEY YOK.
 * BILLING YOK.
 * GOOGLE MAPS YOK.
 */
const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/dark";

/* ==========================================================================
   MAP PALETTE
============================================================================ */

/*
 * Burası CSS filtresi değildir.
 *
 * MapLibre'ın gerçek vector layer'ları:
 *
 * - road
 * - highway
 * - building
 * - landuse
 * - water
 * - labels
 * - boundaries
 *
 * doğrudan yeniden renklendiriliyor.
 */

function applyDarkMapPalette(map: MapLibreMap) {
  const style = map.getStyle();

  if (!style.layers) return;

  style.layers.forEach((layer) => {
    const id = layer.id.toLowerCase();

    try {
      /* ====================================================================
         BACKGROUND
      ==================================================================== */

      if (layer.type === "background") {
        map.setPaintProperty(layer.id, "background-color", "#101211");

        return;
      }

      /* ====================================================================
         FILLS
      ==================================================================== */

      if (layer.type === "fill") {
        let fillColor = "#121413";
        let outlineColor = "#171a18";

        /*
         * WATER
         */

        if (
          id.includes("water") ||
          id.includes("ocean") ||
          id.includes("lake")
        ) {
          fillColor = "#090b0a";
          outlineColor = "#0d0f0e";
        } else if (id.includes("building") || id.includes("construction")) {

        /*
         * BUILDINGS
         */
          fillColor = "#151716";
          outlineColor = "#1a1c1b";
        } else if (

        /*
         * PARK / GRASS
         */
          id.includes("park") ||
          id.includes("grass") ||
          id.includes("wood") ||
          id.includes("forest") ||
          id.includes("green")
        ) {
          fillColor = "#111512";
          outlineColor = "#141814";
        } else if (id.includes("industrial") || id.includes("commercial")) {

        /*
         * INDUSTRIAL
         */
          fillColor = "#151715";
          outlineColor = "#191b19";
        } else if (id.includes("residential") || id.includes("landuse")) {

        /*
         * RESIDENTIAL
         */
          fillColor = "#131513";
          outlineColor = "#171917";
        }

        map.setPaintProperty(layer.id, "fill-color", fillColor);

        map.setPaintProperty(layer.id, "fill-outline-color", outlineColor);

        /*
         * Fill opacity'yi yüksek tutuyoruz.
         * Harita filtreden değil kendi renginden koyu.
         */

        map.setPaintProperty(layer.id, "fill-opacity", 1);

        return;
      }

      /* ====================================================================
         LINES
      ==================================================================== */

      if (layer.type === "line") {
        let lineColor = "#1b1e1c";
        let opacity = 0.8;

        /*
         * MOTORWAY / HIGHWAY
         */

        if (
          id.includes("motorway") ||
          id.includes("highway") ||
          id.includes("trunk")
        ) {
          lineColor = "#3a3d3b";
          opacity = 1;
        } else if (id.includes("primary") || id.includes("major")) {

        /*
         * PRIMARY
         */
          lineColor = "#323532";
          opacity = 1;
        } else if (id.includes("secondary")) {

        /*
         * SECONDARY
         */
          lineColor = "#2c2f2d";
          opacity = 1;
        } else if (id.includes("tertiary")) {

        /*
         * TERTIARY
         */
          lineColor = "#282b29";
          opacity = 0.95;
        } else if (

        /*
         * STREETS / ROADS
         */
          id.includes("road") ||
          id.includes("street") ||
          id.includes("minor") ||
          id.includes("service")
        ) {
          lineColor = "#232624";
          opacity = 0.92;
        } else if (id.includes("boundary") || id.includes("admin")) {

        /*
         * BOUNDARIES
         */
          lineColor = "#252825";
          opacity = 0.5;
        } else if (

        /*
         * WATERWAY
         */
          id.includes("water") ||
          id.includes("river") ||
          id.includes("stream")
        ) {
          lineColor = "#0c0f0d";
          opacity = 1;
        } else if (id.includes("rail") || id.includes("transit")) {

        /*
         * RAILWAY
         */
          lineColor = "#1d201e";
          opacity = 0.5;
        }

        map.setPaintProperty(layer.id, "line-color", lineColor);

        map.setPaintProperty(layer.id, "line-opacity", opacity);

        return;
      }

      /* ====================================================================
         SYMBOLS / TEXT
      ==================================================================== */

      if (layer.type === "symbol") {
        /*
         * Gereksiz POI'leri kapat.
         *
         * Referans tasarımdaki gibi harita temiz kalıyor.
         */

        const shouldHide =
          id.includes("poi") ||
          id.includes("housenumber") ||
          id.includes("shop") ||
          id.includes("airport") ||
          id.includes("station") ||
          id.includes("transit") ||
          id.includes("bus") ||
          id.includes("railway") ||
          id.includes("hospital");

        if (shouldHide) {
          map.setLayoutProperty(layer.id, "visibility", "none");

          return;
        }

        /*
         * Genel yazılar
         */

        let textColor = "#3d403e";

        /*
         * Şehir isimleri
         */

        if (
          id.includes("city") ||
          id.includes("place") ||
          id.includes("town")
        ) {
          textColor = "#515552";
        }

        /*
         * Yol isimleri
         */

        if (id.includes("road") || id.includes("street")) {
          textColor = "#444845";
        }

        /*
         * Country / state
         */

        if (id.includes("country") || id.includes("state")) {
          textColor = "#555956";
        }

        map.setPaintProperty(layer.id, "text-color", textColor);

        map.setPaintProperty(layer.id, "text-halo-color", "#101211");

        map.setPaintProperty(layer.id, "text-halo-width", 1.2);

        /*
         * OpenStreetMap'ın hazır ikonlarını göstermiyoruz.
         */

        map.setPaintProperty(layer.id, "icon-opacity", 0);

        return;
      }

      /* ====================================================================
         FILL EXTRUSIONS
      ==================================================================== */

      if (layer.type === "fill-extrusion") {
        map.setPaintProperty(layer.id, "fill-extrusion-color", "#161817");

        map.setPaintProperty(layer.id, "fill-extrusion-opacity", 0.55);
      }
    } catch {
      /*
       * Bazı hazır style layer'larında ilgili paint
       * property'si bulunmayabilir.
       *
       * O layer'ı olduğu gibi bırakıyoruz.
       */
    }
  });
}

/* ==========================================================================
   FORM CONSTANTS
============================================================================ */

const SUBJECTS = [
  "Genel Bilgi",
  "Ürünler",
  "Satış",
  "Teknik Destek",
  "Bayilik / İş Birliği",
  "Diğer",
];

const initialValues: FormValues = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  kvkk: false,
};

const steps = [
  {
    number: "01",
    helper: "Adınızı ve soyadınızı girin",
  },
  {
    number: "02",
    helper: "E-posta adresinizi girin",
  },
  {
    number: "03",
    helper: "Telefon numaranızı girin",
  },
  {
    number: "04",
    helper: "Görüşmek istediğiniz konuyu seçin",
  },
  {
    number: "05",
    helper: "Size nasıl yardımcı olabileceğimizi anlatın",
  },
];

/* ==========================================================================
   CONTACT MAP
============================================================================ */

function ContactMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  const mapRef = useRef<MapLibreMap | null>(null);

  const markerRef = useRef<MapLibreMarker | null>(null);

  const [mapReady, setMapReady] = useState(false);

  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    let resizeHandler: (() => void) | undefined;

    const initMap = async () => {
      try {
        /*
         * Dynamic import:
         * Next.js SSR sırasında window problemi yaşamıyoruz.
         */

        const maplibregl = await import("maplibre-gl");

        if (!mounted || !containerRef.current) {
          return;
        }

        /*
         * Masaüstünde marker'ın sağ tarafta durması için
         * harita merkezini biraz batıya kaydırıyoruz.
         */

        const desktop = window.innerWidth >= 1024;

        const initialCenter: [number, number] = desktop
          ? [COMPANY_LOCATION.lng - 0.007, COMPANY_LOCATION.lat]
          : [COMPANY_LOCATION.lng, COMPANY_LOCATION.lat];

        const map = new maplibregl.Map({
          container: containerRef.current,

          style: MAP_STYLE_URL,

          center: initialCenter,

          zoom: desktop ? 15.7 : 14.8,

          pitch: 0,

          bearing: 0,

          /*
           * Form arka planı olduğu için kullanıcı
           * yanlışlıkla haritayı sürüklemesin.
           */
          interactive: false,

          /*
           * Dünya kopyalarının tekrar etmesini engelle.
           */
          renderWorldCopies: false,

          /*
           * Attribution görünür kalıyor.
           */
          attributionControl: {},

          /*
           * Arka plan.
           */
          canvasContextAttributes: {
            antialias: true,
          },
        });

        mapRef.current = map;

        /*
         * Tile veya network hatası.
         */

        let hasLoaded = false;

        map.on("error", () => {
          if (!hasLoaded && mounted) {
            setMapError(true);
          }
        });

        map.on("load", () => {
          if (!mounted) return;

          hasLoaded = true;

          /*
           * Hazır Dark style üzerine kendi renk
           * sistemimizi uyguluyoruz.
           */

          applyDarkMapPalette(map);

          /* ============================================================
             CUSTOM MARKER
          ============================================================ */

          const markerElement = document.createElement("div");

          markerElement.className = "company-location-marker";

          markerElement.innerHTML = `
            <div class="company-location-marker__outer"></div>

            <div class="company-location-marker__middle"></div>

            <div class="company-location-marker__pulse"></div>

            <div class="company-location-marker__dot">
              <div class="company-location-marker__dot-inner"></div>
            </div>
          `;

          const marker = new maplibregl.Marker({
            element: markerElement,
            anchor: "center",
          })
            .setLngLat([COMPANY_LOCATION.lng, COMPANY_LOCATION.lat])
            .addTo(map);

          markerRef.current = marker;

          setMapReady(true);
          setMapError(false);
        });

        /* ================================================================
           RESPONSIVE POSITION
        ================================================================= */

        resizeHandler = () => {
          if (!mapRef.current) return;

          const isDesktop = window.innerWidth >= 1024;

          map.resize();

          map.jumpTo({
            center: isDesktop
              ? [COMPANY_LOCATION.lng - 0.007, COMPANY_LOCATION.lat]
              : [COMPANY_LOCATION.lng, COMPANY_LOCATION.lat],

            zoom: isDesktop ? 15.7 : 14.8,
          });
        };

        window.addEventListener("resize", resizeHandler);
      } catch (error) {
        console.error("MapLibre map error:", error);

        if (mounted) {
          setMapError(true);
        }
      }
    };

    initMap();

    return () => {
      mounted = false;

      if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
      }

      markerRef.current?.remove();

      markerRef.current = null;

      mapRef.current?.remove();

      mapRef.current = null;
    };
  }, []);

  return (
    <>
      {/* ================================================================
          MAP
      ================================================================= */}

      <div
        ref={containerRef}
        className="
          absolute
          inset-0
          h-full
          w-full
          bg-[#101211]
        "
      />

      {/* ================================================================
          LOADING
      ================================================================= */}

      {!mapReady && !mapError && (
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-10
            flex
            items-center
            justify-center
            bg-[#101211]
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              text-[9px]
              uppercase
              tracking-[0.2em]
              text-white/30
            "
          >
            <span
              className="
                h-3
                w-3
                animate-spin
                rounded-full
                border
                border-white/15
                border-t-white/60
              "
            />
            Harita yükleniyor
          </div>
        </div>
      )}

      {/* ================================================================
          ERROR
      ================================================================= */}

      {mapError && (
        <div
          className="
            absolute
            inset-0
            z-10
            flex
            items-center
            justify-center
            bg-[#101211]
          "
        >
          <p
            className="
              text-[10px]
              text-white/30
            "
          >
            Harita yüklenemedi.
          </p>
        </div>
      )}

      {/* ================================================================
          CUSTOM MARKER CSS
      ================================================================= */}

      <style jsx global>{`
        /* --------------------------------------------------------------
           MAPLIBRE
        -------------------------------------------------------------- */

        .maplibregl-map {
          font-family: inherit;
        }

        .maplibregl-canvas {
          outline: none;
        }

        /*
         * Attribution'ı tasarımın içine biraz daha
         * doğal şekilde yediriyoruz.
         */

        .maplibregl-ctrl-attrib {
          background: rgba(16, 18, 17, 0.66) !important;

          color: rgba(255, 255, 255, 0.35) !important;

          font-size: 8px !important;

          backdrop-filter: blur(8px);
        }

        .maplibregl-ctrl-attrib a {
          color: rgba(255, 255, 255, 0.45) !important;
        }

        /* --------------------------------------------------------------
           COMPANY MARKER
        -------------------------------------------------------------- */

        .company-location-marker {
          position: relative;

          width: 116px;
          height: 116px;

          pointer-events: none;
        }

        .company-location-marker__outer,
        .company-location-marker__middle,
        .company-location-marker__pulse,
        .company-location-marker__dot {
          position: absolute;

          left: 50%;
          top: 50%;

          transform: translate(-50%, -50%);

          border-radius: 999px;
        }

        /*
         * Büyük dış halka
         */

        .company-location-marker__outer {
          width: 116px;
          height: 116px;

          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        /*
         * Orta halka
         */

        .company-location-marker__middle {
          width: 68px;
          height: 68px;

          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        /*
         * Pulse
         */

        .company-location-marker__pulse {
          width: 24px;
          height: 24px;

          border: 1px solid rgba(255, 255, 255, 0.25);

          animation: companyMapPulse 2.6s ease-out infinite;
        }

        /*
         * Marker point
         */

        .company-location-marker__dot {
          display: flex;

          width: 11px;
          height: 11px;

          align-items: center;
          justify-content: center;

          background: #ffffff;

          box-shadow:
            0 0 0 5px rgba(255, 255, 255, 0.045),
            0 0 22px rgba(255, 255, 255, 0.22);
        }

        .company-location-marker__dot-inner {
          width: 3px;
          height: 3px;

          border-radius: 50%;

          background: #101211;
        }

        @keyframes companyMapPulse {
          0% {
            transform: translate(-50%, -50%) scale(0.65);

            opacity: 0.9;
          }

          70% {
            transform: translate(-50%, -50%) scale(3);

            opacity: 0;
          }

          100% {
            transform: translate(-50%, -50%) scale(3);

            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

/* ==========================================================================
   CONTACT FORM
============================================================================ */

export default function ContactForm({
  phone = "+90 332 000 00 00",

  email = "info@firma.com",

  address = "Konya, Türkiye",

  onSubmit,
}: ContactFormProps) {
  const [values, setValues] = useState<FormValues>(initialValues);

  const [step, setStep] = useState(0);

  const [direction, setDirection] = useState(1);

  const [subjectOpen, setSubjectOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState("");

  const currentStep = steps[step];

  const progress = ((step + 1) / steps.length) * 100;

  /* ==========================================================================
     VALIDATION
  ========================================================================== */

  const emailIsValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim());
  }, [values.email]);

  const canContinue = useMemo(() => {
    switch (step) {
      case 0:
        return values.name.trim().length >= 2;

      case 1:
        return emailIsValid;

      case 2:
        return values.phone.trim().length >= 7;

      case 3:
        return values.subject.trim().length > 0;

      case 4:
        return values.message.trim().length >= 10 && values.kvkk;

      default:
        return false;
    }
  }, [step, values, emailIsValid]);

  /* ==========================================================================
     NAVIGATION
  ========================================================================== */

  const goNext = () => {
    if (!canContinue) return;

    setError("");

    if (step < steps.length - 1) {
      setDirection(1);

      setSubjectOpen(false);

      setStep((current) => current + 1);
    }
  };

  const goBack = () => {
    if (step === 0) return;

    setDirection(-1);

    setSubjectOpen(false);

    setError("");

    setStep((current) => current - 1);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && step !== steps.length - 1 && !event.shiftKey) {
      event.preventDefault();

      goNext();
    }
  };

  /* ==========================================================================
     SUBMIT
  ========================================================================== */

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (step < steps.length - 1) {
      goNext();

      return;
    }

    if (!canContinue) {
      setError(
        !values.kvkk
          ? "Devam etmek için KVKK onayını vermelisiniz."
          : "Lütfen mesajınızı biraz daha detaylandırın.",
      );

      return;
    }

    try {
      setIsSubmitting(true);

      setError("");

      if (onSubmit) {
        await onSubmit(values);
      } else {
        console.log("Contact Form:", values);
      }

      setSubmitted(true);
    } catch {
      setError("Mesajınız gönderilirken bir sorun oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);

    setStep(0);

    setDirection(1);

    setSubjectOpen(false);

    setSubmitted(false);

    setError("");
  };

  return (
    <section
      className="
        relative
        min-h-[800px]
        overflow-hidden
        bg-[#101211]
        text-white
        lg:min-h-[860px]
      "
    >
      {/* ================================================================
          MAP
      ================================================================= */}

      <div
        className="
          absolute
          inset-0
          z-0
        "
      >
        <ContactMap />
      </div>

      {/* ================================================================
          CONTENT
      ================================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[800px]
          w-full
          max-w-[1500px]
          flex-col
          px-5
          py-14
          sm:px-8
          md:px-12
          lg:min-h-[860px]
          lg:px-16
          lg:py-16
          xl:px-20
        "
      >
        {/* ============================================================
            TITLE
        ============================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,

            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            flex
            items-start
            gap-5
          "
        >
          <div
            className="
              mt-[2px]
              h-[68px]
              w-[4px]
              shrink-0
              bg-[#F07E02]
            "
          />

          <div>
            <p
              className="
                mb-2
                text-[11px]
                font-medium
                text-white/55
              "
            >
              Bizimle iletişime geçin
            </p>

            <h2
              className="
                text-[44px]
                font-normal
                leading-[0.94]
                tracking-[-0.05em]
                sm:text-[54px]
                md:text-[62px]
              "
            >
              İletişim
            </h2>
          </div>
        </motion.div>

        {/* ============================================================
            INFO
        ============================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 14,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
            delay: 0.12,
          }}
          className="
            mt-14
            grid
            max-w-[760px]
            grid-cols-1
            gap-8
            sm:grid-cols-3
          "
        >
          {/* ==========================================================
              ADDRESS
          ========================================================== */}

          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="
              group
              w-fit
              cursor-pointer
            "
          >
            <div
              className="
                mb-4
                flex
                items-center
                gap-3
              "
            >
              <FiMapPin size={12} className="text-white/80" />

              <span
                className="
                  text-[10px]
                  text-white/75
                "
              >
                Adres
              </span>
            </div>

            <p
              className="
                max-w-[200px]
                text-[10px]
                leading-[1.7]
                text-white/35
                transition-colors
                group-hover:text-white/70
              "
            >
              {address}
            </p>
          </a>

          {/* ==========================================================
              PHONE
          ========================================================== */}

          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="
              group
              w-fit
              cursor-pointer
            "
          >
            <div
              className="
                mb-4
                flex
                items-center
                gap-3
              "
            >
              <FiPhone size={12} className="text-white/80" />

              <span
                className="
                  text-[10px]
                  text-white/75
                "
              >
                Telefon
              </span>
            </div>

            <p
              className="
                text-[10px]
                text-white/35
                transition-colors
                group-hover:text-white/70
              "
            >
              {phone}
            </p>
          </a>

          {/* ==========================================================
              MAIL
          ========================================================== */}

          <a
            href={`mailto:${email}`}
            className="
              group
              w-fit
              cursor-pointer
            "
          >
            <div
              className="
                mb-4
                flex
                items-center
                gap-3
              "
            >
              <FiMail size={12} className="text-white/80" />

              <span
                className="
                  text-[10px]
                  text-white/75
                "
              >
                E-posta
              </span>
            </div>

            <p
              className="
                text-[10px]
                text-white/35
                transition-colors
                group-hover:text-white/70
              "
            >
              {email}
            </p>
          </a>
        </motion.div>

        {/* ============================================================
            FORM
        ============================================================= */}

        <div
          className="
            mt-auto
            w-full
            max-w-[660px]
            pt-16
            lg:pt-20
          "
        >
          <div
            className="
              mb-10
              flex
              items-center
              gap-5
            "
          >
            <span
              className="
                h-[14px]
                w-[3px]
                bg-[#F07E02]
              "
            />

            <span
              className="
                text-[11px]
                text-white/70
              "
            >
              Bize ulaşın
            </span>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <SuccessState key="success" onReset={resetForm} />
            ) : (
              <motion.form key="form" onSubmit={handleSubmit}>
                <div
                  className="
                    relative
                    min-h-[145px]
                  "
                >
                  <AnimatePresence
                    initial={false}
                    custom={direction}
                    mode="wait"
                  >
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={stepVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{
                        duration: 0.4,

                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {/* ==================================================
                          NAME
                      ================================================== */}

                      {step === 0 && (
                        <TextField
                          autoFocus
                          value={values.name}
                          placeholder="Adınızı yazın"
                          helper={currentStep.helper}
                          autoComplete="name"
                          onChange={(value) =>
                            setValues((previous) => ({
                              ...previous,

                              name: value,
                            }))
                          }
                          onKeyDown={handleKeyDown}
                        />
                      )}

                      {/* ==================================================
                          EMAIL
                      ================================================== */}

                      {step === 1 && (
                        <TextField
                          autoFocus
                          type="email"
                          value={values.email}
                          placeholder="E-posta adresiniz"
                          helper={currentStep.helper}
                          autoComplete="email"
                          onChange={(value) =>
                            setValues((previous) => ({
                              ...previous,

                              email: value,
                            }))
                          }
                          onKeyDown={handleKeyDown}
                        />
                      )}

                      {/* ==================================================
                          PHONE
                      ================================================== */}

                      {step === 2 && (
                        <TextField
                          autoFocus
                          type="tel"
                          value={values.phone}
                          placeholder="+90 5__ ___ __ __"
                          helper={currentStep.helper}
                          autoComplete="tel"
                          onChange={(value) =>
                            setValues((previous) => ({
                              ...previous,

                              phone: value,
                            }))
                          }
                          onKeyDown={handleKeyDown}
                        />
                      )}

                      {/* ==================================================
                          SUBJECT
                      ================================================== */}

                      {step === 3 && (
                        <SubjectField
                          value={values.subject}
                          open={subjectOpen}
                          setOpen={setSubjectOpen}
                          onChange={(value) => {
                            setValues((previous) => ({
                              ...previous,

                              subject: value,
                            }));

                            setSubjectOpen(false);
                          }}
                        />
                      )}

                      {/* ==================================================
                          MESSAGE
                      ================================================== */}

                      {step === 4 && (
                        <MessageField
                          value={values.message}
                          kvkk={values.kvkk}
                          onMessageChange={(value) =>
                            setValues((previous) => ({
                              ...previous,

                              message: value,
                            }))
                          }
                          onKvkkChange={(value) =>
                            setValues((previous) => ({
                              ...previous,

                              kvkk: value,
                            }))
                          }
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* ====================================================
                    BOTTOM
                ===================================================== */}

                <div
                  className="
                    mt-2
                    flex
                    items-center
                    justify-between
                    gap-5
                  "
                >
                  <div
                    className="
                      flex
                      min-w-0
                      flex-1
                      items-center
                      gap-4
                    "
                  >
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={goBack}
                        className="
                          flex
                          cursor-pointer
                          items-center
                          gap-2
                          text-[10px]
                          text-white/35
                          transition-colors
                          hover:text-white
                        "
                      >
                        <FiArrowLeft size={13} />
                        Geri
                      </button>
                    )}

                    <div
                      className="
                        relative
                        h-px
                        flex-1
                        overflow-hidden
                        bg-white/10
                      "
                    >
                      <motion.div
                        animate={{
                          width: `${progress}%`,
                        }}
                        transition={{
                          duration: 0.5,
                        }}
                        className="
                          absolute
                          inset-y-0
                          left-0
                          bg-white/85
                        "
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!canContinue || isSubmitting}
                    className="
                      group
                      flex
                      cursor-pointer
                      items-center
                      gap-4
                      disabled:cursor-not-allowed
                      disabled:opacity-25
                    "
                  >
                    <span
                      className="
                        text-[10px]
                        text-white/65
                      "
                    >
                      {step === steps.length - 1
                        ? isSubmitting
                          ? "Gönderiliyor"
                          : "Gönder"
                        : "İleri"}
                    </span>

                    <span
                      className="
                        flex
                        h-[50px]
                        w-[50px]
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/20
                        transition-all
                        duration-300
                        group-hover:border-white
                        group-hover:bg-white
                        group-hover:text-black
                      "
                    >
                      {isSubmitting ? (
                        <span
                          className="
                            h-4
                            w-4
                            animate-spin
                            rounded-full
                            border
                            border-current/20
                            border-t-current
                          "
                        />
                      ) : step === steps.length - 1 ? (
                        <FiSend size={15} />
                      ) : (
                        <FiArrowRight size={16} />
                      )}
                    </span>
                  </button>
                </div>

                {/* ====================================================
                    ERROR
                ===================================================== */}

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{
                        opacity: 0,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      className="
                        mt-4
                        text-[10px]
                        text-red-400
                      "
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* ============================================================
            STEP
        ============================================================= */}

        {!submitted && (
          <div
            className="
              pointer-events-none
              absolute
              bottom-7
              left-5
              hidden
              items-baseline
              gap-3
              md:left-12
              md:flex
              lg:left-16
              xl:left-20
            "
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={currentStep.number}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                className="
                  text-[26px]
                  font-light
                  text-white/90
                "
              >
                {currentStep.number}
              </motion.span>
            </AnimatePresence>

            <span
              className="
                text-[9px]
                text-white/20
              "
            >
              /
            </span>

            <span
              className="
                text-[9px]
                text-white/30
              "
            >
              {String(steps.length).padStart(2, "0")}
            </span>
          </div>
        )}

        {/* ============================================================
            MAP CTA
        ============================================================= */}

        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noreferrer"
          className="
            group
            absolute
            bottom-8
            right-8
            hidden
            cursor-pointer
            items-center
            gap-3
            lg:flex
            xl:right-20
          "
        >
          <span
            className="
              text-[9px]
              uppercase
              tracking-[0.15em]
              text-white/35
              transition-colors
              group-hover:text-white
            "
          >
            Haritada aç
          </span>

          <span
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-white/15
              text-white/50
              transition-all
              group-hover:bg-white
              group-hover:text-black
            "
          >
            <FiExternalLink size={12} />
          </span>
        </a>
      </div>
    </section>
  );
}

/* ==========================================================================
   TEXT FIELD
============================================================================ */

function TextField({
  value,
  placeholder,
  helper,
  type = "text",
  autoComplete,
  autoFocus,
  onChange,
  onKeyDown,
}: {
  value: string;
  placeholder: string;
  helper: string;
  type?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <input
        autoFocus={autoFocus}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        className="
          w-full
          border-0
          bg-transparent
          p-0
          text-[28px]
          font-normal
          tracking-[-0.04em]
          text-white
          caret-[#F07E02]
          outline-none
          placeholder:text-white/[0.13]
          sm:text-[34px]
        "
      />

      <div
        className="
          mt-6
          h-px
          bg-white/10
        "
      >
        <motion.div
          animate={{
            width: value ? 130 : 0,
          }}
          transition={{
            duration: 0.45,
          }}
          className="
            h-full
            bg-white
          "
        />
      </div>

      <p
        className="
          mt-3
          text-[9px]
          text-white/35
        "
      >
        {helper}
      </p>
    </div>
  );
}

/* ==========================================================================
   SUBJECT
============================================================================ */

function SubjectField({
  value,
  open,
  setOpen,
  onChange,
}: {
  value: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          flex
          w-full
          cursor-pointer
          items-center
          justify-between
          text-left
          text-[28px]
          tracking-[-0.04em]
          sm:text-[34px]
        "
      >
        <span className={value ? "text-white" : "text-white/[0.13]"}>
          {value || "Konu seçin"}
        </span>

        <motion.span
          animate={{
            rotate: open ? 180 : 0,
          }}
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            text-white/50
          "
        >
          <FiChevronDown size={14} />
        </motion.span>
      </button>

      <div
        className="
          mt-6
          h-px
          bg-white/10
        "
      />

      <p
        className="
          mt-3
          text-[9px]
          text-white/35
        "
      >
        Görüşmek istediğiniz konuyu seçin
      </p>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 7,
            }}
            className="
              absolute
              left-0
              top-[calc(100%+14px)]
              z-40
              w-full
              max-w-[400px]
              border
              border-white/10
              bg-[#171918]/95
              p-2
              shadow-2xl
              backdrop-blur-xl
            "
          >
            {SUBJECTS.map((subject) => (
              <button
                key={subject}
                type="button"
                onClick={() => onChange(subject)}
                className="
                    flex
                    w-full
                    cursor-pointer
                    items-center
                    justify-between
                    px-4
                    py-3
                    text-left
                    text-[11px]
                    text-white/45
                    transition-colors
                    hover:bg-white/[0.04]
                    hover:text-white
                  "
              >
                {subject}

                <span
                  className="
                      h-1
                      w-1
                      rounded-full
                      bg-[#F07E02]
                    "
                />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================================
   MESSAGE
============================================================================ */

function MessageField({
  value,
  kvkk,
  onMessageChange,
  onKvkkChange,
}: {
  value: string;
  kvkk: boolean;
  onMessageChange: (value: string) => void;
  onKvkkChange: (value: boolean) => void;
}) {
  return (
    <div>
      <textarea
        autoFocus
        value={value}
        rows={2}
        placeholder="Mesajınızı yazın"
        onChange={(event) => onMessageChange(event.target.value)}
        className="
          max-h-[110px]
          min-h-[45px]
          w-full
          resize-none
          bg-transparent
          text-[27px]
          tracking-[-0.04em]
          text-white
          caret-[#F07E02]
          outline-none
          placeholder:text-white/[0.13]
          sm:text-[32px]
        "
      />

      <div
        className="
          mt-6
          h-px
          bg-white/10
        "
      />

      <div
        className="
          mt-4
          flex
          items-start
          gap-3
        "
      >
        <button
          type="button"
          aria-label="KVKK onayı"
          aria-pressed={kvkk}
          onClick={() => onKvkkChange(!kvkk)}
          className={`
            mt-[1px]
            flex
            h-4
            w-4
            shrink-0
            cursor-pointer
            items-center
            justify-center
            border
            transition-colors

            ${
              kvkk
                ? "border-[#F07E02] bg-[#F07E02]"
                : "border-white/25 hover:border-white/50"
            }
          `}
        >
          {kvkk && <FiCheck size={10} className="text-white" />}
        </button>

        <p
          className="
            max-w-[500px]
            text-[9px]
            leading-[1.6]
            text-white/35
          "
        >
          Kişisel verilerimin{" "}
          <a
            href="/kvkk"
            className="
              cursor-pointer
              text-white/65
              underline
              underline-offset-4
              transition-colors
              hover:text-white
            "
          >
            KVKK Aydınlatma Metni
          </a>{" "}
          kapsamında işlenmesini kabul ediyorum.
        </p>
      </div>
    </div>
  );
}

/* ==========================================================================
   SUCCESS
============================================================================ */

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        min-h-[170px]
      "
    >
      <div
        className="
          mb-5
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-white/15
        "
      >
        <FiCheck size={18} />
      </div>

      <h3
        className="
          text-[32px]
          tracking-[-0.04em]
        "
      >
        Mesajınız bize ulaştı.
      </h3>

      <p
        className="
          mt-3
          text-[10px]
          text-white/35
        "
      >
        En kısa sürede sizinle iletişime geçeceğiz.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="
          mt-7
          cursor-pointer
          border-b
          border-white/20
          pb-1
          text-[10px]
          text-white/45
          transition-colors
          hover:text-white
        "
      >
        Yeni mesaj gönder
      </button>
    </motion.div>
  );
}

/* ==========================================================================
   STEP ANIMATION
============================================================================ */

const stepVariants = {
  initial: (direction: number) => ({
    opacity: 0,

    y: direction > 0 ? 18 : -18,

    filter: "blur(4px)",
  }),

  animate: {
    opacity: 1,

    y: 0,

    filter: "blur(0px)",
  },

  exit: (direction: number) => ({
    opacity: 0,

    y: direction > 0 ? -15 : 15,

    filter: "blur(4px)",
  }),
};
