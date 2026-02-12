"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import dynamic from "next/dynamic";

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

interface PoopMapProps {
  locations: LocationPin[];
  friendLocations?: FriendLocationPin[];
  userAvatar: string | null;
}

const MapInner = dynamic(() => import("@/components/map/MapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  ),
});

export function PoopMap({
  locations,
  friendLocations = [],
  userAvatar,
}: PoopMapProps) {
  const searchParams = useSearchParams();
  const focusPinId = searchParams.get("pin");
  const [mounted, setMounted] = useState(false);
  const [showFriends, setShowFriends] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const hasAnyPins = locations.length > 0 || friendLocations.length > 0;

  if (!hasAnyPins) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="map" className="text-4xl text-primary" />
          </div>
          <h2 className="text-xl font-bold font-display">No Pins Yet</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm">
            Enable location tracking when you log a movement to start building
            your map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MapInner
        locations={locations}
        friendLocations={showFriends ? friendLocations : []}
        userAvatar={userAvatar}
        showHeatmap={showHeatmap}
        focusPinId={focusPinId}
      />
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Map Options
        </h3>
        <div className="space-y-3">
          {friendLocations.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Show friends' poop locations
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={showFriends}
                onClick={() => setShowFriends(!showFriends)}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full transition-colors ${
                  showFriends
                    ? "bg-primary"
                    : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white border border-slate-300 shadow-sm transition-transform mt-0.5 ${
                    showFriends
                      ? "translate-x-7 ml-0.5"
                      : "translate-x-0 ml-1"
                  }`}
                />
              </button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Heatmap
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={showHeatmap}
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full transition-colors ${
                showHeatmap
                  ? "bg-primary"
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white border border-slate-300 shadow-sm transition-transform mt-0.5 ${
                  showHeatmap
                    ? "translate-x-7 ml-0.5"
                    : "translate-x-0 ml-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
