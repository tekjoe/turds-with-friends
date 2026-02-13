"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

export interface PendingRequest {
  id: string;
  requester: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
  created_at: string;
}

export interface CommentNotification {
  id: string;
  message: string;
  referenceId: string | null;
  read: boolean;
  created_at: string;
  actor: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(dateStr: string): string {
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

type Tab = "all" | "social" | "competitive" | "reminders";

const tabs: { id: Tab; label: string }[] = [
  { id: "all", label: "All Activity" },
  { id: "social", label: "Social" },
  { id: "competitive", label: "Competitive" },
  { id: "reminders", label: "Reminders" },
];

export function ActivityClient({
  pendingRequests,
  commentNotifications = [],
}: {
  pendingRequests: PendingRequest[];
  commentNotifications?: CommentNotification[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [respondedIds, setRespondedIds] = useState<Set<string>>(new Set());

  const respond = async (friendshipId: string, action: "accept" | "decline") => {
    const method = action === "accept" ? "PATCH" : "DELETE";
    const res = await fetch("/api/friends/respond", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendship_id: friendshipId }),
    });

    if (res.ok) {
      setRespondedIds((prev) => new Set(prev).add(friendshipId));
      router.refresh();
    }
  };

  const visibleRequests = pendingRequests.filter((r) => !respondedIds.has(r.id));

  const showSocial = activeTab === "all" || activeTab === "social";

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold font-display tracking-tight">
            Activity
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Keep track of your gut health social circle.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 border-b-4 text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-8">
        {/* Today section */}
        <section>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Today
          </h3>
          <div className="space-y-3">
            {/* Real friend requests */}
            {showSocial && visibleRequests.map((req) => {
              const name = req.requester.display_name ?? req.requester.username ?? "Someone";
              const initials = getInitials(name);
              return (
                <div
                  key={req.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <div className="relative shrink-0">
                      {req.requester.avatar_url ? (
                        <Image
                          src={req.requester.avatar_url}
                          alt={name}
                          width={56}
                          height={56}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                          {initials}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 bg-primary w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                        <Icon
                          name="person_add"
                          className="text-[14px] font-bold text-white"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-base">
                          Friend Request: {name}
                        </h4>
                        <span className="text-xs text-slate-400 shrink-0 ml-2">
                          {timeAgo(req.created_at)}
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                        {name} wants to follow your gut health journey and share
                        Bristol Stool Chart insights.
                      </p>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => respond(req.id, "accept")}
                          className="bg-primary px-6 py-2 rounded-full text-xs font-bold text-white hover:bg-primary-dark transition-all cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => respond(req.id, "decline")}
                          className="bg-slate-100 dark:bg-slate-800 px-6 py-2 rounded-full text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Comment notifications */}
            {showSocial && commentNotifications.map((notif) => {
              const actorName = notif.actor.display_name ?? notif.actor.username ?? "Someone";
              const initials = getInitials(actorName);
              return (
                <div
                  key={notif.id}
                  className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow ${
                    !notif.read ? "ring-2 ring-primary/20" : ""
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="relative shrink-0">
                      {notif.actor.avatar_url ? (
                        <Image
                          src={notif.actor.avatar_url}
                          alt={actorName}
                          width={56}
                          height={56}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 font-bold text-lg">
                          {initials}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 bg-amber-500 w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                        <Icon
                          name="chat_bubble"
                          className="text-[14px] font-bold text-white"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-base">
                          New Comment
                        </h4>
                        <span className="text-xs text-slate-400 shrink-0 ml-2">
                          {timeAgo(notif.created_at)}
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                      {notif.referenceId && (
                        <div className="mt-3">
                          <Link
                            href={`/map?pin=${notif.referenceId}`}
                            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 px-5 py-2 rounded-full text-xs font-bold text-white transition-all"
                          >
                            <Icon name="map" className="text-sm" />
                            View Comment
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {showSocial && visibleRequests.length === 0 && commentNotifications.length === 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
                <p className="text-sm text-slate-400 text-center">No new activity.</p>
              </div>
            )}

          </div>
        </section>


      </div>
    </>
  );
}
