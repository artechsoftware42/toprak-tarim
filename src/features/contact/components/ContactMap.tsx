"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { divIcon } from "leaflet";
import type { LatLngExpression } from "leaflet";

import { FaRotateLeft } from "react-icons/fa6";

import "leaflet/dist/leaflet.css";

/* ========================================================= */
/* TYPES */
/* ========================================================= */

type ContactLocationKey = "office" | "factory";

type MapLocation = {
  center: LatLngExpression;
  lat: number;
  lng: number;
  zoom: number;
  label: string;
};

/* ========================================================= */
/* LOCATIONS */
/* ========================================================= */

const MAP_LOCATIONS: Record<ContactLocationKey, MapLocation> = {
  office: {
    lat: 37.8750381,
    lng: 32.5454167,
    center: [37.8750381, 32.5454167],
    zoom: 16,
    label: "Merkez Ofis",
  },

  factory: {
    lat: 37.8743669382893,
    lng: 32.61261894683467,
    center: [37.8743669382893, 32.61261894683467],
    zoom: 16,
    label: "Fabrika",
  },
};

/* ========================================================= */
/* MAP INSTANCE */
/* ========================================================= */

const MAP_INSTANCE_KEY = `contact-map-${Date.now()}`;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]!);
}

/* ========================================================= */
/* COMPONENT */
/* ========================================================= */

