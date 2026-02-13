"use client";

import { Icon } from "@/components/ui/Icon";
import { ShareButton } from "@/components/ui/ShareButton";
import { buildBadgeShareUrl, buildStreakShareUrl, buildLeaderboardShareUrl } from "@/lib/share";

interface Badge {
  id: string;
  name: string;
  description: string | null;
  earned_at: string;
}

interface AchievementsProps {
  badges: Badge[];
  currentStreak: number;
  longestStreak: number;
  xpTotal: number;
  leaderboardRank: number;
}

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100, 365];

export function Achievements({
  badges,
  currentStreak,
  longestStreak,
  xpTotal,
  leaderboardRank,
}: AchievementsProps) {
  // Determine what milestones to celebrate
  const milestones: Array<{
    type: "badge" | "streak" | "leaderboard";
    title: string;
    subtitle: string;
    value: string;
    shareTitle: string;
    shareText: string;
    imageUrl: string;
  }> = [];

  // Recent badges (earned in last 7 days)
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentBadges = badges.filter(
    (b) => new Date(b.earned_at).getTime() > sevenDaysAgo,
  );

  for (const badge of recentBadges.slice(0, 2)) {
    milestones.push({
      type: "badge",
      title: badge.name,
      subtitle: badge.description || "Badge earned!",
      value: "🏆",
      shareTitle: `${badge.name} on Bowel Buddies`,
      shareText: `I just earned the "${badge.name}" badge on Bowel Buddies! ${badge.description || ""}`,
      imageUrl: buildBadgeShareUrl(badge.name, ""),
    });
  }

  // Streak milestone (show if current streak hits a milestone)
  const streakMilestone = STREAK_MILESTONES.find((m) => currentStreak >= m && currentStreak < m * 1.5);
  if (streakMilestone && milestones.length < 3) {
    milestones.push({
      type: "streak",
      title: `${currentStreak}-Day Streak!`,
      subtitle: currentStreak === longestStreak ? "New personal best!" : "Keep it going!",
      value: `${currentStreak}`,
      shareTitle: `${currentStreak}-Day Streak on Bowel Buddies`,
      shareText: `I'm on a ${currentStreak}-day streak on Bowel Buddies! Longer than your Duolingo streak? 💩`,
      imageUrl: buildStreakShareUrl(currentStreak, ""),
    });
  }

  // Leaderboard rank (show if top 3)
  if (leaderboardRank <= 3 && milestones.length < 3) {
    milestones.push({
      type: "leaderboard",
      title: `#${leaderboardRank} Among Friends`,
      subtitle: `${xpTotal.toLocaleString()} XP earned`,
      value: `#${leaderboardRank}`,
      shareTitle: `#${leaderboardRank} on Bowel Buddies Leaderboard`,
      shareText: `I'm ranked #${leaderboardRank} among my friends on Bowel Buddies with ${xpTotal.toLocaleString()} XP! 💩`,
      imageUrl: buildLeaderboardShareUrl(leaderboardRank, xpTotal, ""),
    });
  }

  if (milestones.length === 0) return null;

  const gradients = {
    badge: "from-[#8B4513] to-[#A0522D]",
    streak: "from-primary to-primary-light",
    leaderboard: "from-[#D97706] to-[#F59E0B]",
  };

  const labels = {
    badge: "Badge Earned",
    streak: "Streak Milestone",
    leaderboard: "Leaderboard Rank",
  };

  return (
    <div className="bg-card rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-card-border overflow-hidden">
      <div className="p-5 pb-3">
        <h2 className="text-base font-display font-semibold flex items-center gap-2">
          <Icon name="celebration" className="text-lg text-primary" />
          Recent Achievements
        </h2>
      </div>

      <div className="divide-y divide-border-light">
        {milestones.map((milestone, i) => (
          <div key={i} className="px-5 py-4 flex items-center gap-3">
            {/* Icon circle */}
            <div
              className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradients[milestone.type]} flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-sm`}
            >
              {milestone.value}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-0.5">
                {labels[milestone.type]}
              </p>
              <p className="text-sm font-bold text-card-foreground truncate">
                {milestone.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {milestone.subtitle}
              </p>
            </div>

            {/* Share */}
            <ShareButton
              title={milestone.shareTitle}
              text={milestone.shareText}
              imageUrl={milestone.imageUrl}
              variant="icon"
              className="flex-shrink-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
