"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthNavbar } from "@/components/ui/AuthNavbar";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Podium } from "@/components/leaderboard/Podium";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { FriendSearch } from "@/components/leaderboard/FriendSearch";
import { PendingInvites } from "@/components/leaderboard/PendingInvites";
import { FriendsList } from "@/components/leaderboard/FriendsList";

// Sample data
const podiumUsers = [
  { id: "1", name: "Sam Healthy", streak: 34, points: 3120, rank: 1 as const },
  { id: "2", name: "Alex River", streak: 12, points: 2450, rank: 2 as const },
  { id: "3", name: "Jordan Peak", streak: 8, points: 1980, rank: 3 as const },
];

const tableUsers = [
  { id: "4", rank: 4, name: "Oliver Smith", initials: "OS", streak: 7, points: 1850 },
  { id: "5", rank: 5, name: "Emma Woods", initials: "EW", streak: 5, points: 1720 },
  { id: "6", rank: 12, name: "SuperPooper", initials: "SP", streak: 4, points: 1145, isCurrentUser: true },
  { id: "7", rank: 13, name: "Marcus Lane", initials: "ML", streak: 2, points: 980 },
];

const pendingInvites = [
  { id: "1", name: "Leo G.", initials: "LG", timeAgo: "2h ago" },
];

const friendsList = [
  { id: "1", name: "Sarah Miles", initials: "SM", isOnline: true, status: "Bristol Type 3" },
  { id: "2", name: "Dave Chen", initials: "DC", isOnline: false, lastSeen: "4h ago" },
  { id: "3", name: "Riley Blue", initials: "RB", isOnline: true, status: "New Badge!" },
];

export default function LeaderboardPage() {
  const [view, setView] = useState<"global" | "friends">("global");

  const handleAcceptInvite = (id: string) => {
    console.log("Accept invite:", id);
    // TODO: Implement with Supabase
  };

  const handleDeclineInvite = (id: string) => {
    console.log("Decline invite:", id);
    // TODO: Implement with Supabase
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <AuthNavbar
        userName="SuperPooper"
        userLevel="Level 5 Stool Master"
        userInitials="SP"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Leaderboard */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold font-display">Leaderboard</h1>
                <p className="text-slate-500 dark:text-slate-400">
                  Compete for the ultimate gut health status.
                </p>
              </div>
              <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  onClick={() => setView("global")}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                    view === "global"
                      ? "bg-white dark:bg-slate-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  Global
                </button>
                <button
                  onClick={() => setView("friends")}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                    view === "friends"
                      ? "bg-white dark:bg-slate-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  Friends
                </button>
              </div>
            </div>

            {/* Podium */}
            <Podium users={podiumUsers} />

            {/* Leaderboard Table */}
            <LeaderboardTable users={tableUsers} />
          </div>

          {/* Right Column: Social */}
          <div className="w-full md:w-80 space-y-8">
            <FriendSearch />
            <PendingInvites
              invites={pendingInvites}
              onAccept={handleAcceptInvite}
              onDecline={handleDeclineInvite}
            />
            <FriendsList friends={friendsList} />

            {/* Invite CTA */}
            <div className="bg-primary/10 p-6 rounded-xl border border-primary/20 text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-3">
                <Icon name="person_add" />
              </div>
              <h4 className="font-bold mb-1">Spread the health!</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                Invite friends and earn a &apos;Golden Fiber&apos; badge.
              </p>
              <Button variant="primary" className="w-full">
                Invite Friends
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Stats Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-3 shadow-2xl z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="hidden sm:block">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                Global Rank
              </p>
              <p className="text-lg font-black text-primary">#1,432 / 24,000</p>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-800"></div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                Total Points
              </p>
              <p className="text-lg font-black">12,450</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="flex items-center gap-2">
              <Icon name="share" className="text-sm" />
              <span className="hidden sm:inline">Share Rank</span>
            </Button>
            <Link href="/log">
              <Button variant="primary" size="sm" className="flex items-center gap-2">
                <Icon name="add" className="text-sm" />
                <span>Log New Movement</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