export default function ContactMap({
  activeLocation,
  labels,
  resetLabel,
}: {
  activeLocation: ContactLocationKey;
  labels: Record<ContactLocationKey, string>;
  resetLabel: string;
}) {
  const [mapMoved, setMapMoved] = useState(false);
  const [desktopInteraction, setDesktopInteraction] = useState(false);
  const location = useMemo(
    () => ({ ...MAP_LOCATIONS[activeLocation], label: labels[activeLocation] }),
    [activeLocation, labels],
  );

  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 1024px) and (pointer: fine) and (hover: hover)",
    );
    const updateInteractionMode = () => setDesktopInteraction(media.matches);

    updateInteractionMode();
    media.addEventListener("change", updateInteractionMode);
    return () => media.removeEventListener("change", updateInteractionMode);
  }, []);

  const markerIcon = useMemo(() => {
    return divIcon({
      className: "custom-location-marker",
      iconSize: [190, 70],
      iconAnchor: [23, 55],

      html: `
        <div
          style="
            display:flex;
            align-items:center;
            gap:11px;
            white-space:nowrap;
            font-family:Arial, Helvetica, sans-serif;
            pointer-events:none;
          "
        >
          <div
            style="
              position:relative;
              width:46px;
              height:46px;
              flex-shrink:0;
              display:flex;
              align-items:center;
              justify-content:center;
            "
          >
            <div
              style="
                position:absolute;
                inset:0;
                border-radius:999px;
                background:rgba(29,104,71,.16);
                border:1px solid rgba(29,104,71,.34);
              "
            ></div>

            <div
              style="
                position:relative;
                width:32px;
                height:32px;
                border-radius:999px;
                background:#1D6847;
                display:flex;
                align-items:center;
                justify-content:center;
                box-shadow:
                  0 10px 35px rgba(0,0,0,.35),
                  0 0 28px rgba(29,104,71,.30);
              "
            >
              <div
                style="
                  width:6px;
                  height:6px;
                  border-radius:999px;
                  background:#ffffff;
                "
              ></div>
            </div>
          </div>

          <div
            style="
              padding:9px 13px;
              background:rgba(10,11,12,.80);
              border:1px solid rgba(255,255,255,.11);
              color:rgba(255,255,255,.88);
              font-size:9px;
              font-weight:500;
              letter-spacing:.16em;
              text-transform:uppercase;
              backdrop-filter:blur(10px);
              box-shadow:0 12px 30px rgba(0,0,0,.20);
            "
          >
            ${escapeHtml(location.label)}
          </div>
        </div>
      `,
    });
  }, [location.label]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${desktopInteraction ? "" : "pointer-events-none select-none"}`}>
      <MapContainer
        key={MAP_INSTANCE_KEY}
        center={MAP_LOCATIONS.office.center}
        zoom={MAP_LOCATIONS.office.zoom}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
        attributionControl={true}
        className="
          h-full
          w-full
          bg-[#0c0d0e]

          [&_.leaflet-tile-pane]:grayscale
          [&_.leaflet-tile-pane]:invert
          [&_.leaflet-tile-pane]:brightness-[0.59]
          [&_.leaflet-tile-pane]:contrast-[1.22]
          [&_.leaflet-tile-pane]:opacity-[0.78]

          [&_.leaflet-control-attribution]:!m-0
          [&_.leaflet-control-attribution]:!bg-black/20
          [&_.leaflet-control-attribution]:!px-[5px]
          [&_.leaflet-control-attribution]:!py-[2px]
          [&_.leaflet-control-attribution]:!text-[7px]
          [&_.leaflet-control-attribution]:!leading-none
          [&_.leaflet-control-attribution]:!text-white/15
          [&_.leaflet-control-attribution]:!backdrop-blur-md

          [&_.leaflet-control-attribution_a]:!text-white/20
          [&_.leaflet-control-attribution_a]:!no-underline

          [&_.leaflet-container]:!bg-[#0c0d0e]
        "
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={location.center} icon={markerIcon} />

        <MapInteractionController interactive={desktopInteraction} />

        {desktopInteraction && <MapScrollZoneController />}

        <MapLocationController location={location} />

        {desktopInteraction && (
          <MapMovementWatcher
            targetLat={location.lat}
            targetLng={location.lng}
            targetZoom={location.zoom}
            onMovedChange={setMapMoved}
          />
        )}

        {desktopInteraction && mapMoved && (
          <ResetMapControl
            targetCenter={location.center}
            targetZoom={location.zoom}
            onReset={() => setMapMoved(false)}
            label={resetLabel}
          />
        )}
      </MapContainer>

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[500]
          bg-[radial-gradient(circle_at_65%_48%,transparent_0%,transparent_48%,rgba(0,0,0,0.15)_100%)]
        "
      />
    </div>
  );
}

function MapInteractionController({ interactive }: { interactive: boolean }) {
  const map = useMap();

  useEffect(() => {
    const desktopHandlers = [map.dragging, map.doubleClickZoom, map.boxZoom, map.keyboard];
    map.touchZoom.disable();

    if (interactive) {
      desktopHandlers.forEach((handler) => handler.enable());
    } else {
      desktopHandlers.forEach((handler) => handler.disable());
      map.scrollWheelZoom.disable();
    }

    return () => {
      map.scrollWheelZoom.disable();
    };
  }, [interactive, map]);

  return null;
}

/* ========================================================= */
/* RIGHT SIDE MOUSE WHEEL ZONE */
/* ========================================================= */

function MapScrollZoneController() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();

      const mouseX = event.clientX - rect.left;

      const zoomZoneStart = rect.width * 0.55;

      const isInsideZoomZone = mouseX >= zoomZoneStart;

      if (isInsideZoomZone) {
        if (!map.scrollWheelZoom.enabled()) {
          map.scrollWheelZoom.enable();
        }
      } else {
        if (map.scrollWheelZoom.enabled()) {
          map.scrollWheelZoom.disable();
        }
      }
    };

    const handleMouseLeave = () => {
      if (map.scrollWheelZoom.enabled()) {
        map.scrollWheelZoom.disable();
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);

      if (map.scrollWheelZoom.enabled()) {
        map.scrollWheelZoom.disable();
      }
    };
  }, [map]);

  return null;
}

/* ========================================================= */
/* LOCATION TRANSITION */
/* ========================================================= */

function MapLocationController({ location }: { location: MapLocation }) {
  const map = useMap();

  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    map.flyTo(location.center, location.zoom, {
      animate: true,
      duration: 1.35,
      easeLinearity: 0.18,
    });
  }, [map, location.center, location.zoom]);

  return null;
}

/* ========================================================= */
/* MAP MOVEMENT */
/* ========================================================= */

function MapMovementWatcher({
  targetLat,
  targetLng,
  targetZoom,
  onMovedChange,
}: {
  targetLat: number;
  targetLng: number;
  targetZoom: number;
  onMovedChange: (moved: boolean) => void;
}) {
  const map = useMapEvents({
    moveend() {
      checkPosition();
    },

    zoomend() {
      checkPosition();
    },
  });

  const checkPosition = () => {
    const currentCenter = map.getCenter();

    const distanceFromTarget = currentCenter.distanceTo({
      lat: targetLat,
      lng: targetLng,
    });

    const zoomChanged = map.getZoom() !== targetZoom;

    onMovedChange(distanceFromTarget > 15 || zoomChanged);
  };

  return null;
}

/* ========================================================= */
/* RESET BUTTON */
/* ========================================================= */

function ResetMapControl({
  targetCenter,
  targetZoom,
  onReset,
  label,
}: {
  targetCenter: LatLngExpression;
  targetZoom: number;
  onReset: () => void;
  label: string;
}) {
  const map = useMap();

  const handleReset = () => {
    map.flyTo(targetCenter, targetZoom, {
      animate: true,
      duration: 1.15,
      easeLinearity: 0.2,
    });

    onReset();
  };

  return (
    <button
      type="button"
      onClick={handleReset}
      className="
        absolute
        bottom-8
        right-8
        z-[1000]
        flex
        cursor-pointer
        items-center
        gap-3
        rounded-full
        border
        border-white/[0.13]
        bg-[#0b0c0d]/80
        px-5
        py-[13px]
        text-[9px]
        font-medium
        uppercase
        tracking-[0.16em]
        text-white/70
        shadow-[0_15px_45px_rgba(0,0,0,0.25)]
        backdrop-blur-xl
        transition-all
        duration-300
        hover:border-[#1D6847]/70
        hover:bg-[#0b0c0d]/95
        hover:text-white
        max-sm:bottom-5
        max-sm:right-5
        max-sm:px-4
        max-sm:py-3
      "
    >
      <FaRotateLeft className="text-[10px]" />

      <span>{label}</span>
    </button>
  );
}
