"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useRef, useCallback } from "react";
import { LocationComments } from "./LocationComments";

interface LocationPin {
  id: string;
  latitude: number;
  longitude: number;
  place_name: string | null;
  created_at: string;
}

interface FriendLocationPin extends LocationPin {
  friendName: string;
  friendAvatar: string | null;
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

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
  pin: LocationPin | FriendLocationPin | undefined;
  markerRefs: React.RefObject<Map<string, L.Marker>>;
}) {
  const map = useMap();

  useEffect(() => {
    if (!pin) return;
    map.setView([pin.latitude, pin.longitude], 14);
    // Small delay to let markers render before opening popup
    const timer = setTimeout(() => {
      const marker = markerRefs.current?.get(pin.id);
      if (marker) marker.openPopup();
    }, 300);
    return () => clearTimeout(timer);
  }, [map, pin, markerRefs]);

  return null;
}

interface MapInnerProps {
  locations: LocationPin[];
  friendLocations?: FriendLocationPin[];
  userAvatar: string | null;
  showHeatmap?: boolean;
  focusPinId?: string | null;
}

export default function MapInner({
  locations,
  friendLocations = [],
  userAvatar,
  showHeatmap = false,
  focusPinId,
}: MapInnerProps) {
  const allPins = [...locations, ...friendLocations];
  const center: [number, number] =
    allPins.length > 0
      ? [allPins[0].latitude, allPins[0].longitude]
      : [39.8283, -98.5795];

  const myIcon = makeIcon("#22C55E", userAvatar);
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
        {focusPin && <FocusPin pin={focusPin} markerRefs={markerRefs} />}
        {/* User's own pins (green) */}
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.latitude, loc.longitude]}
            icon={myIcon}
            ref={(r) => setMarkerRef(loc.id, r as unknown as L.Marker | null)}
          >
            <Popup maxWidth={300} minWidth={240}>
              <div className="text-sm">
                <p className="font-bold">
                  {loc.place_name ?? "Unknown Throne"}
                </p>
                <p className="text-slate-500">{formatDate(loc.created_at)}</p>
                <LocationComments locationLogId={loc.id} />
              </div>
            </Popup>
          </Marker>
        ))}
        {/* Friend pins (blue) */}
        {friendLocations.map((loc) => {
          const friendIcon = makeIcon("#3B82F6", loc.friendAvatar);
          return (
            <Marker
              key={loc.id}
              position={[loc.latitude, loc.longitude]}
              icon={friendIcon}
              ref={(r) => setMarkerRef(loc.id, r as unknown as L.Marker | null)}
            >
              <Popup maxWidth={300} minWidth={240}>
                <div className="text-sm">
                  <p className="font-bold text-blue-600">{loc.friendName}</p>
                  <p>{loc.place_name ?? "Unknown Throne"}</p>
                  <p className="text-slate-500">
                    {formatDate(loc.created_at)}
                  </p>
                  <LocationComments locationLogId={loc.id} />
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
