"use client";

import { useState, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import type { EnrichedLocationPin, EnrichedFriendPin } from "./types";
import { BRISTOL_COLORS } from "./types";

type SortField = "date" | "place";
type SortDirection = "asc" | "desc";

interface LocationListProps {
  locations: EnrichedLocationPin[];
  friendLocations?: EnrichedFriendPin[];
  onPinClick?: (id: string) => void;
  onPlaceNameUpdate?: (id: string, placeName: string) => void;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function isFriendPin(
  pin: EnrichedLocationPin | EnrichedFriendPin
): pin is EnrichedFriendPin {
  return "friendName" in pin;
}

function EditableName({
  pin,
  onSave,
}: {
  pin: EnrichedLocationPin;
  onSave: (id: string, name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(pin.place_name ?? "");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    const trimmed = value.trim();
    if (trimmed === (pin.place_name ?? "")) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/locations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pin.id, place_name: trimmed }),
      });
      if (res.ok) {
        onSave(pin.id, trimmed);
      }
    } catch {
      // Silently fail
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2 mt-0.5">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") setEditing(false);
          }}
          disabled={saving}
          className="flex-1 min-w-0 px-2 py-1 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          placeholder="Name this throne..."
          autoFocus
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="shrink-0 p-1 rounded-md text-primary hover:bg-primary/10 transition-colors"
        >
          <Icon name={saving ? "hourglass_empty" : "check"} className="text-base" />
        </button>
        <button
          type="button"
          onClick={() => { setEditing(false); setValue(pin.place_name ?? ""); }}
          className="shrink-0 p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Icon name="close" className="text-base" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 mt-0.5 group">
      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
        {pin.place_name ?? "Unknown Throne"}
      </p>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="shrink-0 p-0.5 rounded opacity-0 group-hover:opacity-100 text-slate-400 hover:text-primary transition-all cursor-pointer"
        title="Edit name"
      >
        <Icon name="edit" className="text-sm" />
      </button>
    </div>
  );
}

function BristolBadge({ type }: { type: number }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: `${BRISTOL_COLORS[type]}20`,
        color: BRISTOL_COLORS[type],
      }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: BRISTOL_COLORS[type] }}
      />
      Type {type}
    </span>
  );
}

export function LocationList({
  locations,
  friendLocations = [],
  onPinClick,
  onPlaceNameUpdate,
}: LocationListProps) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [localNames, setLocalNames] = useState<Map<string, string>>(new Map());

  const handleNameSave = (id: string, name: string) => {
    setLocalNames((prev) => new Map(prev).set(id, name));
    onPlaceNameUpdate?.(id, name);
  };

  const allPins: (EnrichedLocationPin | EnrichedFriendPin)[] = [
    ...locations,
    ...friendLocations,
  ].map((pin) => {
    const localName = localNames.get(pin.id);
    return localName !== undefined ? { ...pin, place_name: localName || null } : pin;
  });

  const sorted = [...allPins].sort((a, b) => {
    let cmp = 0;
    if (sortField === "date") {
      cmp =
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sortField === "place") {
      const nameA = a.place_name ?? "";
      const nameB = b.place_name ?? "";
      cmp = nameA.localeCompare(nameB);
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  if (sorted.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
        <p className="text-slate-500 dark:text-slate-400">
          No locations match your filters. Try adjusting or clearing filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-800">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Sort by:
        </span>
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as SortField)}
          className="text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5"
        >
          <option value="date">Date</option>
          <option value="place">Place Name</option>
        </select>
        <button
          type="button"
          onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Icon
            name={sortDir === "asc" ? "arrow_upward" : "arrow_downward"}
            className="text-base text-slate-500 dark:text-slate-400"
          />
        </button>
        <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
          {sorted.length} {sorted.length === 1 ? "location" : "locations"}
        </span>
      </div>

      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {sorted.map((pin) => {
          const isFriend = isFriendPin(pin);
          return (
            <li key={pin.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {isFriend && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                        {pin.friendAvatar ? (
                          <img
                            src={pin.friendAvatar}
                            alt=""
                            className="w-3.5 h-3.5 rounded-full"
                          />
                        ) : null}
                        {pin.friendName}
                      </span>
                    </div>
                  )}
                  {!isFriend ? (
                    <EditableName pin={pin} onSave={handleNameSave} />
                  ) : (
                    <p className="font-semibold text-slate-900 dark:text-slate-100 truncate mt-0.5">
                      {pin.place_name ?? "Unknown Throne"}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {timeAgo(pin.created_at)}
                    </p>
                    {pin.bristol_type && (
                      <BristolBadge type={pin.bristol_type} />
                    )}
                    {pin.xp_earned > 0 && (
                      <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                        +{pin.xp_earned} XP
                      </span>
                    )}
                  </div>
                </div>
                {onPinClick && (
                  <button
                    type="button"
                    onClick={() => onPinClick(pin.id)}
                    className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Icon name="map" className="text-sm" />
                    View on Map
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
