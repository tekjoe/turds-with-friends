"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useEffect, useRef, useCallback, useState } from "react";
import { TerritoryLayer } from "./TerritoryLayer";
import type { PublicBathroom } from "@/lib/overpass";
import type { EnrichedLocationPin, EnrichedFriendPin } from "./types";

function createClusterCustomIcon(cluster: L.MarkerCluster) {
  const count = cluster.getChildCount();
  return new L.DivIcon({
    html: `<span>${count}</span>`,
    className: "custom-cluster-icon",
    iconSize: [36, 36],
  });
}

function makeIcon(color: string, avatarUrl: string | null) {
  const avatarImg = avatarUrl
    ? `<img src="${avatarUrl}" style="position:absolute;top:5px;left:6px;width:24px;height:24px;border-radius:50%;object-fit:cover;" />`
    : `<img src="/toilet-paper.svg" style="position:absolute;top:7px;left:8px;width:20px;height:20px;" />`;

  return new L.DivIcon({
    html: `<div style="position:relative;width:36px;height:46px;">
      <svg viewBox="0 0 36 46" width="36" height="46" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 0C8.06 0 0 7.66 0 17.1 0 29.9 18 46 18 46s18-16.1 18-28.9C36 7.66 27.94 0 18 0z" fill="${color}"/>
        <circle cx="18" cy="17" r="12" fill="white"/>
      </svg>
      ${avatarImg}
    </div>`,
    className: "",
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -46],
  });
}

const bathroomIcon = new L.DivIcon({
  html: `<div class="bathroom-pin"><span class="material-symbols-rounded" style="font-size:18px;color:white;">wc</span></div>`,

  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function HeatmapLayer({
  points,
}: {
  points: [number, number, number][];
}) {
  const map = useMap();
  const layerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (points.length === 0) {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const heat = (L as any).heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
    });
    heat.addTo(map);
    layerRef.current = heat;

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
}

function FocusPin({
  pin,
  markerRefs,
}: {
  pin: EnrichedLocationPin | EnrichedFriendPin | undefined;
  markerRefs: React.RefObject<Map<string, L.Marker>>;
}) {
  const map = useMap();

  useEffect(() => {
    if (!pin) return;
    map.setView([pin.latitude, pin.longitude], 14);
    const timer = setTimeout(() => {
      const marker = markerRefs.current?.get(pin.id);
      if (marker) marker.openPopup();
    }, 300);
    return () => clearTimeout(timer);
  }, [map, pin, markerRefs]);

  return null;
}

function BathroomFetcher({
  enabled,
  onBathrooms,
}: {
  enabled: boolean;
  onBathrooms: (bathrooms: PublicBathroom[]) => void;
}) {
  const map = useMap();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastCenterRef = useRef<string>("");
  const abortRef = useRef<AbortController | null>(null);

  const fetchBathrooms = useCallback(async () => {
    const center = map.getCenter();
    const key = `${center.lat.toFixed(2)},${center.lng.toFixed(2)}`;

    // Skip if center hasn't changed significantly
    if (key === lastCenterRef.current) return;
    lastCenterRef.current = key;

    // Abort any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(
        `/api/locations/nearby-bathrooms?lat=${center.lat}&lng=${center.lng}&radius=3000`,
        { signal: controller.signal }
      );
      if (res.ok) {
        const data = await res.json();
        onBathrooms(data.bathrooms ?? []);
      }
    } catch {
      // Silently fail — don't break the map
    }
  }, [map, onBathrooms]);

  useEffect(() => {
    if (!enabled) {
      onBathrooms([]);
      lastCenterRef.current = "";
      abortRef.current?.abort();
      return;
    }

    // Fetch immediately when enabled
    fetchBathrooms();

    // Fetch on map move (debounced)
    const handleMoveEnd = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(fetchBathrooms, 1000);
    };

    map.on("moveend", handleMoveEnd);
    return () => {
      map.off("moveend", handleMoveEnd);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, [enabled, map, fetchBathrooms, onBathrooms]);

  return null;
}

function MyLocationButton() {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  const handleClick = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.setView([pos.coords.latitude, pos.coords.longitude], 15);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="absolute top-3 right-3 z-[1000] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
      title="My location"
    >
      {locating ? (
        <div className="w-5 h-5 border-2 border-slate-300 border-t-primary rounded-full animate-spin" />
      ) : (
        <span className="material-symbols-rounded text-xl text-slate-600 dark:text-slate-300 leading-none block">
          my_location
        </span>
      )}
    </button>
  );
}

