"use client";

import { Icon } from "@/components/ui/Icon";
import { LocationComments } from "./LocationComments";
import { StarRating } from "./StarRating";
import type { EnrichedLocationPin, EnrichedFriendPin } from "./types";
import { BRISTOL_LABELS, BRISTOL_COLORS } from "./types";

function isFriend(
  pin: EnrichedLocationPin | EnrichedFriendPin
): pin is EnrichedFriendPin {
  return "friendName" in pin;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
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

interface PinDetailCardProps {
  pin: EnrichedLocationPin | EnrichedFriendPin;
  onClose: () => void;
}

export function PinDetailCard({ pin, onClose }: PinDetailCardProps) {
  const friend = isFriend(pin);
  const weightChange =
    pin.pre_weight != null && pin.post_weight != null
      ? Math.round((pin.pre_weight - pin.post_weight) * 10) / 10
      : null;

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 bg-black/20 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Card */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:static lg:z-auto lg:w-[360px] lg:shrink-0">
        <div className="bg-white dark:bg-slate-900 rounded-t-2xl lg:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl lg:shadow-sm max-h-[70vh] lg:max-h-none overflow-y-auto">
          {/* Handle bar (mobile) */}
          <div className="flex justify-center pt-2 lg:hidden">
            <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between p-4 pb-0">
            <div className="min-w-0 flex-1">
              {friend && (
                <div className="flex items-center gap-2 mb-1">
                  {pin.friendAvatar && (
                    <img
                      src={pin.friendAvatar}
                      alt=""
                      className="w-5 h-5 rounded-full"
                    />
                  )}
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {pin.friendName}
                  </span>
                </div>
              )}
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                {pin.place_name ?? "Unknown Throne"}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {timeAgo(pin.created_at)} &middot; {formatDate(pin.created_at)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-2"
            >
              <Icon
                name="close"
                className="text-lg text-slate-400 dark:text-slate-500"
              />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 p-4">
            {/* Bristol Type */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Bristol Type
              </p>
              {pin.bristol_type ? (
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{
                      backgroundColor: BRISTOL_COLORS[pin.bristol_type],
                    }}
                  />
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Type {pin.bristol_type}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-slate-400">N/A</span>
              )}
              {pin.bristol_type && (
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {BRISTOL_LABELS[pin.bristol_type]}
                </p>
              )}
            </div>

            {/* Weight Change */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Weight Change
              </p>
              {weightChange != null ? (
                <div className="flex items-center gap-1">
                  <Icon
                    name={
                      weightChange > 0
                        ? "trending_down"
                        : weightChange < 0
                          ? "trending_up"
                          : "trending_flat"
                    }
                    className={`text-base ${
                      weightChange > 0
                        ? "text-green-600"
                        : weightChange < 0
                          ? "text-red-500"
                          : "text-slate-400"
                    }`}
                  />
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {weightChange > 0 ? "-" : "+"}
                    {Math.abs(weightChange)} {pin.weight_unit}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-slate-400">N/A</span>
              )}
            </div>

            {/* XP Earned */}
            {pin.xp_earned > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
                <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
                  XP Earned
                </p>
                <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                  +{pin.xp_earned} XP
                </span>
              </div>
            )}

            {/* Coordinates */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Location
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {pin.latitude.toFixed(4)}, {pin.longitude.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 dark:border-slate-800 mx-4" />

          {/* Rating */}
          <div className="px-4 pt-3">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Rating
            </p>
            <StarRating locationLogId={pin.id} />
          </div>

          {/* Comments */}
          <div className="px-4 pt-2 pb-4">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Comments
            </p>
            <LocationComments locationLogId={pin.id} />
          </div>

          {/* Directions Button */}
          <div className="px-4 pb-4">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${pin.latitude},${pin.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <Icon name="directions" className="text-base" />
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
