"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { LocationList } from "./LocationList";
import { MapFilters, getUniqueFriends } from "./MapFilters";
import { PinDetailCard } from "./PinDetailCard";
import dynamic from "next/dynamic";
import type {
  EnrichedLocationPin,
  EnrichedFriendPin,
  MapFiltersState,
} from "./types";
import { DEFAULT_FILTERS } from "./types";

interface PoopMapProps {
  locations: EnrichedLocationPin[];
  friendLocations?: EnrichedFriendPin[];
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

function applyFilters(
  locations: EnrichedLocationPin[],
  friendLocations: EnrichedFriendPin[],
  filters: MapFiltersState
): {
  filteredLocations: EnrichedLocationPin[];
  filteredFriendLocations: EnrichedFriendPin[];
} {
  const dateFilter = (pin: EnrichedLocationPin) => {
    if (filters.dateRange === "all") return true;
    const pinDate = new Date(pin.created_at);
    if (filters.dateRange === "custom") {
      if (filters.dateFrom && pinDate < new Date(filters.dateFrom)) return false;
      if (filters.dateTo) {
        const to = new Date(filters.dateTo);
        to.setHours(23, 59, 59, 999);
        if (pinDate > to) return false;
      }
      return true;
    }
    const days = { "7d": 7, "30d": 30, "90d": 90 }[filters.dateRange];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return pinDate >= cutoff;
  };

  const bristolFilter = (pin: EnrichedLocationPin) => {
    if (filters.bristolTypes.length === 0) return true;
    return pin.bristol_type != null && filters.bristolTypes.includes(pin.bristol_type);
  };

  const showMine = filters.friendFilter === "all" || filters.friendFilter === "mine";
  const showFriends =
    filters.friendFilter === "all" ||
    (filters.friendFilter !== "mine" && filters.friendFilter !== "all");

  const filteredLocations = showMine
    ? locations.filter((p) => dateFilter(p) && bristolFilter(p))
    : [];

  const filteredFriendLocations = showFriends
    ? friendLocations
        .filter((p) => {
          if (
            filters.friendFilter !== "all" &&
            filters.friendFilter !== "mine" &&
            p.friendId !== filters.friendFilter
          )
            return false;
          return dateFilter(p) && bristolFilter(p);
        })
    : [];

  return { filteredLocations, filteredFriendLocations };
}

export function PoopMap({
  locations,
  friendLocations = [],
  userAvatar,
}: PoopMapProps) {
  const searchParams = useSearchParams();
  const urlPinId = searchParams.get("pin");
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<"map" | "list">("map");
  const [focusedPinId, setFocusedPinId] = useState<string | null>(null);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [filters, setFilters] = useState<MapFiltersState>(DEFAULT_FILTERS);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showBathrooms, setShowBathrooms] = useState(false);
  const [showTerritories, setShowTerritories] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const friends = useMemo(
    () => getUniqueFriends(friendLocations),
    [friendLocations]
  );

  const { filteredLocations, filteredFriendLocations } = useMemo(
    () => applyFilters(locations, friendLocations, filters),
    [locations, friendLocations, filters]
  );

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

  const focusPinId = focusedPinId ?? urlPinId;

  const handleViewOnMap = (id: string) => {
    setFocusedPinId(id);
    setSelectedPinId(id);
    setView("map");
  };

  const handlePinSelect = (id: string) => {
    setSelectedPinId((prev) => (prev === id ? null : id));
  };

  const allFiltered = [...filteredLocations, ...filteredFriendLocations];
  const selectedPin = selectedPinId
    ? allFiltered.find((p) => p.id === selectedPinId)
    : undefined;

  return (
    <div className="space-y-4">
      {/* View Toggle + Filters */}
      <div className="flex items-start gap-4 flex-wrap">
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-fit">
          <button
            type="button"
            onClick={() => setView("map")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === "map"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <Icon name="map" className="text-base" />
            Map
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === "list"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <Icon name="format_list_bulleted" className="text-base" />
            List
          </button>
        </div>
      </div>

      {/* Filters */}
      <MapFilters filters={filters} onChange={setFilters} friends={friends} />

      {/* Map/List + Detail Card */}
      <div className="flex gap-4 items-start">
        <div className="flex-1 min-w-0">
          {view === "map" ? (
            <MapInner
              locations={filteredLocations}
              friendLocations={filteredFriendLocations}
              userAvatar={userAvatar}
              showHeatmap={showHeatmap}
              showBathrooms={showBathrooms}
              showTerritories={showTerritories}
              focusPinId={focusPinId}
              selectedPinId={selectedPinId}
              onPinSelect={handlePinSelect}
            />
          ) : (
            <LocationList
              locations={filteredLocations}
              friendLocations={filteredFriendLocations}
              onPinClick={handleViewOnMap}
            />
          )}
        </div>

        {/* Desktop Detail Card */}
        {selectedPin && (
          <div className="hidden lg:block">
            <PinDetailCard
              pin={selectedPin}
              onClose={() => setSelectedPinId(null)}
            />
          </div>
        )}
      </div>

      {/* Mobile Detail Card */}
      {selectedPin && (
        <div className="lg:hidden">
          <PinDetailCard
            pin={selectedPin}
            onClose={() => setSelectedPinId(null)}
          />
        </div>
      )}

      {/* Map Options */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Map Options
        </h3>
        <div className="space-y-3">
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
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Territories
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={showTerritories}
              onClick={() => setShowTerritories(!showTerritories)}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full transition-colors ${
                showTerritories
                  ? "bg-primary"
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white border border-slate-300 shadow-sm transition-transform mt-0.5 ${
                  showTerritories
                    ? "translate-x-7 ml-0.5"
                    : "translate-x-0 ml-1"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Nearby Bathrooms
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={showBathrooms}
              onClick={() => setShowBathrooms(!showBathrooms)}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full transition-colors ${
                showBathrooms
                  ? "bg-primary"
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white border border-slate-300 shadow-sm transition-transform mt-0.5 ${
                  showBathrooms
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
