const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bowelbuddies.app";

export type ShareCardType = "badge" | "streak" | "leaderboard";

interface ShareCardParams {
  type: ShareCardType;
  title: string;
  subtitle?: string;
  value?: string;
  username?: string;
  icon?: string;
}

export function buildShareImageUrl(params: ShareCardParams): string {
  const url = new URL(`${APP_URL}/api/og/achievement`);
  url.searchParams.set("type", params.type);
  url.searchParams.set("title", params.title);
  if (params.subtitle) url.searchParams.set("subtitle", params.subtitle);
  if (params.value) url.searchParams.set("value", params.value);
  if (params.username) url.searchParams.set("username", params.username);
  if (params.icon) url.searchParams.set("icon", params.icon);
  return url.toString();
}

export function buildBadgeShareUrl(badgeName: string, username: string): string {
  return buildShareImageUrl({
    type: "badge",
    title: badgeName,
    subtitle: "Badge earned on Bowel Buddies!",
    icon: "🏆",
    username,
  });
}

export function buildStreakShareUrl(streakDays: number, username: string): string {
  return buildShareImageUrl({
    type: "streak",
    title: `${streakDays}-Day Streak!`,
    subtitle: "Longer than your Duolingo streak?",
    value: `${streakDays}`,
    username,
  });
}

export function buildLeaderboardShareUrl(rank: number, xp: number, username: string): string {
  return buildShareImageUrl({
    type: "leaderboard",
    title: `#${rank} on the Leaderboard`,
    subtitle: `${xp.toLocaleString()} XP earned`,
    value: `#${rank}`,
    username,
  });
}

export async function shareAchievement(params: {
  title: string;
  text: string;
  url?: string;
}): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: params.title,
        text: params.text,
        url: params.url || APP_URL,
      });
      return true;
    } catch {
      // User cancelled or share failed
      return false;
    }
  }

  // Fallback: copy to clipboard
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    const shareText = `${params.title}\n${params.text}\n${params.url || APP_URL}`;
    await navigator.clipboard.writeText(shareText);
    return true;
  }

  return false;
}
