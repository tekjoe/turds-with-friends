"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Podium } from "./Podium";
import { LeaderboardTable } from "./LeaderboardTable";
import { FriendSearch } from "./FriendSearch";
import { PendingInvites } from "./PendingInvites";
import { FriendsList } from "./FriendsList";

interface PodiumUser {
  id: string;
  name: string;
  avatar?: string;
  streak: number;
  points: number;
  rank: 1 | 2 | 3;
}

interface TableUser {
  id: string;
  rank: number;
  name: string;
  initials: string;
  avatar?: string;
  streak: number;
  points: number;
  isCurrentUser?: boolean;
}

interface Invite {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  timeAgo: string;
}

interface FriendItem {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  isOnline: boolean;
  status?: string;
  lastSeen?: string;
}

interface LeaderboardClientProps {
  globalPodium: PodiumUser[];
  globalTable: TableUser[];
  friendsPodium: PodiumUser[];
  friendsTable: TableUser[];
  pendingInvites: Invite[];
  friendsList: FriendItem[];
  userGlobalRank: number | null;
  userXp: number;
  totalUsers: number;
}

export function LeaderboardClient({
  globalPodium,
  globalTable,
  friendsPodium,
  friendsTable,
  pendingInvites,
  friendsList,
  userGlobalRank,
  userXp,
  totalUsers,
}: LeaderboardClientProps) {
  const router = useRouter();
  const [view, setView] = useState<"global" | "friends">("global");
  const [respondedIds, setRespondedIds] = useState<Set<string>>(new Set());

  const activePodium = view === "global" ? globalPodium : friendsPodium;
  const activeTable = view === "global" ? globalTable : friendsTable;
  const visibleInvites = pendingInvites.filter((i) => !respondedIds.has(i.id));

  const handleAcceptInvite = async (id: string) => {
    const res = await fetch("/api/friends/respond", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendship_id: id }),
    });
    if (res.ok) {
      setRespondedIds((prev) => new Set(prev).add(id));
      router.refresh();
    }
  };

  const handleDeclineInvite = async (id: string) => {
    const res = await fetch("/api/friends/respond", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendship_id: id }),
    });
    if (res.ok) {
      setRespondedIds((prev) => new Set(prev).add(id));
      router.refresh();
    }
  };

  const rankDisplay = userGlobalRank
    ? `#${userGlobalRank.toLocaleString()} / ${totalUsers.toLocaleString()}`
    : `— / ${totalUsers.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-background pb-24 pt-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
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
                  className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    view === "global"
                      ? "bg-white dark:bg-slate-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  Global
                </button>
                <button
                  onClick={() => setView("friends")}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
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
            {activePodium.length >= 3 ? (
              <Podium users={activePodium} />
            ) : activePodium.length > 0 ? (
              <div className="mb-8 p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-slate-500">
                  Need at least 3 users for the podium. Add more friends!
                </p>
              </div>
            ) : (
              <div className="mb-8 p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-slate-500">No leaderboard data yet.</p>
              </div>
            )}

            {/* Leaderboard Table */}
            {activeTable.length > 0 && <LeaderboardTable users={activeTable} />}
          </div>

          {/* Right Column: Social */}
          <div className="w-full md:w-80 space-y-8">
            <FriendSearch />
            <PendingInvites
              invites={visibleInvites}
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
                Invite friends and earn a 'Golden Fiber' badge.
              </p>
              <Link href="/friends">
                <Button variant="primary" className="w-full">
                  Invite Friends
                </Button>
              </Link>
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
              <p className="text-lg font-black text-primary">{rankDisplay}</p>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                Total Points
              </p>
              <p className="text-lg font-black">{userXp.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex gap-2">
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
