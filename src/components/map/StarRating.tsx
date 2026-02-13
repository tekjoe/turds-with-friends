"use client";

import { useState } from "react";

interface StarRatingProps {
  locationLogId: string;
  initialAverage?: number;
  initialCount?: number;
  initialUserRating?: number | null;
}

export function StarRating({
  locationLogId,
  initialAverage = 0,
  initialCount = 0,
  initialUserRating = null,
}: StarRatingProps) {
  const [average, setAverage] = useState(initialAverage);
  const [count, setCount] = useState(initialCount);
  const [userRating, setUserRating] = useState<number | null>(initialUserRating);
  const [hovered, setHovered] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const handleRate = async (rating: number) => {
    if (saving) return;
    setSaving(true);

    const prevRating = userRating;
    const prevAvg = average;
    const prevCount = count;

    // Optimistic update
    const isNew = userRating === null;
    const newCount = isNew ? count + 1 : count;
    const newAvg = isNew
      ? (average * count + rating) / newCount
      : (average * count - userRating + rating) / count;
    setUserRating(rating);
    setAverage(newAvg);
    setCount(newCount);

    try {
      const res = await fetch(`/api/locations/${locationLogId}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAverage(data.average);
      setCount(data.count);
      setUserRating(data.userRating);
    } catch {
      // Rollback on failure
      setUserRating(prevRating);
      setAverage(prevAvg);
      setCount(prevCount);
    } finally {
      setSaving(false);
    }
  };

  const displayRating = hovered ?? userRating ?? 0;

  return (
    <div className="mt-2">
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={() => setHovered(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={saving}
            onMouseEnter={() => setHovered(star)}
            onClick={() => handleRate(star)}
            className="p-0 border-0 bg-transparent cursor-pointer transition-transform hover:scale-110 disabled:cursor-wait"
          >
            <span
              className="material-symbols-rounded text-lg leading-none"
              style={{
                color: star <= displayRating ? "#D97706" : "#D1D5DB",
                fontVariationSettings:
                  star <= displayRating
                    ? "'FILL' 1, 'wght' 400"
                    : "'FILL' 0, 'wght' 400",
              }}
            >
              star
            </span>
          </button>
        ))}
      </div>
      <p className="text-[11px] text-[#6B7280] mt-0.5">
        {count > 0 ? (
          <>
            {average.toFixed(1)} ({count} {count === 1 ? "rating" : "ratings"})
          </>
        ) : (
          "No ratings yet"
        )}
      </p>
    </div>
  );
}
