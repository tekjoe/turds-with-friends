"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { AddFriendModal } from "./AddFriendModal";

export interface FriendData {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  streak: number;
  lastEvent: string | null;
  lastBristolType: number | null;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatBristolType(type: number | null): { label: string; color: string } {
  if (type === null) return { label: "No logs", color: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" };
  const labels: Record<number, string> = {
    1: "Type 1 (Hard)",
    2: "Type 2 (Lumpy)",
    3: "Type 3 (Sausage)",
    4: "Type 4 (Smooth)",
    5: "Type 5 (Soft)",
    6: "Type 6 (Mushy)",
    7: "Type 7 (Liquid)",
  };
  const colors: Record<number, string> = {
    1: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    2: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    3: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    4: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    5: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    6: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    7: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return { label: labels[type] ?? `Type ${type}`, color: colors[type] ?? "" };
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

interface FriendsClientProps {
  friends: FriendData[];
  totalFriends: number;
  activeStreaks: number;
}

export function FriendsClient({ friends, totalFriends, activeStreaks }: FriendsClientProps) {
  const [copied, setCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("bowelbuddies.com/invite/8x92kz");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold font-display tracking-tight">
            Inner Circle
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
            Keep an eye on your friends&apos; digestive consistency and
            competitive streaks.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col px-6 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Total Friends
            </span>
            <span className="text-3xl font-bold font-display">{totalFriends}</span>
          </div>
          <div className="flex flex-col px-6 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Active Streaks
            </span>
            <span className="text-3xl font-bold font-display text-primary">
              {activeStreaks}
            </span>
          </div>
        </div>
      </div>

      {/* Friend Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {friends.map((friend) => {
          const bristol = formatBristolType(friend.lastBristolType);
          return (
            <div
              key={friend.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {friend.avatarUrl ? (
                    <Image
                      src={friend.avatarUrl}
                      alt={friend.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {getInitials(friend.name)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg leading-tight">
                      {friend.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      @{friend.username}
                    </p>
                  </div>
                </div>
                {friend.streak > 0 ? (
                  <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full">
                    <Icon name="local_fire_department" className="text-sm" filled />
                    <span className="text-xs font-bold">{friend.streak}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-400 px-2 py-1 rounded-full">
                    <Icon name="heart_broken" className="text-sm" />
                    <span className="text-xs font-bold">0</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-1">
                <div className="flex justify-between text-xs font-medium uppercase text-slate-400 tracking-wide">
                  <span>Last Event</span>
                  <span>Status</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">
                    {timeAgo(friend.lastEvent)}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${bristol.color}`}
                  >
                    {bristol.label}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <button className="flex-1 bg-primary/10 hover:bg-primary/20 text-green-800 dark:text-primary py-2.5 rounded-full text-sm font-bold transition-colors cursor-pointer">
                  View Stats
                </button>
              </div>
            </div>
          );
        })}

        {/* Add New Bestie Card */}
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center gap-4 hover:border-primary transition-colors cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
            <Icon name="add" className="text-3xl" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Add New Bestie</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tracking is better together!
            </p>
          </div>
        </button>
      </div>

      {/* Expand the Colony / Invite Section */}
      <section className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-full bg-primary/5 -skew-x-12 translate-x-32 hidden md:block" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          <div className="flex-1 space-y-3 sm:space-y-4 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">
              Expand the Colony
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
              Invite your friends to the party. More friends means more
              competition, more badges, and better gastro-awareness!
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-full text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 truncate text-center sm:text-left">
                bowelbuddies.com/invite/8x92kz
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={handleCopy}
                className="shrink-0 rounded-full"
              >
                <Icon name="content_copy" className="text-lg" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
          <div className="hidden md:flex w-1/3 justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-primary/20 animate-pulse" />
              <Icon
                name="share"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary text-6xl"
              />
            </div>
          </div>
        </div>
      </section>

      {showAddModal && (
        <AddFriendModal onClose={() => setShowAddModal(false)} />
      )}
    </>
  );
}
