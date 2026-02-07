"use client";

import { Icon } from "@/components/ui/Icon";

interface Participant {
  id: string;
  user_id: string;
  status: "invited" | "accepted" | "declined";
  progress: number;
  userName: string;
  avatarUrl: string | null;
}

interface ChallengeCardProps {
  id: string;
  title: string;
  challengeType: "most_logs" | "longest_streak" | "most_weight_lost";
  startDate: string;
  endDate: string;
  status: "pending" | "active" | "completed";
  creatorName: string;
  participants: Participant[];
  currentUserId: string;
  onRespond: (challengeId: string, status: "accepted" | "declined") => void;
}

const TYPE_LABELS: Record<string, string> = {
  most_logs: "Most Logs",
  longest_streak: "Longest Streak",
  most_weight_lost: "Most Weight Lost",
};

const TYPE_ICONS: Record<string, string> = {
  most_logs: "edit_note",
  longest_streak: "local_fire_department",
  most_weight_lost: "monitor_weight",
};

const UNIT_LABELS: Record<string, string> = {
  most_logs: "logs",
  longest_streak: "days",
  most_weight_lost: "lbs",
};

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function ChallengeCard({
  id,
  title,
  challengeType,
  startDate,
  endDate,
  status,
  creatorName,
  participants,
  currentUserId,
  onRespond,
}: ChallengeCardProps) {
  const myParticipation = participants.find((p) => p.user_id === currentUserId);
  const isInvited = myParticipation?.status === "invited";

  const sortedParticipants = [...participants]
    .filter((p) => p.status === "accepted")
    .sort((a, b) => b.progress - a.progress);

  const maxProgress = Math.max(...sortedParticipants.map((p) => p.progress), 1);

  const statusColor =
    status === "active"
      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
      : status === "completed"
        ? "bg-slate-100 dark:bg-slate-800 text-slate-500"
        : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon
              name={TYPE_ICONS[challengeType]}
              className="text-xl text-primary"
            />
          </div>
          <div>
            <h3 className="font-bold font-display">{title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              by {creatorName} &middot; {formatDate(startDate)} &ndash;{" "}
              {formatDate(endDate)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
            {TYPE_LABELS[challengeType]}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded capitalize ${statusColor}`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Participant progress */}
      {sortedParticipants.length > 0 && (
        <div className="space-y-3 mb-4">
          {sortedParticipants.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 w-5 text-right">
                {i + 1}
              </span>
              {p.avatarUrl ? (
                <img
                  src={p.avatarUrl}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {p.userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate">
                    {p.userName}
                    {p.user_id === currentUserId && (
                      <span className="text-xs text-slate-400 ml-1">(you)</span>
                    )}
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-2">
                    {p.progress} {UNIT_LABELS[challengeType]}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: `${Math.round((p.progress / maxProgress) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invited participants waiting */}
      {participants.filter((p) => p.status === "invited").length > 0 && (
        <p className="text-xs text-slate-400 mb-4">
          {participants.filter((p) => p.status === "invited").length} pending
          invitation(s)
        </p>
      )}

      {/* Accept/Decline buttons */}
      {isInvited && (
        <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onRespond(id, "accepted")}
            className="flex-1 py-2 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => onRespond(id, "declined")}
            className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-sm rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
}