function BathroomPopupContent({ bathroom }: { bathroom: PublicBathroom }) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${bathroom.lat},${bathroom.lon}`;

  return (
    <div className="min-w-[200px]">
      <p className="font-semibold text-[15px] text-[#1A1A1A]">
        {bathroom.name || "Public Restroom"}
      </p>
      {bathroom.operator && (
        <p className="text-[#6B7280] text-xs mt-0.5">{bathroom.operator}</p>
      )}

      <div className="flex flex-wrap gap-1.5 mt-3">
        {bathroom.wheelchair && (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
              bathroom.wheelchair === "yes"
                ? "bg-[#D1FAE5] text-[#2D6A4F]"
                : "bg-[#F3F4F6] text-[#6B7280]"
            }`}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 12 }}>
              accessible
            </span>
            {bathroom.wheelchair === "yes" ? "Accessible" : "Not accessible"}
          </span>
        )}
        {bathroom.fee && (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
              bathroom.fee === "no"
                ? "bg-[#D1FAE5] text-[#2D6A4F]"
                : "bg-[#FEF3C7] text-[#D97706]"
            }`}
          >
            {bathroom.fee === "no" ? "Free" : "Paid"}
          </span>
        )}
      </div>

      {bathroom.openingHours && (
        <p className="text-xs text-[#6B7280] mt-3 flex items-center gap-1">
          <span className="material-symbols-rounded" style={{ fontSize: 14 }}>
            schedule
          </span>
          {bathroom.openingHours}
        </p>
      )}

      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-[#C05621] hover:bg-[#9C4A1A] text-[13px] font-semibold rounded-xl transition-colors"
        style={{ color: "#FFFFFF" }}
      >
        <span className="material-symbols-rounded" style={{ fontSize: 14 }}>
          directions
        </span>
        Get Directions
      </a>
    </div>
  );
}

interface MapInnerProps {
  locations: EnrichedLocationPin[];
  friendLocations?: EnrichedFriendPin[];
  userAvatar: string | null;
  showHeatmap?: boolean;
  showBathrooms?: boolean;
  showTerritories?: boolean;
  focusPinId?: string | null;
  selectedPinId?: string | null;
  onPinSelect?: (id: string) => void;
}

export default function MapInner({
  locations,
  friendLocations = [],
  userAvatar,
  showHeatmap = false,
  showBathrooms = false,
  showTerritories = false,
  focusPinId,
  selectedPinId,
  onPinSelect,
}: MapInnerProps) {
  const [bathrooms, setBathrooms] = useState<PublicBathroom[]>([]);

  const allPins = [...locations, ...friendLocations];
  const center: [number, number] =
    allPins.length > 0
      ? [allPins[0].latitude, allPins[0].longitude]
      : [39.8283, -98.5795];

  const myIcon = makeIcon("#C05621", userAvatar);
  const myIconSelected = makeIcon("#9C4A1A", userAvatar);
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());

  const setMarkerRef = useCallback(
    (id: string, marker: L.Marker | null) => {
      if (marker) {
        markerRefs.current.set(id, marker);
      } else {
        markerRefs.current.delete(id);
      }
    },
    []
  );

  const handleBathrooms = useCallback((data: PublicBathroom[]) => {
    setBathrooms(data);
  }, []);

  const heatPoints: [number, number, number][] = showHeatmap
    ? allPins.map((p) => [p.latitude, p.longitude, 1])
    : [];

  const focusPin = focusPinId
    ? allPins.find((p) => p.id === focusPinId)
    : undefined;

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative z-0">
      <MapContainer
        center={focusPin ? [focusPin.latitude, focusPin.longitude] : center}
        zoom={focusPin ? 14 : allPins.length === 1 ? 14 : 5}
        className="w-full h-[500px] sm:h-[600px]"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <HeatmapLayer points={heatPoints} />
        <TerritoryLayer enabled={showTerritories} />
        <BathroomFetcher enabled={showBathrooms} onBathrooms={handleBathrooms} />
        <MyLocationButton />
        {focusPin && <FocusPin pin={focusPin} markerRefs={markerRefs} />}

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom
          showCoverageOnHover={false}
          iconCreateFunction={createClusterCustomIcon}
          spiderLegPolylineOptions={{ weight: 0, opacity: 0 }}
          spiderfyDistanceMultiplier={1.5}
        >
          {/* User's own pins */}
          {locations.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.latitude, loc.longitude]}
              icon={selectedPinId === loc.id ? myIconSelected : myIcon}
              ref={(r) => setMarkerRef(loc.id, r as unknown as L.Marker | null)}
              eventHandlers={{
                click: () => onPinSelect?.(loc.id),
              }}
            />
          ))}

          {/* Friend pins */}
          {friendLocations.map((loc) => {
            const isSelected = selectedPinId === loc.id;
            const friendIcon = makeIcon(
              isSelected ? "#2563EB" : "#3B82F6",
              loc.friendAvatar
            );
            return (
              <Marker
                key={loc.id}
                position={[loc.latitude, loc.longitude]}
                icon={friendIcon}
                ref={(r) => setMarkerRef(loc.id, r as unknown as L.Marker | null)}
                eventHandlers={{
                  click: () => onPinSelect?.(loc.id),
                }}
              />
            );
          })}
        </MarkerClusterGroup>

        {/* Nearby bathroom pins */}
        {bathrooms.map((b) => (
          <Marker
            key={`bathroom-${b.id}`}
            position={[b.lat, b.lon]}
            icon={bathroomIcon}
          >
            <Popup maxWidth={280} minWidth={200}>
              <BathroomPopupContent bathroom={b} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
