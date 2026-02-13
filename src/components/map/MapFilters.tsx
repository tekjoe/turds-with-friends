"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type {
  MapFiltersState,
  EnrichedFriendPin,
} from "./types";
import { BRISTOL_LABELS, BRISTOL_COLORS } from "./types";

interface MapFiltersProps {
  filters: MapFiltersState;
  onChange: (filters: MapFiltersState) => void;
  friends: { id: string; name: string }[];
}

const DATE_PRESETS = [
  { value: "all" as const, label: "All Time" },
  { value: "7d" as const, label: "7 days" },
  { value: "30d" as const, label: "30 days" },
  { value: "90d" as const, label: "90 days" },
  { value: "custom" as const, label: "Custom" },
];

export function getUniqueFriends(
  friendLocations: EnrichedFriendPin[]
): { id: string; name: string }[] {
  const map = new Map<string, string>();
  for (const pin of friendLocations) {
    if (!map.has(pin.friendId)) {
      map.set(pin.friendId, pin.friendName);
    }
  }
  return Array.from(map, ([id, name]) => ({ id, name }));
}

export function MapFilters({ filters, onChange, friends }: MapFiltersProps) {
  const [open, setOpen] = useState(false);

  const activeCount =
    (filters.dateRange !== "all" ? 1 : 0) +
    (filters.bristolTypes.length > 0 ? 1 : 0) +
    (filters.friendFilter !== "all" ? 1 : 0);

  const handleDateRange = (value: MapFiltersState["dateRange"]) => {
    onChange({
      ...filters,
      dateRange: value,
      dateFrom: null,
      dateTo: null,
    });
  };

  const toggleBristol = (type: number) => {
    const next = filters.bristolTypes.includes(type)
      ? filters.bristolTypes.filter((t) => t !== type)
      : [...filters.bristolTypes, type];
    onChange({ ...filters, bristolTypes: next });
  };

  const handleClear = () => {
    onChange({
      dateRange: "all",
      dateFrom: null,
      dateTo: null,
      bristolTypes: [],
      friendFilter: "all",
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Icon
            name="filter_list"
            className="text-lg text-slate-500 dark:text-slate-400"
          />
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Filters
          </span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold text-white bg-primary rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <Icon
          name={open ? "expand_less" : "expand_more"}
          className="text-lg text-slate-400"
        />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-5 border-t border-slate-100 dark:border-slate-800 pt-4">
          {/* Date Range */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Date Range
            </p>
            <div className="flex flex-wrap gap-1.5">
              {DATE_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleDateRange(preset.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    filters.dateRange === preset.value
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            {filters.dateRange === "custom" && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="date"
                  value={filters.dateFrom ?? ""}
                  onChange={(e) =>
                    onChange({ ...filters, dateFrom: e.target.value || null })
                  }
                  className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                />
                <span className="text-xs text-slate-400">to</span>
                <input
                  type="date"
                  value={filters.dateTo ?? ""}
                  onChange={(e) =>
                    onChange({ ...filters, dateTo: e.target.value || null })
                  }
                  className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                />
              </div>
            )}
          </div>

          {/* Bristol Type */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Bristol Type
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((type) => {
                const active = filters.bristolTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleBristol(type)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: BRISTOL_COLORS[type] }}
                    />
                    {type}: {BRISTOL_LABELS[type]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Friend Filter */}
          {friends.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Whose Logs
              </p>
              <select
                value={filters.friendFilter}
                onChange={(e) =>
                  onChange({ ...filters, friendFilter: e.target.value })
                }
                className="text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 w-full"
              >
                <option value="all">Everyone</option>
                <option value="mine">Mine Only</option>
                {friends.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Clear Button */}
          {activeCount > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
