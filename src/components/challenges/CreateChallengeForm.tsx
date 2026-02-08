"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";

interface Friend {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
}

interface CreateChallengeFormProps {
  onCreated: () => void;
  onCancel: () => void;
}

const CHALLENGE_TYPES = [
  {
    value: "most_logs" as const,
    label: "Most Logs",
    description: "Who can log the most movements",
    icon: "edit_note",
  },
  {
    value: "longest_streak" as const,
    label: "Longest Streak",
    description: "Who can maintain the longest daily streak",
    icon: "local_fire_department",
  },
  {
    value: "most_weight_lost" as const,
    label: "Most Weight Lost",
    description: "Who loses the most weight across sessions",
    icon: "monitor_weight",
  },
];

export function CreateChallengeForm({
  onCreated,
  onCancel,
}: CreateChallengeFormProps) {
  const [title, setTitle] = useState("");
  const [challengeType, setChallengeType] = useState<
    "most_logs" | "longest_streak" | "most_weight_lost"
  >("most_logs");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const [friendQuery, setFriendQuery] = useState("");
  const [friendResults, setFriendResults] = useState<Friend[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Load accepted friends
  useEffect(() => {
    fetch("/api/friends")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.friends)) {
          setFriends(data.friends);
        }
      })
      .catch(() => {});
  }, []);

  // Search friends as user types
  useEffect(() => {
    if (friendQuery.length < 2) {
      setFriendResults([]);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      // Filter from existing friends list
      const q = friendQuery.toLowerCase();
      const results = friends.filter(
        (f) =>
          !selectedFriends.some((s) => s.id === f.id) &&
          ((f.username?.toLowerCase().includes(q) ?? false) ||
            (f.display_name?.toLowerCase().includes(q) ?? false))
      );
      setFriendResults(results);
    }, 200);
  }, [friendQuery, friends, selectedFriends]);

  const addFriend = (friend: Friend) => {
    setSelectedFriends((prev) => [...prev, friend]);
    setFriendQuery("");
    setFriendResults([]);
  };

  const removeFriend = (id: string) => {
    setSelectedFriends((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please enter a challenge title");
      return;
    }
    if (!startDate || !endDate) {
      setError("Please select start and end dates");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError("End date must be after start date");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          challenge_type: challengeType,
          start_date: startDate,
          end_date: endDate,
          friend_ids: selectedFriends.map((f) => f.id),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create challenge");
      }

      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <h2 className="text-lg font-bold font-display mb-6">
        Create a Challenge
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. February Flush-Off"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        {/* Challenge Type */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CHALLENGE_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setChallengeType(type.value)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  challengeType === type.value
                    ? "border-primary bg-primary/5"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <Icon name={type.icon} className="text-xl text-primary" />
                <div>
                  <p className="text-sm font-semibold">{type.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {type.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Invite Friends */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Invite Friends
          </label>
          <div className="relative">
            <input
              type="text"
              value={friendQuery}
              onChange={(e) => setFriendQuery(e.target.value)}
              placeholder="Search friends by name..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            {friendResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                {friendResults.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => addFriend(f)}
                    className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {f.avatar_url ? (
                      <Image
                        src={f.avatar_url}
                        alt={f.display_name || f.username || "User"}
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {(
                          f.display_name ?? f.username ?? "?"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      {f.display_name ?? f.username ?? "Anonymous"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected friends */}
          {selectedFriends.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedFriends.map((f) => (
                <span
                  key={f.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full"
                >
                  {f.display_name ?? f.username ?? "Anonymous"}
                  <button
                    type="button"
                    onClick={() => removeFriend(f.id)}
                    className="hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Icon name="close" className="text-sm" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Creating..." : "Create Challenge"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
