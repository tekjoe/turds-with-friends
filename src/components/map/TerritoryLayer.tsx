"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useMap, Polygon, Popup } from "react-leaflet";
import { TERRITORY_MIN_ZOOM, CURRENT_USER_COLOR, userIdToColor } from "@/lib/h3";

interface Territory {
  h3Index: string;
  boundary: [number, number][];
  ownerId: string;
  ownerName: string;
  ownerLogCount: number;
  totalLogs: number;
}

interface TerritoryData {
  territories: Territory[];
  currentUserId: string;
}

export function TerritoryLayer({ enabled }: { enabled: boolean }) {
  const map = useMap();
  const [data, setData] = useState<TerritoryData | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastBoundsRef = useRef<string>("");
  const abortRef = useRef<AbortController | null>(null);

  const fetchTerritories = useCallback(async () => {
    const zoom = map.getZoom();
    if (zoom < TERRITORY_MIN_ZOOM) {
      setData(null);
      return;
    }

    const bounds = map.getBounds();
    const key = `${bounds.getSouth().toFixed(3)},${bounds.getWest().toFixed(3)},${bounds.getNorth().toFixed(3)},${bounds.getEast().toFixed(3)}`;

    if (key === lastBoundsRef.current) return;
    lastBoundsRef.current = key;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(
        `/api/territories?bounds=${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`,
        { signal: controller.signal }
      );
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // Silently fail — don't break the map
    }
  }, [map]);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      lastBoundsRef.current = "";
      abortRef.current?.abort();
      return;
    }

    fetchTerritories();

    const handleMoveEnd = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(fetchTerritories, 1000);
    };

    map.on("moveend", handleMoveEnd);
    return () => {
      map.off("moveend", handleMoveEnd);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, [enabled, map, fetchTerritories]);

  if (!data || data.territories.length === 0) return null;

  return (
    <>
      {data.territories.map((t) => {
        const isCurrentUser = t.ownerId === data.currentUserId;
        const color = isCurrentUser
          ? CURRENT_USER_COLOR
          : userIdToColor(t.ownerId);

        return (
          <Polygon
            key={t.h3Index}
            positions={t.boundary}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.25,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-sm min-w-[160px]">
                <p className="font-bold text-[15px] text-[#1A1A1A]">
                  {isCurrentUser ? "Your Territory" : `${t.ownerName}'s Territory`}
                </p>
                <p className="text-[#6B7280] mt-1">
                  {t.ownerLogCount} {t.ownerLogCount === 1 ? "log" : "logs"}
                </p>
                {t.totalLogs > t.ownerLogCount && (
                  <p className="text-[#6B7280] text-xs mt-0.5">
                    {t.totalLogs} total logs in this zone
                  </p>
                )}
              </div>
            </Popup>
          </Polygon>
        );
      })}
    </>
  );
}
