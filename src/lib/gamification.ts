import type { MovementLog, Profile, Badge } from "@/types/database";

// XP Constants
export const XP_PER_LOG = 50;
export const XP_STREAK_BONUS_3_DAYS = 25;
export const XP_STREAK_BONUS_7_DAYS = 50;
export const XP_STREAK_BONUS_14_DAYS = 100;
export const XP_STREAK_BONUS_30_DAYS = 250;

// Level calculation
export function calculateLevel(xp: number): number {
  return Math.floor(xp / 500) + 1;
}

export function getXPForNextLevel(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP);
  return currentLevel * 500;
}

export function getXPProgress(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP);
  const xpForCurrentLevel = (currentLevel - 1) * 500;
  const xpForNextLevel = currentLevel * 500;
  return ((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
}

export function getLevelTitle(level: number): string {
  if (level >= 50) return "Legendary Bowel Master";
  if (level >= 40) return "Elite Stool Sage";
  if (level >= 30) return "Master of the Porcelain";
  if (level >= 25) return "Stool Master";
  if (level >= 20) return "Gut Guru";
  if (level >= 15) return "Fiber Champion";
  if (level >= 10) return "Regular Ranger";
  if (level >= 5) return "Movement Apprentice";
  return "Bowel Beginner";
}

// Streak bonus calculation
export function calculateStreakBonus(streak: number): number {
  if (streak >= 30) return XP_STREAK_BONUS_30_DAYS;
  if (streak >= 14) return XP_STREAK_BONUS_14_DAYS;
  if (streak >= 7) return XP_STREAK_BONUS_7_DAYS;
  if (streak >= 3) return XP_STREAK_BONUS_3_DAYS;
  return 0;
}

// Points calculation (XP + bonuses)
export function calculatePoints(profile: Profile, logs: MovementLog[]): number {
  let points = profile.xp_total;

  // Add streak bonus
  points += calculateStreakBonus(profile.current_streak) * Math.floor(profile.current_streak / 7);

  // Bonus for ideal stool types (3-4)
  const idealLogs = logs.filter(log => log.bristol_type === 3 || log.bristol_type === 4);
  points += idealLogs.length * 10;

  return points;
}

// Badge criteria checking
export interface BadgeCriteria {
  type: string;
  days?: number;
  count?: number;
  xp?: number;
}

export function checkBadgeEligibility(
  profile: Profile,
  logs: MovementLog[],
  badge: Badge
): boolean {
  const criteria = badge.criteria as BadgeCriteria | null;
  if (!criteria) return false;

  switch (criteria.type) {
    case "first_log":
      return logs.length >= 1;

    case "streak":
      return profile.longest_streak >= (criteria.days ?? 0);

    case "ideal_count":
      const idealLogs = logs.filter(log => log.bristol_type === 3 || log.bristol_type === 4);
      return idealLogs.length >= (criteria.count ?? 0);

    case "total_logs":
      return logs.length >= (criteria.count ?? 0);

    case "xp_milestone":
      return profile.xp_total >= (criteria.xp ?? 0);

    case "ideal_streak":
      // Check for consecutive days of ideal stools
      const sortedLogs = [...logs].sort(
        (a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime()
      );
      let idealStreak = 0;
      let lastDate: string | null = null;

      for (const log of sortedLogs) {
        if (log.bristol_type !== 3 && log.bristol_type !== 4) {
          break;
        }
        const logDate = new Date(log.logged_at).toDateString();
        if (lastDate === null || lastDate !== logDate) {
          idealStreak++;
          lastDate = logDate;
        }
      }
      return idealStreak >= (criteria.days ?? 0);

    default:
      return false;
  }
}

// Bristol stool type descriptions
export const bristolDescriptions: Record<number, { status: string; color: string; description: string }> = {
  1: { status: "Very Constipated", color: "text-red-500", description: "Separate hard lumps" },
  2: { status: "Slightly Constipated", color: "text-orange-500", description: "Lumpy, sausage-shaped" },
  3: { status: "Normal", color: "text-green-500", description: "Sausage with cracks" },
  4: { status: "Normal", color: "text-green-500", description: "Smooth, soft sausage" },
  5: { status: "Lacking Fiber", color: "text-blue-500", description: "Soft blobs" },
  6: { status: "Inflammation", color: "text-orange-500", description: "Mushy, ragged edges" },
  7: { status: "Diarrhea", color: "text-red-500", description: "Entirely liquid" },
};

// Get health status based on recent logs
export function getHealthStatus(logs: MovementLog[]): {
  status: "excellent" | "good" | "fair" | "poor";
  message: string;
} {
  if (logs.length === 0) {
    return { status: "fair", message: "Start logging to track your health!" };
  }

  const recentLogs = logs.slice(0, 7); // Last 7 logs
  const idealCount = recentLogs.filter(
    (log) => log.bristol_type === 3 || log.bristol_type === 4
  ).length;
  const idealPercentage = (idealCount / recentLogs.length) * 100;

  if (idealPercentage >= 80) {
    return { status: "excellent", message: "Your gut health is excellent! Keep it up!" };
  }
  if (idealPercentage >= 60) {
    return { status: "good", message: "Good consistency! Consider more fiber." };
  }
  if (idealPercentage >= 40) {
    return { status: "fair", message: "Room for improvement. Check your diet." };
  }
  return { status: "poor", message: "Consider consulting a healthcare professional." };
}

// Format points for display
export function formatPoints(points: number): string {
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}k`;
  }
  return points.toString();
}

// Calculate weight lost from logs
export function calculateWeightLost(logs: MovementLog[]): number {
  return logs.reduce((total, log) => {
    if (log.pre_weight && log.post_weight) {
      return total + (log.pre_weight - log.post_weight);
    }
    return total;
  }, 0);
}

// Get consistency breakdown for charts
export function getConsistencyBreakdown(logs: MovementLog[]): Array<{
  name: string;
  value: number;
  color: string;
}> {
  const total = logs.length;
  if (total === 0) {
    return [
      { name: "No Data", value: 100, color: "#94a3b8" },
    ];
  }

  const constipated = logs.filter((l) => l.bristol_type <= 2).length;
  const ideal = logs.filter((l) => l.bristol_type === 3 || l.bristol_type === 4).length;
  const lackingFiber = logs.filter((l) => l.bristol_type === 5).length;
  const liquid = logs.filter((l) => l.bristol_type >= 6).length;

  return [
    { name: "Type 1 & 2 (Constipated)", value: Math.round((constipated / total) * 100), color: "#78350f" },
    { name: "Type 3 & 4 (Ideal)", value: Math.round((ideal / total) * 100), color: "#059669" },
    { name: "Type 5 (Fiber Lacking)", value: Math.round((lackingFiber / total) * 100), color: "#d97706" },
    { name: "Type 6 & 7 (Liquid/Inflam)", value: Math.round((liquid / total) * 100), color: "#e11d48" },
  ];
}
