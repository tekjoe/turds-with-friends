"use client";

import { ShareButton } from "@/components/ui/ShareButton";
import type { ShareCardType } from "@/lib/share";

interface AchievementCardProps {
  type: ShareCardType;
  title: string;
  subtitle: string;
  value: string;
  icon?: string;
}

const gradients: Record<ShareCardType, string> = {
  badge: "from-[#8B4513] to-[#A0522D]",
  streak: "from-[#C05621] to-[#ED8936]",
  leaderboard: "from-[#D97706] to-[#F59E0B]",
};

export function AchievementCard({
  type,
  title,
  subtitle,
  value,
  icon,
}: AchievementCardProps) {
  const shareText = `${title} - ${subtitle}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bowelbuddies.app";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
      {/* Top gradient bar */}
      <div className={`h-1 bg-gradient-to-r ${gradients[type]}`} />

      <div className="p-5 flex items-center gap-4">
        {/* Icon circle */}
        <div
          className={`w-14 h-14 rounded-full bg-gradient-to-br ${gradients[type]} flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-md`}
        >
          {icon || value}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-0.5">
            {type === "badge" && "Badge Earned"}
            {type === "streak" && "Streak Milestone"}
            {type === "leaderboard" && "Leaderboard Rank"}
          </p>
          <p className="font-bold text-slate-800 dark:text-slate-100 truncate">
            {title}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {subtitle}
          </p>
        </div>

        {/* Share button */}
        <ShareButton
          title={`${title} on Bowel Buddies`}
          text={shareText}
          url={appUrl}
          variant="icon"
        />
      </div>
    </div>
  );
}
